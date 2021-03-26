let carChart = null;
let startDate = moment().startOf('day').valueOf();
let endDate = moment().valueOf();
let selectedCar = -1;
let selectedTravel = -1;
let carState = "All";

$(document).ready(function () {

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
        $("[name=btnTravel] .font-weight-bold").removeClass("font-weight-bold");
        $(this).find('td').first().addClass(`font-weight-bold`);
        client.selectTravel(id, startDate, endDate, carState);
    });
    $(document).on("change", "#CarState", function (e) {
        e.preventDefault();
        carState = $("#CarState option:selected").val();
        client.selectTravel(selectedTravel, startDate, endDate, carState);
    });
    $(document).on("click","[name=btnRefreshData]",function(e){
        client.selectCar(selectedCar, startDate, endDate, carState);
    });
    $(document).on("click","#startAddTime",function(e){
        let increment = $("#timeIncrement").val();
        let nDateTime = moment.unix(startDate/1000).add(increment,'minutes');
        startDate = nDateTime.valueOf();
        $("#reservationtime").data('daterangepicker').setStartDate(nDateTime);
        client.setupTravels(selectedCar);
        client.selectTravel(selectedTravel, startDate, endDate, carState);
    });
    $(document).on("click","#startDelTime",function(e){
        let increment = $("#timeIncrement").val();
        let nDateTime = moment.unix(startDate/1000).subtract(increment,'minutes');
        startDate = nDateTime.valueOf();
        $("#reservationtime").data('daterangepicker').setStartDate(nDateTime);
        client.setupTravels(selectedCar);
        client.selectTravel(selectedTravel, startDate, endDate, carState);
    });
    $(document).on("click","#endAddTime",function(e){
        let increment = $("#timeIncrement").val();
        let nDateTime = moment.unix(endDate/1000).add(increment,'minutes');
        endDate = nDateTime.valueOf();
        $("#reservationtime").data('daterangepicker').setEndDate(nDateTime);
        client.setupTravels(selectedCar);
        client.selectTravel(selectedTravel, startDate, endDate, carState);
    });
    $(document).on("click","#endDelTime",function(e){
        let increment = $("#timeIncrement").val();
        let nDateTime = moment.unix(endDate/1000).subtract(increment,'minutes');
        endDate = nDateTime.valueOf();
        $("#reservationtime").data('daterangepicker').setEndDate(nDateTime);
        client.setupTravels(selectedCar);
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
            startDate: moment().startOf('day'),
            endDate: moment().endOf("day"),
            locale: {
                format: 'DD/MM/YYYY hh:mm:ss A'
            },
        },
        function (start, end) {
            startDate = start.valueOf();
            endDate = end.valueOf();
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

        html = "";
        html += `<table class="table table-striped table-valign-middle">`;
        html += `<thead>`;
        html += `<tr>`;
        html += `<th><i class="fa fa-route"></i> Viagem</th>`;
        html += `<th class="text-center">Exibir</th>`;
        html += `</tr>`;
        html += `</thead>`;
        html += `<tbody>`;
        html += `<tr data-id="All" name="btnTravel">`;
        html += `<td><i class="fa fa-route"></i> Todos</td>`;
        html += `<td class="text-center"><a href="#" class="text-muted"><i class="fas fa-search"></i></a></td>`;
        html += `</tr>`;
        html += `</tbody>`;
        html += `</table>`;
        $("#travelsContainer").html(html);

        $("#carsCard .overlay").addClass("d-none");
        $("#travelsCard .overlay").addClass("d-none");

        this.setupChart();
    },
    setupChart: function () {
        if (carChart != null) lineChart.clearChart(carChart);
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
        
        let html = "";
        html += `<table class="table table-striped table-valign-middle table-head-fixed">`;
        html += `<thead>`;
        html += `<tr>`;
        html += `<th><i class="fa fa-route"></i> Viagem</th>`;
        html += `<th class="text-center">Exibir</th>`;
        html += `</tr>`;
        html += `</thead>`;
        html += `<tbody>`;
        html += `<tr data-id="All" name="btnTravel">`;
        html += `<td><i class="fa fa-route"></i> Todos [${travels.reduce((t,i) => t + i.records,0)}]</td>`;
        html += `<td class="text-center"><a href="#" class="text-muted"><i class="fas fa-search"></i></a></td>`;
        html += `</tr>`;
        let selected = false
        $(travels).each(function (i, item) {
            if(item.id == selectedTravel) selected = true;
            let ts = new Date(item.timestamp*1000);
            let title = `${ts.toLocaleDateString()} ${ts.toLocaleTimeString()}`;
            html += `<tr data-id="${item.id}" name="btnTravel">`;
            html += `<td class="${item.id == selectedTravel?"font-weight-bold":""}"> ${title} [${item.records}]</td>`;
            html += `<td class="text-center"><a href="#" class="text-muted"><i class="fas fa-search"></i></a></td>`;
            html += `</tr>`;
        });
        if(selectedTravel != "All" && !selected) selectedTravel = -1;
        html += `</tbody>`;
        html += `</table>`;
        $("#travelsContainer").html(html);
        $("#countTravels").html(`Registros: ${travels.length}`);
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
        $("#chartCard .overlay").removeClass("d-none");
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

        dataRPM = dataRPM.map(x => [(x.receive_date-10800)*1000, x.value]);
        dataKmh = dataKmh.map(x => [(x.receive_date-10800)*1000, x.value]);

        carChart.series[0].setData(dataKmh);
        carChart.series[1].setData(dataRPM);

        let maxRPM = 0;
        if (dataRPM.length > 0) maxRPM = Math.max.apply(Math, dataRPM.map(function (o) { return o[1]; }))
        let maxKMH = 0;
        if (dataKmh.length > 0) maxKMH = Math.max.apply(Math, dataKmh.map(function (o) { return o[1]; }))

        $("#TopKmh").html(`${maxKMH} Km/h`)
        $("#TopRpm").html(`${maxRPM} RPM`);
        $("#countRecords").html(`Registros: ${dataRPM.length}`);
        $("#chartCard .overlay").addClass("d-none");
    }
};
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
                    style: { color: Highcharts.getOptions().colors[1] },
                    enabled: false
                }
            }, {
                title: {
                    text: 'Velocity',
                    style: { color: Highcharts.getOptions().colors[0] },
                    enabled: false
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