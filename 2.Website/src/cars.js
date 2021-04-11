$(document).ready(function () {

    $(document).on("click", "[name=btnDevice]", function (e) {
        e.preventDefault();
        let id = $(this).data("id");
        client.selectMicrochip(id);
    });
    $(document).on("click", "[name=btnCar]", function (e) {
        e.preventDefault();
        let id = $(this).data("id");
        client.selectCar(id);
    });
    $(document).on("click","#btnSaveCar",function(e){
        let id = $(this).data("id");
        let name = $("#txtDeviceName").val();
        let profile = $("#slProfile option:selected").val();
        client.editCar(id,name,profile);
    });

    client.setup();
    
});
let client = {
    setup: function () {
        $("#devicesCard .overlay").removeClass("d-none");

        let devices = Devices.getAll();
        let html = "";
        $(devices).each(function (i, item) {
            html += `<a class="btn btn-app" name="btnDevice" data-id="${item._id}"><i class="fas fa-microchip"></i>${item.imei}</a>`;
        });
        $("#devicesContainer").html(html);

        let option = new Option("Nenhum",-1,false, true);
        $("#slProfile").append(option);
        let profiles = Profile.getAll();
        $(profiles).each(function(i,item){
            let option = new Option(item.title,item._id,false, false);
            $("#slProfile").append(option);
        });
        
        $("#devicesCard .overlay").addClass("d-none");
    },
    selectMicrochip: function(id){
        $("#carsCard").removeClass("d-none");
        $("#carsCard .overlay").removeClass("d-none");

        let cars = Cars.getByDeviceId(id);

        let html = "";
        $(cars).each(function (i, item) {
            html += `<a class="btn btn-app" name="btnCar" data-id="${item.carVIN}"><i class="fas fa-car"></i>${item.Name == undefined ? item.carVIN : item.Name}</a>`;
        });
        $("#carsContainer").html(html);
        $("#carsCard .overlay").addClass("d-none");
    },
    selectCar(id){
        $("#carForm").removeClass("d-none");
        let device = Cars.getById(id);
        if(device.length == 0) return;
        let car = device[0].cars.filter(x => x.carVIN == id);
        if(car.length == 0) return;
        else car = car[0];
        if(car.name != undefined) $("#txtDeviceName").val(car.name);   
        if(car.profile != undefined) $(`#slProfile option[value='${car.profile}']`).prop('selected', true);
        $("#txtCarVin").val(car.carVIN);
        $("#txtCarVin").prop("disabled",true);
        $("#btnSaveCar").data("id",id);
    },
    editCar(id,name,profile){
        let device = Cars.getById(id);
        if(device.length == 0) return;
        let carIndex = device[0].cars.findIndex(x => x.carVIN==id);
        if(carIndex == -1) return;        
        device[0].cars[carIndex].name = name;
        if(profile != -1) device[0].cars[carIndex].profile = profile;
        else delete device[0].cars[carIndex].profile;

        Cars.update(id,device[0]);
        Toast.fire({
            icon: 'success',
            title: 'Carro Atualizado!'
        })
    }
};