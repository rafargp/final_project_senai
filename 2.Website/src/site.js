const menu = [
    { id: "mnhHome", title: "Home", url: "index.html", type: "H" },
    { id: "mnhCar", title: "Carros", url: "cars.html", type: "H" },
    { id: "mnhLogs", title: "Logs", url: "logs.html", type: "H" },
    { id: "mnvHome", title: "Home", url: "index.html", css: "fa-home" ,type: "V" },
    { id: "mnvCar", title: "Carros", url: "cars.html", css: "fa-car", type: "V" },
    { id: "mnvLogs", title: "Logs", url: "logs.html", css:"fa-scroll", type: "V" },
];


$(document).ready(function(){
    LTE.init();
});

const LTE = {
    init: function(){
        $(menu).each(function(i,item){
            if(item.type == "H") LTE.newHorizontalMenuItem(item.id,item.title,item.url);
            if(item.type == "V") LTE.newVerticalMenuItem(item.id,item.title,item.url,item.css);
        });
    },
    newVerticalMenuItem: function (id, name, url, icon) {
        if ($(`#${id}`).length > 0) return false;

        var container = $("#MenuVContainer");
        container.append(`<li class="nav-item"><a href="${url}" class="nav-link" id="${id}"><i class="nav-icon fas ${icon}"></i><p>${name}</p></a></li>`);
        return true;
    },
    newHorizontalMenuItem: function (id, name, url) {
        if ($(`#${id}`).length > 0) return false;
        
        var container = $("#MenuHContainer");
        container.append(`<li class="nav-item d-none d-sm-inline-block" id="${id}"><a href="${url}" class="nav-link">${name}</a></li>`);
        return true;
    },
    newVerticalMenuTreeItem: function (id, name, icon, subIds, subNames, subUrls, subIcons) {
        if ($(`#${id}`).length > 0) return false;
        
        var print = "";
        var container = $("#MenuVContainer");
        print += `<li class="nav-item has-treeview" id="${id}">`;
        print += `<a href="#" class="nav-link">`;
        print += `<i class="nav-icon fas ${icon}"></i>`;
        print += `<p>`;
        print += `${name}`;
        print += `<i class="right fas fa-angle-left"></i>`;
        print += `</p>`;
        print += `</a>`;
        print += `<ul class="nav nav-treeview">`;

        $(subIds).each(function (i, item) {
            print += `<li class="nav-item" id="${item}">`;
            print += `<a href="${subUrls[i]}" class="nav-link">`;
            print += `<i class="fas ${subIcons[i]} nav-icon"></i>`;
            print += `<p>${subNames[i]}</p>`;
            print += `</a>`;
            print += `</li>`;
        });
        print += `</ul>`;
        print += `</li>`;
        container.append(print);
    }
};