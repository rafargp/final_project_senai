$(document).ready(function () {

    client.init();

    $(document).on("click","#btnRefresh",function(e){
        let selected = $("#slLogResources option:selected").val();
        if(selected == "All") client.getAllLogs();
        else client.getAllLogs({ resource: selected});
    });
    $(document).on("change","#slLogResources",function(e){
        e.preventDefault();
        let selected = $("#slLogResources option:selected").val();
        if(selected == "All") client.getAllLogs();
        else client.getAllLogs({ resource: selected});
    });
});
let client = {
    init: function(){
        $("#slLogResources").append(new Option("Todos","All"));
        let r = resources.map(x => x.id);
        $(r).each(function(i,resource){
            $("#slLogResources").append(new Option(resource,resource));
        });
        client.getAllLogs();
    },
    getAllLogs: function (filter=null) {

        $("#logCard .overlay").removeClass("d-none");
        let logs = Logs.getAll(filter);

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