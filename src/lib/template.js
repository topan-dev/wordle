var pkgversion=require('./../../package.json').version;

module.exports=(config,HTML)=>{
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
            function setCookie(name,value,daysToLive){
                var cookie=name+"="+encodeURIComponent(value)+"; path=/";
                if(typeof daysToLive==="number"&&daysToLive!=0){
                    cookie+="; max-age="+(daysToLive*24*60*60);
                }
                document.cookie=cookie;
            };
            $(document).ready(()=>{
                $("#system-logout").click(()=>{
                    setCookie("logined","",0);
                    setCookie("loginname","",0);
                    setCookie("loginchecker","",0);
                    setCookie("loginid","",0);
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
                        <span>&nbsp;Contests</span>
                    </span>
                </a>
                <a href="/pk">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onpk?"-showed":""}">
                        <i class="fa fa-solid fa-paper-plane"></i>
                        <span>&nbsp;1v1 PK</span>
                    </span>
                </a>
                <a href="/ranking">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onranking?"-showed":""}">
                        <i class="fa fa-solid fa-ranking-star"></i>
                        <span>&nbsp;Ranking</span>
                    </span>
                </a>
                <a href="/app">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onapps?"-showed":""}">
                        <i class="fa fa-solid fa-bars"></i>
                        <span>&nbsp;Application</span>
                    </span>
                </a>
            </div>
            <div class="topan-header-right">
                <a href="${config.user==null?"/login":"/i"}">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onlogin=="user"?"-showed":""}">
                        <i class="fa fa-solid fa-user"></i>
                        <span>&nbsp;${config.user==null?"Login":config.user}</span>
                    </span>
                </a>
                ${config.user!=null?`
                    <span id="system-logout" class="topan-button-ordinary topan-button-commonly topan-button-header-block">
                        <i class="fa fa-solid fa-right-from-bracket"></i>
                    </span>
                    <a href="/i/settings">
                        <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onsettings=="settings"?"-showed":""}">
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
                        Powered by <a href="//github.com/topan-dev/wordlesystem">Wordle System</a> v${pkgversion} &nbsp;&nbsp;&nbsp;© 2023 <a href="https://github.com/topan-dev/">Topan Development Group</a>
                    </p>
                </footer>
            </div>
        </div>
    </body>
</html>
    `;
};