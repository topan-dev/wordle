var pkgversion=require('./../../package.json').version;

module.exports=(config,HTML)=>{
    var _=config._;
    return`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">${config.title} - Wordle</title>
        <link rel="shortcut icon" type="image/x-icon" href="/file/favicon.ico">
        <script src="/file/TopanUI/src/jquery.js"></script>
        <link rel="stylesheet" href="/file/TopanUI/topan.css">
        <script src="/file/TopanUI/topan.js"></script>
        <link rel="stylesheet" href="/file/style.css">
        <script>
            function getCookie(name){
                var cookieArr=document.cookie.split(";");
                for(var i=0;i<cookieArr.length;i++){
                    var cookiePair=cookieArr[i].split("=");
                    if(name==cookiePair[0].trim())
                        return decodeURIComponent(cookiePair[1]);
                }
                return null;
            }
            function setCookie(name,value,live){
                var cookie=name+"="+encodeURIComponent(value)+"; path=/";
                if(typeof daysToLive==="number"&&daysToLive!=0){
                    cookie+="; max-age="+live;
                }
                document.cookie=cookie;
            };
            $(document).ready(()=>{
                $("#system-logout").click(()=>{
                    setCookie("wordle-uid","",0);
                    setCookie("wordle-cookie","",0);
                    location.pathname="";
                })
            });
        </script>
        ${config.header}
    </head>
    <body>
        <div class="topan-header">
            <div class="topan-header-home">
                <a href="/">
                    <button class="topan-button-ordinary topan-button-commonly topan-button-header-round-left">
                        <i class="fa fa-home"></i>
                    </button>
                </a>
            </div>
            <div class="topan-header-left">
                <span class="topan-header-text">Wordle&nbsp;</span>
                <a href="/contests">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.oncontests?"-showed":""}">
                        <i class="fa fa-solid fa-fire"></i>
                        <span>&nbsp;${_('contests')}</span>
                    </span>
                </a>
                <a href="/pk">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onpk?"-showed":""}">
                        <i class="fa fa-solid fa-paper-plane"></i>
                        <span>&nbsp;${_('pk_onheader')}</span>
                    </span>
                </a>
                <a href="/ranking">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onranking?"-showed":""}">
                        <i class="fa fa-solid fa-ranking-star"></i>
                        <span>&nbsp;${_('ranking')}</span>
                    </span>
                </a>
                <a href="/app">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onapps?"-showed":""}">
                        <i class="fa fa-solid fa-bars"></i>
                        <span>&nbsp;${_('application')}</span>
                    </span>
                </a>
            </div>
            <div class="topan-header-right">
                <a href="${config.user==null?"/login":"/i"}">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onlogin?"-showed":""}">
                        <i class="fa fa-solid fa-user"></i>
                        <span>&nbsp;${config.user==null?_('login'):config.user}</span>
                    </span>
                </a>
                ${config.user!=null?`
                    <span id="system-logout" class="topan-button-ordinary topan-button-commonly topan-button-header-block">
                        <i class="fa fa-solid fa-right-from-bracket"></i>
                    </span>
                    <a href="/i/settings">
                        <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onsettings?"-showed":""}">
                            <i class="fa fa-solid fa-gear"></i>
                        </span>
                    </a>
                `:""}
            </div>
        </div>
        <div class="topan-outer">
            <div class="topan-page">
                <div class="topan-mainpage-auto">
                    <br>
                    ${HTML}
                    <br>
                </div>
                <footer class="topan-footer">
                    <p></p>
                    <p style="text-align: center; color: #555; font-size: 12px;">
                        <i class="fa fa-solid fa-earth-americas"></i>
                        <a href="javascript:setCookie('wordle-lang','zh',0)">中文</a> |
                        <a href="javascript:setCookie('wordle-lang','en',0)">English</a> |
                        <a href="javascript:setCookie('wordle-lang','ko',0)">日本語</a>&nbsp;&nbsp;&nbsp;
                        Worker in ${parseInt(new Date().getTime()-config.startTime)} ms&nbsp;&nbsp;&nbsp;
                        Powered by <a href="https://github.com/topan-dev/wordle">Wordle</a> v${pkgversion}&nbsp;&nbsp;&nbsp;
                        © 2023 <a href="https://github.com/topan-dev/">Topan Development Group</a>
                    </p>
                </footer>
            </div>
        </div>
    </body>
</html>
    `;
};