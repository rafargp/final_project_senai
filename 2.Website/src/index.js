let rpmChart = null;
let kmhChart = null;
let carChart = null;
let mqtt;
let startDate = moment().startOf('day').add(0, 'hour').toISOString();
let endDate = moment().toISOString();
let selectedCar = -1;
$(document).ready(function () {

    $(document).on('click', "#btnDashMotor", function (e) {
        e.preventDefault();
        $("#motorDashboard").removeClass("d-none");
        $("#locationDashboard").addClass("d-none");
    });

    $(document).on('click', "#btnDashLocation", function (e) {
        e.preventDefault();
        $("#motorDashboard").addClass("d-none");
        $("#locationDashboard").removeClass("d-none");
    });

    $(document).on("click", "[name=btnCar]", function (e) {
        e.preventDefault();
        let id = $(this).data("id");
        selectedCar = id;
        client.selectCar(id,startDate,endDate);
    });

    client.setup();

    $('#reservationtime').daterangepicker(
        {
            lang: 'pt-BR',
            showTimezone: true,
            timePicker: true,
            timePickerIncrement: 1,
            //minDate: moment(),
            //maxDate: moment().add(6, 'month'),
            maxDate: moment(),
            //dateLimit: { days: 5 },
            startDate: moment().startOf('day').add(0, 'hour'),
            endDate: moment(),
            locale: {
                format: 'DD/MM/YYYY hh:mm A'
            },
        },
        function (start, end) {
            startDate = start.toISOString();
            endDate = end.toISOString();
            client.selectCar(selectedCar,startDate,endDate);
        }
    );
    
    
});
let client = {
    setup: function () {
        $("#carsCard .overlay").removeClass("d-none");

        let cars = Cars.getAll();

        $(cars).each(function (i, item) {
            let html = $("#carsContainer").html();
            html += `<a class="btn btn-app" name="btnCar" data-id="${item.CarVin}"><i class="fas fa-car"></i>${item.Name == undefined ? item.carVIN : item.Name}</a>`;
            $("#carsContainer").html(html);
        });

        $("#carsCard .overlay").addClass("d-none");

        this.setupChart();
        this.setupMQTT();
    },
    setupMQTT: function () {
        var host = "rafaelgomes.ddns.net";
        var port = 9001;
        mqtt = new Paho.MQTT.Client(host, port, "clientjs");

        var options = {
            timeout: 3,
            onSuccess: client.onConnectMQTT,
            onFailure: client.onFailureMQTT,
        };

        mqtt.onMessageArrived = client.onMessageArrivedMQTT;

        mqtt.connect(options);

    },
    onFailureMQTT: function (message) {
        console.log(message);
    },
    onConnectMQTT: function () {
        mqtt.subscribe("/sensors");
        // message = new Paho.MQTT.Message("Hello World");
        // message.destinationName = "/sensor1";
        // mqtt.send(message);
    },
    onMessageArrivedMQTT: function (message) {
        console.log(`MQTT: ${message}`);
        let lSensors = message.sensors.length;
        for (x = 0; x < lSensors; x++) {
            let item = message.sensors[x];
            query += `VALUES ('${data.car_id}','${item.sensor}','${item.value}','${item.unit}',STR_TO_DATE( "2021-01-01 00:00:00", "%Y-%m-%d %H:%i:%s" ));\n`;
        }
        return msg;
    },
    setupChart: function () {
        if (rpmChart != null) gaugeChart.clearChart(rpmChart);
        if (kmhChart != null) gaugeChart.clearChart(kmhChart);
        if (carChart != null) lineChart.clearChart(carChart);
        rpmChart = gaugeChart.setup("rpmChartContainer", 0, 9000, "Motor", "RPM", "RPM", "#F00");
        kmhChart = gaugeChart.setup("kmhChartContainer", 0, 220, "Velocidade", "velocidade", "Km/h", "#00F");
        carChart = lineChart.setup("carChartContainer", "Resumo");
    },
    selectCar: function (id, startDate = null, endDate = null) {
        this.setupChart();
        let dataRPM = Cars.getSensorByPID(id, "0C");
        let dataKmh = Cars.getSensorByPID(id, "0D");

        if (startDate != null) {
            dataRPM = dataRPM.filter(x => new Date(x.receive_date) >= new Date(startDate));
            dataKmh = dataKmh.filter(x => new Date(x.receive_date) >= new Date(startDate));
        }
        if (endDate != null) {
            dataRPM = dataRPM.filter(x => x.receive_date <= endDate);
            dataKmh = dataKmh.filter(x => x.receive_date <= endDate);
        }

        dataRPM = dataRPM.map(x => [Date.parse(x.receive_date), x.value]);
        dataKmh = dataKmh.map(x => [Date.parse(x.receive_date), x.value]);

        carChart.series[0].setData(dataKmh);
        carChart.series[1].setData(dataRPM);

        gaugeChart.setPoint(rpmChart, dataRPM[dataRPM.length - 1]);
        gaugeChart.setPoint(kmhChart, dataKmh[dataKmh.length - 1]);
    }
};
let gaugeChart = {
    setup: function (id, min, max, title, name, unit, color) {
        var json = {};
        json.chart = {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        };
        json.credits = { enabled: false };
        json.title = { text: title, enabled: false };;
        json.pane = { startAngle: -150, endAngle: 150 };
        json.yAxis = [{
            min: min,
            max: max,
            lineColor: color,
            tickColor: color,
            minorTickColor: color,
            offset: -25,
            lineWidth: 2,
            labels: { distance: -20, rotation: 'auto' },
            tickLength: 5,
            minorTickLength: 5,
            endOnTick: false
        }];

        json.series = [{
            name: name,
            data: [0],
            dataLabels: {
                formatter: function () {
                    return `<span style="color:#339">${this.y} ${unit}</span>`;
                },
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [[0, '#DDD'], [1, '#FFF']]
                }
            },
            tooltip: { valueSuffix: ` ${unit}` }
        }];

        return $(`#${id}`).highcharts(json);
    },
    setPoint: function (chart, point) {
        $(chart).highcharts().series[0].points[0].update(point);
    },
    clearChart: function (chart) {
        this.setPoint(chart, 0);
    }
}
let lineChart = {
    setup: function (id, text) {
        return Highcharts.chart(`${id}`, {
            chart: { zoomType: 'xy' },
            title: { text: text },
            xAxis: [{ type: 'datetime', crosshair: true }],
            yAxis: [{
                labels: {
                    format: '{value} RPM',
                    style: { color: Highcharts.getOptions().colors[1] }
                },
                title: {
                    text: 'Motor',
                    style: { color: Highcharts.getOptions().colors[1] }
                }
            }, {
                title: {
                    text: 'Velocity',
                    style: { color: Highcharts.getOptions().colors[0] }
                },
                labels: {
                    format: '{value} Km/h',
                    style: { color: Highcharts.getOptions().colors[0] }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)'
            },
            series: [{
                yAxis: 1,
                type: 'column',
                name: 'Velocidade',
                tooltip: { valueSuffix: ' Km/h' }
            }, {
                name: 'Motor',
                type: 'spline',
                tooltip: { valueSuffix: ' RPM' }
            }],
        });
    },
    setPoint(chart, rpm, kmh) {
        chart.series[0].addPoint(kmh);
        chart.series[1].addPoint(rpm);
    },
    clearChart: function (chart) {
        while (chart.series.length > 0) chart.series[0].remove(true)
    }
}
let Helper = {
    groupBy: function (collection, property) {
        var i = 0, val, index,
            values = [], result = [];
        for (; i < collection.length; i++) {
            val = collection[i][property];
            index = values.indexOf(val);
            if (index > -1)
                result[index].push(collection[i]);
            else {
                values.push(val);
                result.push([collection[i]]);
            }
        }
        return { groups: result, keys: values };
    }
}