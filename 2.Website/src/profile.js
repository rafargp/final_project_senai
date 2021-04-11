$(document).ready(function () {
    $(document).on("click","#btnRefresh",function(e){
        client.setup();
    });
    $(document).on("click","#btnNewProfile",function(e){
        $("#title").val("");
        $("#maxPower").val("");
        $("#maxTorqueStart").val("");
        $("#maxTorqueEnd").val("");
        $("#formProfileCard").data("operation",1);
        $("#formProfileCard").show();
    });
    $(document).on("click","#btnSaveProfile",function(e){
        let id = $(this).data("id");
        let operation = $(this).data("operation");
        let title = $("#title").val();
        let maxPower = $("#maxPower").val();
        let maxTorqueStart = $("#maxTorqueStart").val();
        let maxTorqueEnd = $("#maxTorqueEnd").val();
        if(operation == 1) client.newProfile(title,maxPower,maxTorqueStart,maxTorqueEnd);
        else client.editProfile(id, title,maxPower,maxTorqueStart,maxTorqueEnd);
    });
    $(document).on("click","[name='btnProfile']",function(e){
        let id = $(this).data("id");
        let profile = Profile.getById(id);
        if(profile == undefined){
            Toast.fire({
                icon: 'error',
                title: `Pefil não encontrado`
            });
            return;
        }

        $("#title").val(profile[0].title);
        $("#maxPower").val(profile[0].maxPower);
        $("#maxTorqueStart").val(profile[0].maxTorque.start);
        $("#maxTorqueEnd").val(profile[0].maxTorque.end);
        
        $("#btnSaveProfile").data("id",id);
        $("#formProfileCard").data("operation",2);
        $("#formProfileCard").show();
    });
    client.setup();
});
const client = {
    setup: function(){
        $("#profileCard .overlay").removeClass("d-none");

        let profiles = Profile.getAll();
        let html = "";
        $(profiles).each(function (i, item) {
            html += `<a class="btn btn-app" name="btnProfile" data-id="${item._id}"><i class="fas fa-user"></i>${item.title}</a>`;
        });
        $("#profilesContainer").html(html);

        $("#profileCard .overlay").addClass("d-none");
    },
    newProfile: function(title,maxPower,maxTorqueStart,maxTorqueEnd){
        let data = {
            title: title,
            maxPower: maxPower,
            maxTorque: {
                start: maxTorqueStart,
                end: maxTorqueEnd
            }
        };

        Profile.newProfile(data);

        Toast.fire({
            icon: 'success',
            title: `Novo Pefil Adicionado`
        });

        client.setup();
    },
    editProfile: function(id,title,maxPower,maxTorqueStart,maxTorqueEnd){
        let data = Profile.getById(id)[0];
        data.title = title;
        data.maxPower = maxPower;
        data.maxTorque = {
            start: maxTorqueStart,
            end: maxTorqueEnd
        };

        Profile.editProfile(id, data);

        Toast.fire({
            icon: 'success',
            title: `Alterado Pefil ${title}`
        });

        client.setup();
    }
};