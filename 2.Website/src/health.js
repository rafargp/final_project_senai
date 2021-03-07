$(document).ready(function () {

    $(document).on("click", "[name=btnDevice]", function (e) {
        e.preventDefault();
        let id = $(this).data("id");
        client.selectMicrochip(id);
    });
    $(document).on("click", "[name=btnLocation]", function (e) {
        e.preventDefault();
        $("#mapCard .overlay").removeClass("d-none");

        let location = $(this).data("location");
        let html = `<iframe width='100%' height='100%' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='https://maps.google.com/maps?&amp;q=${encodeURIComponent( location )}&amp;output=embed'></iframe>`
        $("#mapsContainer").html(html);
        $("#mapCard .overlay").addClass("d-none");
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

        $("#devicesCard .overlay").addClass("d-none");
    },
    selectMicrochip: function(id){
        $("#logCard .overlay").removeClass("d-none");
        
        let result = Devices.getStatus(id);

        let html = `<div class="direct-chat-messages" style="height: 100%;">`;
        $(result).each(function (i, item) {
            html += `<div class="direct-chat-msg">`;
            html += `   <div class="direct-chat-infos clearfix">`;
            html += `       <span class="direct-chat-name float-left">${item.device_id}</span>`;
            html += `       <span class="direct-chat-timestamp float-right">${moment(`${item.gsm_date} ${item.gsm_time}`).format('DD/MM/YYYY h:mm:ss a')}</span>`;
            html += `   </div>`;
            html += `   <img class="direct-chat-img" src="${LTE.getResourceImage("Device")}">`;
            html += `   <div class="direct-chat-text">`;
            html += `       IP: ${item.ip} | Sinal: ${item.signal} | Local: <a href="#" data-location="${item.location_lo},${item.location_la}" name="btnLocation">Visualizar</a> | Accuracy: ${item.location_accuracy}`;
            html += `   </div>`;
            html += `</div>`;
        });
        html += `</div>`;
        $("#logsContainer").html(html);
        $("#logCard .overlay").addClass("d-none");

    }
};