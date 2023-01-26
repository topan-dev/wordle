$(document).ready(()=>{
    $("#user-login").click(()=>{
        $.post("/login/try",
            {
                name: $('#login-name')[0].value,
                password: $('#login-password')[0].value
            },
            (data,status)=>{
                if(data.error!=undefined)alert(data.error);
                else{
                    location.pathname="";
                }
            }
        );
    });
    $("#user-register").click(()=>{
        location.pathname="/register";
    });
});