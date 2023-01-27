$(document).ready(()=>{
    $("#user-login").click(()=>{
        $.post("/login/try",
            {
                name: $('#login-name').val(),
                password: $('#login-password').val()
            },
            (data,status)=>{
                if(data.error!=undefined)$('#login-error').text(data.error);
                else location.pathname="";
            }
        );
    });
    $("#user-register").click(()=>{
        location.pathname="/register";
    });
});