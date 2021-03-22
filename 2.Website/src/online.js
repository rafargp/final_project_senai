let rpmChart = null;
let kmhChart = null;
let mqtt;

$(document).ready(function () {

    client.setup();

});
let client = {
    setup: function () {

        this.setupChart();
        MQTT.connect("rafaelgomes.ddns.net", 9001, "", "", "web_client",client.onMessageArrivedMQTT);
        var trySubscribe = setInterval(function () {
            if (mqttClient.isConnected()) {
                console.log(`MQTT -> Subscrever ao tópico "/stations/beacons/get"`)
                MQTT.subscribe("/sensors", 0);
                clearInterval(trySubscribe);
            }
        }, 500);
    },
    onMessageArrivedMQTT: function (message) {
        let data = JSON.parse(message._getPayloadString());
        let dataRPM = data.sensors.find(x => x.pid == "0C").value;
        let dataKmh = data.sensors.find(x => x.pid == "0D").value;

        gaugeChart.setPoint(rpmChart, dataRPM);
        gaugeChart.setPoint(kmhChart, dataKmh);
    },
    setupChart: function () {
        if (rpmChart != null) gaugeChart.clearChart(rpmChart);
        if (kmhChart != null) gaugeChart.clearChart(kmhChart);

        rpmChart = gaugeChart.setup("rpmChartContainer", 0, 9000, "Motor", "RPM", "RPM", "#F00");
        kmhChart = gaugeChart.setup("kmhChartContainer", 0, 220, "Velocidade", "velocidade", "Km/h", "#00F");
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