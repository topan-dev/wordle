var TopanSystem={
    loadfile: function(url,func){
        $.ajax({
            url: url,
            success: func
        });
    }
}

function topan_init_all(){
    topan_init_tabs();
}
$(document).ready(function(){
    topan_init_all();
});

function topan_init_tabs(){
    $(".topan-tab li").click(function(){
        if(!$(this).hasClass(".topan-tab-showed")){
            $(this.parentElement).children(".topan-tab-showed").removeClass("topan-tab-showed");
            $(this).addClass("topan-tab-showed");
            $(this.parentElement.parentElement).children(".topan-tab-showed").removeClass("topan-tab-showed");
            $(this.parentElement.parentElement.children.item($(this).index()+1)).addClass("topan-tab-showed");
        }
    });
}
