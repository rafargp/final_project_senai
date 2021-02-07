let rpmChart = null;
let kmhChart = null;
let carChart = null;

$(document).ready(function(){

   $(document).on('click',"#btnDashMotor",function(e){
       e.preventDefault();
       $("#motorDashboard").removeClass("d-none");
       $("#locationDashboard").addClass("d-none");
   });

   $(document).on('click',"#btnDashLocation",function(e){
        e.preventDefault();
        $("#motorDashboard").addClass("d-none");
        $("#locationDashboard").removeClass("d-none");
    });
    
    $(document).on("click","[name=btnCar]",function(e){
        e.preventDefault();
        let id = $(this).data("id");
        client.selectCar(id);
    });

    client.setup();

});
let client = {
    setup: function(){
        $("#carsCard .overlay").removeClass("d-none");
        
        let cars = server.getCars();

        $(cars).each(function(i,item){
            let html = $("#carsContainer").html();
            html += `<a class="btn btn-app" name="btnCar" data-id="${item.Id}"><i class="fas fa-car"></i>${item.Name}</a>`;
            $("#carsContainer").html(html);
        });

        $("#carsCard .overlay").addClass("d-none");

        this.setupChart();   
        this.setupMQTT();
    },
    setupMQTT: function(){
        var mqtt;
        var host="rafaelgomes.ddns.net";
        var port=9001;
        mqtt = new Paho.MQTT.Client(host,port,"clientjs");
        
        var options = { 
            timeout: 3, 
            onSuccess: client.onConnectMQTT,
            onFailure: client.onFailureMQTT,
        };

        mqtt.onMessageArrived = client.onMessageArrivedMQTT;
            
        mqtt.connect(options); //connect
	
    },
    onFailureMQTT: function(message) {
        console.log(message);  
    },
    onConnectMQTT: function(){
        console.log("Connected ");
        mqtt.subscribe("/sensor1");
        message = new Paho.MQTT.Message("Hello World");
        message.destinationName = "/sensor1";
        mqtt.send(message);
    },
    onMessageArrivedMQTT: function(message){
        out_msg="Message received "+msg.payloadString+"<br>";
        out_msg=out_msg+"Message received Topic "+msg.destinationName;
        console.log(out_msg);
    },
    setupChart: function(){
        if(rpmChart != null) gaugeChart.clearChart(rpmChart);
        if(kmhChart != null) gaugeChart.clearChart(kmhChart);
        if(carChart != null) lineChart.clearChart(carChart);
        rpmChart = gaugeChart.setup("rpmChartContainer",0,9000,"Motor","RPM","RPM","#F00");
        kmhChart = gaugeChart.setup("kmhChartContainer",0,200,"Velocidade","velocidade","Km/h","#00F");
        carChart = lineChart.setup("carChartContainer","Resumo");    
    },
    selectCar: function(id){
        this.setupChart();

        let sensorsData = server.getSensors(id);
        $(sensorsData).each(function(i,item){
            gaugeChart.setPoint(rpmChart,item.rpm);
            gaugeChart.setPoint(kmhChart,item.kmh);
            lineChart.setPoint(carChart,item.rpm,item.kmh);
        });
    }
};
let server = {
    getCars: function(){
        return [
            {Id: 1, VIN: '12ZXVSQ235GJD12', Name: 'Polo'},
            {Id: 2, VIN: '98667LOHADPOID1', Name: 'T-Cross'},
        ];
    },
    getSensors: function(carId){
        let data = [
            {carId:1, rpm: 900, kmh: 0 },
            {carId:1, rpm: 1000, kmh: 10 },
            {carId:1, rpm: 1200, kmh: 20 },
            {carId:1, rpm: 1300, kmh: 30 },
            {carId:1, rpm: 2000, kmh: 40 },
            {carId:1, rpm: 2500, kmh: 50 },
            {carId:2, rpm: 950, kmh: 0 },
            {carId:2, rpm: 3000, kmh: 70 },
        ];
        
        return data.filter(x => x.carId == carId);
    }
};
let gaugeChart = {
    setup: function(id,min,max,title,name,unit,color){
        var json = {};   
        json.chart = {      
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false	 
         };
         json.credits = { enabled: false };
         json.title = { text: title,enabled: false };;       
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
                  stops: [ [0, '#DDD'], [1, '#FFF'] ]
               }
            },
            tooltip: { valueSuffix: ` ${unit}` }
         }];     
         
        return $(`#${id}`).highcharts(json); 
    },
    setPoint: function(chart,point){
        $(chart).highcharts().series[0].points[0].update(point);
    },
    clearChart: function(chart){
        this.setPoint(chart,0);
    }
}
let lineChart = {
    setup: function(id,text){
        return Highcharts.chart(`${id}`, {
            chart: { zoomType: 'xy' },
            title: { text: text },
            xAxis: [{  categories: [], crosshair: true }],
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
                name: 'Velocidade',
                type: 'column',
                yAxis: 1,
                tooltip: { valueSuffix: ' Km/h' }
        
            }, {
                name: 'Motor',
                type: 'spline',
                tooltip: { valueSuffix: ' RPM' }
            }]
        });
    },
    setPoint(chart,rpm,kmh){
        chart.series[0].addPoint(kmh);
        chart.series[1].addPoint(rpm);
    },
    clearChart: function(chart){
        while(chart.series.length > 0) chart.series[0].remove(true)
    }
}
 