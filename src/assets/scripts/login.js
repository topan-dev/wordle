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
                    setCookie("logined","true",1);
                    setCookie("loginname",data.name,1);
                    setCookie("loginchecker",data.checker,1);
                    setCookie("loginid",data.id,1);
                    location.pathname="";
                }
            }
        );
    });
    $("#user-register").click(()=>{
        location.pathname="/register";
    });
});