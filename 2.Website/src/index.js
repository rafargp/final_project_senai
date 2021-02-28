let rpmChart = null;
let kmhChart = null;
let carChart = null;
let mqtt;
let startDate = moment().startOf('day').subtract(3, 'hours').toISOString();
let endDate = moment().subtract(3, 'hours').toISOString();
let selectedCar = -1;
let selectedTravel = -1;
let carState = "All";

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
        $("#carsContainer .badge").each(function (i, badge) {
            badge.remove();
        });
        $(this).append(`<span class="badge bg-warning">Selecionado</span>`);
        client.selectCar(id, startDate, endDate, carState);
    });
    $(document).on("click", "[name=btnTravel]", function (e) {
        e.preventDefault();
        let id = $(this).data("id");
        selectedTravel = id;
        $("#travelsContainer .badge").each(function (i, badge) {
            badge.remove();
        });
        $(this).append(`<span class="badge bg-warning">Selecionado</span>`);
        client.selectTravel(id, startDate, endDate, carState);
    });
    $(document).on("change", "#CarState", function (e) {
        e.preventDefault();
        carState = $("#CarState option:selected").val();
        client.selectTravel(selectedTravel, startDate, endDate, carState);
    });

    $(document).on("click", "#btnTacometer", function (e) {
        let visible = $(this).data("tacometer");
        if (visible == 1) {
            $(this).data("tacometer", 0);
            $("#rpmChartContainer").parent().removeClass("col-sm-3");
            $("#rpmChartContainer").parent().hide()
            $("#kmhChartContainer").parent().removeClass("col-sm-3");
            $("#kmhChartContainer").parent().hide()
            $("#carChartContainer").parent().removeClass("col-sm-6");
            $("#carChartContainer").parent().addClass("col-sm-12");
            $(this).html(`<i class="fas fa-compress-arrows-alt"></i>`);
        } else {
            $(this).data("tacometer", 1);
            $("#rpmChartContainer").parent().addClass("col-sm-3");
            $("#rpmChartContainer").parent().show()
            $("#kmhChartContainer").parent().addClass("col-sm-3");
            $("#kmhChartContainer").parent().show()
            $("#carChartContainer").parent().removeClass("col-sm-12");
            $("#carChartContainer").parent().addClass("col-sm-6");
            $(this).html(`<i class="fas fa-expand-arrows-alt"></i>`);
        }
        client.selectTravel(selectedTravel, startDate, endDate, carState);
    });
    $('#reservationtime').daterangepicker(
        {
            showTimezone: true,
            timePicker: true,
            timePickerIncrement: 1,
            //minDate: moment(),
            //maxDate: moment().add(6, 'month'),
            //maxDate: moment(),
            //dateLimit: { days: 5 },
            startDate: moment().startOf('day').add(0, 'hour'),
            endDate: moment().endOf('day'),
            locale: {
                format: 'DD/MM/YYYY hh:mm:ss A'
            },
        },
        function (start, end) {
            startDate = start.subtract(3, 'hours').toISOString();
            endDate = end.subtract(3, 'hours').toISOString();
            client.setupTravels(selectedCar);
            client.selectTravel(selectedTravel, startDate, endDate, carState);
        }
    );

    client.setup();

});
let client = {
    setup: function () {
        $("#carsCard .overlay").removeClass("d-none");
        $("#travelsCard .overlay").removeClass("d-none");

        let cars = Cars.getAll();
        let html = "";
        $(cars).each(function (i, item) {
            html += `<a class="btn btn-app" name="btnCar" data-id="${item.carVIN}"><i class="fas fa-car"></i>${item.name == undefined ? item.carVIN : item.name}</a>`;
        });
        $("#carsContainer").html(html);

        html = `<a class="btn btn-app" name="btnTravel" data-id="All"><i class="fas fa-road"></i>Todas</a>`;
        $("#travelsContainer").html(html);

        $("#carsCard .overlay").addClass("d-none");
        $("#travelsCard .overlay").addClass("d-none");

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
        let data = JSON.parse(message._getPayloadString());
        let dataRPM = data.sensors.find(x => x.pid == "0C").value;
        let dataKmh = data.sensors.find(x => x.pid == "0D").value;

        gaugeChart.setPoint(rpmChart, dataRPM);
        gaugeChart.setPoint(kmhChart, dataKmh);

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
    selectCar: function (id) {
        if (id == -1) {
            Toast.fire({
                icon: 'warning',
                title: 'Selecione um Carro!'
            });
            return;
        }

       client.setupTravels(id);
       if(selectedTravel != -1) client.selectTravel(selectedTravel, startDate, endDate, carState);
    },
    setupTravels: function(carId){
        $("#travelsCard .overlay").removeClass("d-none");

        let travels = Cars.getTravels(carId, startDate, endDate);
        
        let html = `<a class="btn btn-app" name="btnTravel" data-id="All"><i class="fas fa-road"></i>Todas${selectedTravel == "All"?"<span class='badge bg-warning'>Selecionado</span>":""}</a>`;
        let selected = false
        $(travels).each(function (i, item) {
            if(item.id == selectedTravel) selected = true;
            let ts = new Date(item.timestamp);
            ts.setHours(ts.getHours() + 3);
            let title = `${ts.toLocaleDateString()} ${ts.toLocaleTimeString()}`;
            html += `<a class="btn btn-app" name="btnTravel" data-id="${item.id}"><i class="fas fa-road"></i>${title}${item.id == selectedTravel?"<span class='badge bg-warning'>Selecionado</span>":""}</a>`;
        });
        if(selectedTravel != "All" && !selected) selectedTravel = -1;
        $("#travelsContainer").html(html);
        
        $("#travelsCard .overlay").addClass("d-none");
    },
    selectTravel: function (id, startDate = null, endDate = null, carState = null) {
        if (id == -1) {
            Toast.fire({
                icon: 'warning',
                title: 'Selecione uma Viagem!'
            });
            return;
        } else if (selectedCar == -1) {
            Toast.fire({
                icon: 'warning',
                title: 'Selecione um Carro!'
            });
            return;
        }

        this.setupChart();

        let dataRPM;
        let dataKmh;

        if (id == "All") {
            dataRPM = Cars.getSensors(selectedCar, "0C", startDate, endDate, carState);
            dataKmh = Cars.getSensors(selectedCar, "0D", startDate, endDate, carState);
        } else {
            dataRPM = Travels.getSensors(id, "0C", startDate, endDate, carState);
            dataKmh = Travels.getSensors(id, "0D", startDate, endDate, carState);
        }

        dataRPM = dataRPM.map(x => [Date.parse(x.receive_date), x.value]);
        dataKmh = dataKmh.map(x => [Date.parse(x.receive_date), x.value]);

        carChart.series[0].setData(dataKmh);
        carChart.series[1].setData(dataRPM);

        gaugeChart.setPoint(rpmChart, dataRPM[dataRPM.length - 1]);
        gaugeChart.setPoint(kmhChart, dataKmh[dataKmh.length - 1]);

        let maxRPM = 0;
        if (dataRPM.length > 0) maxRPM = Math.max.apply(Math, dataRPM.map(function (o) { return o[1]; }))
        let maxKMH = 0;
        if (dataKmh.length > 0) maxKMH = Math.max.apply(Math, dataKmh.map(function (o) { return o[1]; }))

        $("#TopKmh").html(`${maxKMH} Km/h`)
        $("#TopRpm").html(`${maxRPM} RPM`);
        $("#countRecords").html(`Registros: ${dataRPM.length}`);
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