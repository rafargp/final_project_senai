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
const Travels = {
	getAll: function(){
        var result = $.ajax({
			url: `${endpoint}/travels`,
			type: "GET",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
	},
	getById: function(id){
        var result = $.ajax({
			url: `${endpoint}/travel/${id}`,
			type: "GET",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
	},
	getSensors: function(id,pid,startDate=null,endDate=null,state=null){
        var result = $.ajax({
			url: `${endpoint}/travel/${id}/sensors`,
			data: { pid:pid, startDate: startDate, endDate: endDate, state: state },
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
		let cars = [];
		$(result.responseJSON[0].cars).each(function(x,car){
			let result = cars.find(x => x.carVIN == car.carVIN);
			if(result == undefined) cars.push(car);
		})
		return cars;
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
    getTravels: function(id){
        var result = $.ajax({
			url: `${endpoint}/car/${id}/travels`,
			type: "GET",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
    },
	update: function(id,data){
		var result = $.ajax({
			url: `${endpoint}/car/${id}`,
			data: data,
			type: "POST",
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
	},
	getSensors: function(id,pid,startDate=null,endDate=null,state=null){
		let travels = this.getTravels(id);
		let full = [];
        $(travels).each(function(i,travel){
			let result = Travels.getSensors(travel.id,pid,startDate,endDate,state);
			full = full.concat(result);
		});
		return full;
	}
};
let Logs = {
	getAll: function(filter=null){
        var result = $.ajax({
			url: `${endpoint}/logs`,
			type: "GET",
			data: filter,
			async: false,
			headers: { "ACCEPT": "application/json;odata=verbose" },
		});
		return result.responseJSON;
    }
}