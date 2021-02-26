$(document).ready(function () {

    client.getAllLogs();
    $(document).on("click","#btnRefresh",function(e){
        client.getAllLogs();
    });
});
let client = {
    getAllLogs: function () {

        $("#logCard .overlay").removeClass("d-none");
        let logs = Logs.getAll();

        let html = `<div class="direct-chat-messages">`;
        $(logs).each(function (i, item) {
            html += `<div class="direct-chat-msg">`;
            html += `   <div class="direct-chat-infos clearfix">`;
            html += `       <span class="direct-chat-name float-left">${item.resource}</span>`;
            html += `       <span class="direct-chat-timestamp float-right">${moment(item.timestamp).format('DD/MM/YYYY h:mm:ss a')}</span>`;
            html += `   </div>`;
            html += `   <img class="direct-chat-img" src="${LTE.getResourceImage(item.resource)}">`;
            html += `   <div class="direct-chat-text">`;
            html += `       Evento: ${item.event} | Key: ${item.key}`;
            html += `   </div>`;
            html += `</div>`;
        });
        html += `</div>`;
        $("#logsContainer").html(html);
        $("#logCard .overlay").addClass("d-none");
    }
};