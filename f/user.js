function password_hash_first(s){
    s="9ASts_aps!"+s+"aqWQ_sqa"+s+s+"spqxS_Jsd1s"+s+"s9qQs_a";
    var a=new Array();
    var charset="1234567890abcdef";
    for(var i=0;i<64;i++)
        a[i]=s.charCodeAt(i%s.length)%16;
    var p=0;
    for(var i=0;i<s.length;i++){
        var tmp=s.charCodeAt(i)+92;
        tmp=tmp*tmp*tmp;
        while(tmp>0){
            a[p]+=tmp%10;
            p++;
            if(p==64)p=0;
            tmp=(tmp-tmp%10)/10;
        }
    }
    var str="";
    for(var i=0;i<64;i++)
        str=str+charset[a[i]%16];
    console.log(str);
    return str;
}
function getCookie(name){
    var cookieArr=document.cookie.split(";");
    for(var i=0;i<cookieArr.length;i++){
        var cookiePair=cookieArr[i].split("=");
        if(name==cookiePair[0].trim())
            return decodeURIComponent(cookiePair[1]);
    }
    return null;
}
function setCookie(name,value,daysToLive){
    var cookie=name+"="+encodeURIComponent(value)+"; path=/";
    if(typeof daysToLive==="number"&&daysToLive!=0){
        cookie+="; max-age="+(daysToLive*24*60*60);
    }
    document.cookie=cookie;
}
$(document).ready(function(){
    if(getCookie("logined")=="true"){
        document.getElementById('user-tip').innerHTML=`Hello, <a href="/user/`+getCookie("loginid")+`">`
            +getCookie("loginname")+`</a> (#`+getCookie("loginid")
            +`)! <button id="user-logout">Log out</button><button id="user-settings">Settings</button>`;
        document.getElementById("user-logout").onclick=
            function(){
                setCookie("logined","",0);
                setCookie("loginname","",0);
                setCookie("loginchecker","",0);
                setCookie("loginid","",0);
                location.pathname="";
            };
        document.getElementById("user-settings").onclick=
            function(){
                location.pathname="/user/settings";
            };
    }
});