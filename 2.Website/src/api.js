const endpoint = "http://rafaelgomes.ddns.net:1880/api";
const Devices = {
    getAll: function(){
        var result = $.ajax({
			url: `${endpoint}/devices`,
			type: "GET",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
    },
    getById: function(id){
        var result = $.ajax({
			url: `${endpoint}/device/${id}`,
			type: "GET",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
    },
    getStatus: function(id){
        var result = $.ajax({
			url: `${endpoint}/device/${id}/status`,
			type: "GET",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
    }
};
const Cars = {
    getAll: function(){
        let devices = Devices.getAll();
        let cars = [];
        $(devices).each(function(i,device){
            $(device.cars).each(function(x,car){
                let result = cars.find(x => x.carVIN == car.carVIN);
                if(result == undefined) cars.push(car);
            })
        });
		return cars;
    },
    getByDeviceId: function(deviceId){
        var result = $.ajax({
			url: `${endpoint}/cars/${deviceId}`,
			type: "GET",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
    },
    getById: function(id){
        var result = $.ajax({
			url: `${endpoint}/car/${id}`,
			type: "GET",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
    },
    getSensors: function(id){
        var result = $.ajax({
			url: `${endpoint}/car/${id}/sensors`,
			type: "GET",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
    },
    getSensorByPID: function(id,pid){
        var result = $.ajax({
			url: `${endpoint}/car/${id}/sensor/${pid}`,
			type: "GET",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
    }
};