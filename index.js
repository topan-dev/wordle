const express=require('express');
const app=express();
const cors=require('cors');
app.use(cors());
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
const fs=require('fs');

var easywords;
fs.readFile("datas/easywords.json",'utf8',(err,data)=>{
    easywords=JSON.parse(data).easywords;
});
var userdata;
fs.readFile("datas/users.json",'utf8',(err,data)=>{
    userdata=JSON.parse(data);
});
var contests;
fs.readFile("datas/contest.json",'utf8',(err,data)=>{
    contests=JSON.parse(data).contests;
});
var rules;
fs.readFile("datas/rules.json",'utf8',(err,data)=>{
    rules=JSON.parse(data).rules;
});
var words;
fs.readFile("datas/words.json",'utf8',(err,data)=>{
    words=JSON.parse(data).words;
});
var pkdata;
fs.readFile("datas/pk.json",'utf8',(err,data)=>{
    pkdata=JSON.parse(data).datas;
});
var pkcodes;
fs.readFile("datas/pkcode.json",'utf8',(err,data)=>{
    pkcodes=JSON.parse(data).codes;
});

function getUserdataById(id){
    var i=0;
    while(userdata.users.length>i&&userdata.users[i].id!=id)i++;
    return userdata.users[i];
}
function getidofuser(uid){
    var i=0;
    while(userdata.users.length>i&&userdata.users[i].id!=uid)i++;
    return i;
}
function getRuleDescribe(rule){
    var i=0;
    while(rules.length>i&&rules[i].name!=rule)i++;
    if(rules.length==i)return null;
    else return rules[i].describe;
}
function getrecords(uid,cid,tid){
    var contestdata=contests[cid].users;
    var i=0;
    while(contestdata.length>i&&contestdata[i].id!=uid)i++;
    if(contestdata.length==i)return {records: [], solved: false};
    return contestdata[i].tasks[tid-1];
}
function checkword(s){
    var i=0;
    while(i<words.length&&words[i]!=s)i++;
    return words.length!=i;
}

function getCookie(name,cookies){
    var cookieArr=cookies.split(";");
    for(var i=0;i<cookieArr.length;i++){
        var cookiePair=cookieArr[i].split("=");
        if(name==cookiePair[0].trim())
            return decodeURIComponent(cookiePair[1]);
    }
    return null;
}
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
    return str;
}
function password_hash_second(str){
    str="9ASNs_aps!"+str+str+str+"s9Qs_a";
    var a=new Array();
    var charset="1234567890abcdef";
    for(var i=0;i<128;i++)
        a[i]=str.charCodeAt(i%str.length)%16;
    var p=0;
    for(var i=0;i<str.length;i++){
        var tmp=str.charCodeAt(i)+76;
        tmp=tmp*tmp*tmp;
        while(tmp>0){
            a[p]+=tmp%10;
            p++;
            if(p==128)p=0;
            tmp=(tmp-tmp%10)/10;
        }
    }
    var str="";
    for(var i=0;i<128;i++)
        str=str+charset[a[i]%16];
    return str;
}
function checklogin(req){
    if(!req.headers.cookie)return false;
    if(getCookie("logined",req.headers.cookie)!="true")return false;
    var i=0;
    while(userdata.users.length>i&&userdata.users[i].id!=Number(getCookie("loginid",req.headers.cookie)))i++;
    if(userdata.users.length==i)return false;
    else return password_hash_second(getCookie("loginchecker",req.headers.cookie))==userdata.users[i].checker;
}
function wordlechecker(myans,answer,type){
    if(myans==answer)return '<span style="color: green;">'+myans+'</span>';
	//给出反馈 
    var _return=new Array();
	for(var i=0;i<5;i++)
		_return.push(0);
	for(var i=97;i<123;i++){
		var tot=0,id=new Array();
		for(var j=0;j<5;j++){
			if(answer.charCodeAt(j)==i&&myans.charCodeAt(j)==i){
				_return[j]=2;
				continue;
			}
			if(answer.charCodeAt(j)==i)tot++;
			if(myans.charCodeAt(j)==i)id.push(j);
		}
		for(var j=0;j<tot&&j<id.length;j++)
			_return[id[j]]=1;//字母对 位置不对 
		for(var j=tot;j<id.length;j++)
			_return[id[j]]=-1;//字母错 
	}
    var code="";
    if(type=="Standard Rule"){
        for(var i=0;i<5;i++)
            if(_return[i]==-1)     code+='<span style="color: grey;">'  +myans.charAt(i)+'</span>';
            else if(_return[i]==1) code+='<span style="color: orange;">'+myans.charAt(i)+'</span>';
            else                   code+='<span style="color: green;">' +myans.charAt(i)+'</span>';
    }
    if(type=="Standard Rule Level 1"){
        var total=0;
        for(var i=0;i<5;i++)
            if(_return[i]>-1)total++;
        code+=myans+` <span style="color: purple;">`+total+`</span>`;
    }
    if(type=="Standard Rule Level 2"){
        for(var i=0;i<5;i++)
            if(_return[i]==-1) code+='<span style="color: grey;">' +myans.charAt(i)+'</span>';
            else               code+='<span style="color: orange;">'+myans.charAt(i)+'</span>';
    }
    if(type=="Chef Rule"){
        var total=0;
        for(var i=0;i<5;i++)
            if(_return[i]>-1) total+=_return[i];
        code+=myans+` <span style="color: purple;">`+total+`</span>`;
    }
    if(type=="Round Rule"){
        var total=0;
        for(var i=0;i<5;i++)
            if(_return[i]>-1) total+=3-_return[i];
        code+=myans+` <span style="color: purple;">`+total+`</span>`;
    }
    return code;
}
function newrandompkcode(len){
    var res="",charset="01234567890123456789abcdefghijklmnopqrstuvwxyz";
    for(var i=0;i<len;i++)
        res+=charset[parseInt(Math.random()*charset.length)];
    return res;
}
function newpkcode(){
    while(true){
        var code=newrandompkcode(4);
        var flag=false;
        for(var i=0;i<pkcodes.length;i++)
            if(pkcodes[i].code==code)flag=true;
        if(!flag)return code;
    }
}

app.all('*',function(req,res,next){
    if(!req.get('Origin'))return next();
    res.set('Access-Control-Allow-Origin','*');
    res.set('Access-Control-Allow-Methods','GET');
    res.set('Access-Control-Allow-Headers','X-Requested-With, Content-Type');
    if ('OPTIONS'==req.method)return res.send(200);
    next();
});

app.get('/f/*',(req,res)=>{
    var filename=req.url.split('/f/')[1];
    if(filename.split('..').length>1)res.sendStatus(404);
    fs.access(__dirname+"/f/"+filename,fs.constants.R_OK,(err)=>{
        if(!err)
            res.sendFile("f/"+filename,{root:__dirname},(err)=>{});
        else{
            console.log('[log] can\'t find file "'+filename+'"')
            res.sendStatus(404);
        }
    });
});

app.get('/',(req,res)=>{
    res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">Home</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <style>
        </style>
    </head>
    <body>
        <h3>Home</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <button onclick="location.pathname='/chat';">Chat</button>
        <button onclick="location.pathname='/ranking';">Ranking</button>
        <button onclick="location.pathname='/contests';">Contests</button>
        <button onclick="location.pathname='/pk';">1v1 PK</button>
        <button onclick="location.pathname='/answer';">Answer Query</button>
        <button onclick="location.pathname='/f/words.json';">Download List</button>
    </body>
</html>
    `);
});

app.get('/saber',(req,res)=>{
    res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">Topan Saber</title>
        <script src="/f/ace.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/ext-language_tools.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <style>
        </style>
    </head>
    <body>
        <h3>Topan Saber</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <pre id="code" class="ace_editor" style="min-height: 400px;">
<textarea class="ace_text-input" id="sys">#include &lt;bits/stdc++.h&gt;
using namespace std;

int main(){
    return 0;
}</textarea></pre>
        <script>
            editor = ace.edit("code");
            theme = "clouds"
            language = "c_cpp"
            editor.setTheme("ace/theme/" + theme);
            editor.session.setMode("ace/mode/" + language);
            editor.setFontSize(18);
            editor.setReadOnly(false); 
            editor.setOption("wrap", "free")
            ace.require("ace/ext/language_tools");
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            });
        </script>
    </body>
</html>
    `);
});

app.get('/login',(req,res)=>{
    res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">Login</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <script>
            $(document).ready(function(){
                $("#user-login").click(function(){
                    $.post("/login/try",{name:$('#login-name')[0].value,password:$('#login-password')[0].value},function(data,status){
                        if(data.error!=undefined)alert(data.error);
                        else{
                            setCookie("logined","true",1);
                            setCookie("loginname",data.name,1);
                            setCookie("loginchecker",data.checker,1);
                            setCookie("loginid",data.id,1);
                            location.pathname="";
                        }
                    });
                });
            });
        </script>
    </head>
    <body>
        <h3>Login</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <p><input placeholder="Username" id="login-name"></input></p>
        <p><input placeholder="Password" type="password" id="login-password"></input></p>
        <p><button id="user-login">Login</button></p>
    </body>
</html>
    `);
});
app.post('/login/try',(req,res)=>{
    var i=0;
    while(userdata.users.length>i&&userdata.users[i].name!=req.body.name)i++;
    if(userdata.users.length==i)res.status(200).json({error:'Can\'t find this user.'});
    else{
        if(password_hash_second(password_hash_first(req.body.password))==userdata.users[i].checker){
            console.log("[log] "+userdata.users[i].name+" logined.");
            res.status(200).json({id:userdata.users[i].id,name:userdata.users[i].name,checker:password_hash_first(req.body.password)});
        }
        else res.status(200).json({error:'Password error.'});
    }
});

app.get('/user/settings',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">Settings</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <script>
            $(document).ready(function(){
                $("#confirm").click(function(){
                    if($('#password-new')[0].value!=$('#password-repeat')[0].value)alert('The two passwords are different.');
                    else
                        $.post("/user/changepassword",{
                            userid: getCookie('loginid'),
                            oldpassword: $('#password-old')[0].value,
                            newpassword: $('#password-new')[0].value
                        },function(data,status){
                            if(data.error!=undefined)alert(data.error);
                            else{
                                setCookie("logined","true",1);
                                setCookie("loginname",data.name,1);
                                setCookie("loginchecker",data.checker,1);
                                setCookie("loginid",data.id,1);
                                alert("Change success!");
                                location.path="";
                            }
                        });
                });
            });
        </script>
    </head>
    <body>
        <h3>Settings</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <h4>Change Password</h4>
        <p><input placeholder="Old Password" type="password" id="password-old"></input></p>
        <p><input placeholder="New Password" type="password" id="password-new"></input></p>
        <p><input placeholder="Repeat Password" type="password" id="password-repeat"></input></p>
        <p><button id="confirm">Confirm</button></p>
    </body>
</html>
        `);
    }
});
app.post('/user/changepassword',(req,res)=>{
    var oldpassword=req.body.oldpassword;
    var newpassword=req.body.newpassword;
    var userid=req.body.userid;
    var i=0;
    while(userdata.users.length>i&&userdata.users[i].id!=userid)i++;
    if(userdata.users.length==i)res.status(200).json({error:'Can\'t find this user.'});
    else{
        if(password_hash_second(password_hash_first(oldpassword))==userdata.users[i].checker){
            userdata.users[i].checker=password_hash_second(password_hash_first(newpassword));
            fs.writeFile("datas/users.json",JSON.stringify(userdata),function(err){
                if(err)console.log('[error] can\'t change uid='+String(userid)+" password: "+err);
                else console.log("[log] "+userdata.users[i].name+" changed his password (success).");
            });
            res.status(200).json({id:userdata.users[i].id,name:userdata.users[i].name,checker:password_hash_first(req.body.password)});
        }
        else res.status(200).json({error:'Password error.'});
    }
});

app.get('/chat',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">Chat</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <style>
        </style>
    </head>
    <body>
        <h3>Chat</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <div style=""></div>
    </body>
</html>
        `);
    }
});

app.get('/contests',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        var codes="";
        for(var i=0;i<contests.length;i++){
            codes+=`<p><button onclick="location.pathname='/contest/`+i+`/home';">`+contests[i].title
                  +`</button> By <a href="/user/`+contests[i].author+`">`
                  +getUserdataById(contests[i].author).name+`</a>, Start at `
                  +new Date(contests[i].openTime).toLocaleString()+`</p>`;
        }
        res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">Contest List</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <style>
        </style>
    </head>
    <body>
        <h3>Contest List</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <p>Total: `+contests.length+`</p>
        `+codes+`
    </body>
</html>
        `);
    }
});
app.get('/contest/*/home',(req,res)=>{
    var id=Math.floor(Number(req.url.split('/contest/')[1].split('/')[0]));
    if("/contest/"+String(id)+"/home"!=req.url)res.sendStatus(404);
    else{
        if(!checklogin(req))res.redirect('/login');
        else{
            var codes="";
            for(var i=0;i<contests[id].tasks.length;i++)
                codes+=`<button onclick="location.pathname='/contest/`
                    +id+`/task/`+String(i+1)+`';">Task #`+String(i+1)+`</button>`
            res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">`+contests[id].title+`</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <style>
        </style>
    </head>
    <body>
        <h3>`+contests[id].title+`</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <p>By <a href="/user/`+contests[id].author+`">`
            +getUserdataById(contests[id].author).name+
        `</a>; Start at `+(new Date(contests[id].openTime)).toLocaleString()+`</p>
        <button onclick="location.pathname='/contest/`+id+`/ranking';">Ranking</button>
        <h4>Task List</h4>
        `+codes+`
    </body>
</html>
            `);
        }
    }
});
app.get('/contest/*/task/*',(req,res)=>{
    var id=Math.floor(Number(req.url.split('/contest/')[1].split('/')[0]));
    var taskid=Math.floor(Number(req.url.split('/task/')[1].split('/')[0]));
    if("/contest/"+String(id)+"/task/"+String(taskid)!=req.url)res.sendStatus(404);
    else{
        if(!checklogin(req))res.redirect('/login');
        else{
            var recordcode="<table border='1'><tr><th>ID</th><th>Result</th><th>Time</th></tr>";
            var temp=getrecords(Number(getCookie("loginid",req.headers.cookie)),id,taskid);
            for(var i=temp.records.length-1;i>=0;i--)
                recordcode+=`<tr><th>`+String(i+1)+`</th><th>`
                           +wordlechecker(temp.records[i].word,
                                contests[id].tasks[taskid-1].answer,contests[id].tasks[taskid-1].rule)
                           +`</th><th>`+(new Date(temp.records[i].time)).toLocaleString()+`</th></tr>`;
            recordcode+=`</table>`;
            res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">Task #`+taskid+` - `+contests[id].title+`</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <script>
            $(document).ready(function(){
                $('#submit').click(()=>{
                    $.post("/contest/`+id+`/task/`+taskid+`/submit",
                        {word: $('#submit-answer')[0].value},
                        (data,status)=>{
                            if(data.error!=undefined)alert(data.error);
                            else location.href="";
                        }
                    );
                });
            });
        </script>
    </head>
    <body>
        <h3>Task #`+taskid+` - `+contests[id].title+`</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <p>Checker: `+contests[id].tasks[taskid-1].rule+`</p>
        <h4>Rule Describe</h4>
        `+getRuleDescribe(contests[id].tasks[taskid-1].rule)+`
        <h4>Submit</h4>
        <p><input placeholder="Your Answer" id="submit-answer"></input><button id="submit">Submit</button></p>  
        <h4>Records</h4>
        `+recordcode+`
    </body>
</html>
            `);
        }
    }
});
app.post('/contest/*/task/*/submit',(req,res)=>{
    var id=Math.floor(Number(req.url.split('/contest/')[1].split('/')[0]));
    var taskid=Math.floor(Number(req.url.split('/task/')[1].split('/')[0]));
    if("/contest/"+String(id)+"/task/"+String(taskid)+"/submit"!=req.url)res.sendStatus(404);
    else{
        if(!checklogin(req))res.redirect('/login');
        else{
            if(new Date().getTime()<contests[id].openTime){
                res.status(200).json({error:"The contest hasn't started yet."});
                return;
            }
            var word=req.body.word;
            if(getrecords(Number(getCookie("loginid",req.headers.cookie)),id,taskid).solved)
                res.status(200).json({error:"You have passed this task and cannot submit it again."});
            else if(!checkword(word))res.status(200).json({error:"Word length must be 5 and it is a legal word."});
            else{
                var i=0;
                while(i<contests[id].users.length&&contests[id].users[i].id!=Number(getCookie("loginid",req.headers.cookie)))i++;
                if(i==contests[id].users.length){
                    var pushdata={
                        id: Number(getCookie("loginid",req.headers.cookie)),
                        tasks: [],
                        score: 0,
                        countrecords: 0
                    };
                    for(var i=0;i<contests[id].tasks.length;i++)
                        pushdata.tasks.push({records:[],solved:false});
                    contests[id].users.push(pushdata);
                }
                var contestdata=contests[id].users;
                i=0;
                while(contestdata.length>i&&contestdata[i].id!=Number(getCookie("loginid",req.headers.cookie)))i++;
                contests[id].users[i].tasks[taskid-1].records.push({word:word,time:new Date().getTime()});
                if(word==contests[id].tasks[taskid-1].answer){
                    contests[id].users[i].tasks[taskid-1].solved=true;
                    contests[id].users[i].score++;
                    contests[id].users[i].countrecords+=contests[id].users[i].tasks[taskid-1].records.length-1;
                }
                fs.writeFile("datas/contest.json",JSON.stringify({contests:contests}),function(err){
                    if(err)console.log('[error] can\'t change save new submit: '+err);
                    else console.log("[log] "+getUserdataById(Number(getCookie("loginid",req.headers.cookie))).name+" submited task #"+taskid+" in contest #"+id+".");
                    res.status(200).json({success:true});
                });
            }
        }
    }
});
app.get('/contest/*/ranking',(req,res)=>{
    var id=Math.floor(Number(req.url.split('/contest/')[1].split('/')[0]));
    if("/contest/"+String(id)+"/ranking"!=req.url)res.sendStatus(404);
    else{
        if(!checklogin(req))res.redirect('/login');
        else{
            var rank=contests[id].users.sort((x,y)=>{
                if(x.score==y.score)return x.countrecords-y.countrecords;
                else return y.score-x.score;
            });
            var counttasks=contests[id].tasks.length;
            var codes=`
<table border="1">
    <tr>
        <th>Ranking</th>
        <th>User</th>
        <th>Solved</th>
        <th>Records</th>`;
            for(var i=0;i<counttasks;i++)
                codes+=`<th style="min-width: 40px;"><a href="/contest/`+id+`/task/`+String(i+1)+`">T`+String(i+1)+`</th>`;
            for(var i=0;i<rank.length;i++){
                codes+=`<tr><th>`+String(i+1)+`</th><th><a href="/user/`
                      +String(rank[i].id)+`">`+getUserdataById(rank[i].id).name
                      +`</a></th><th>`+rank[i].score+`</th><th>`+String(rank[i].countrecords)+`</th></th>`;
                for(var j=0;j<counttasks;j++)
                    if(!rank[i].tasks[j].solved){
                        if(rank[i].tasks[j].records.length>0)
                            codes+=`<th><span style="color: red;">-`
                                +String(rank[i].tasks[j].records.length)+`</span></th>`;
                        else codes+=`<th></th>`;
                    }
                    else if(rank[i].tasks[j].records.length==1)
                        codes+=`<th><span style="color: green;">+</span</th>`;
                    else codes+=`<th><span style="color: green;">+`
                        +String(rank[i].tasks[j].records.length-1)+`</span</th>`;
                codes+=`</tr>`;
            }
            codes+=`</table>`;
            res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">Ranking - `+contests[id].title+`</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <style>
        </style>
    </head>
    <body>
        <h3>Ranking - `+contests[id].title+`</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        `+codes+`
    </body>
</html>
            `);
        }
    }
});
app.get('/pk',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        var codes="";
        for(var i=0;i<rules.length;i++)
            codes+=`<option value="`+i+`">`+rules[i].name+`</option>`;
        res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">1v1 PK arena</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <script>
            var res={
                code: null,
                coolingEndTime: new Date().getTime(),
                failureTime: new Date().getTime(),
            }
            $(document).ready(()=>{
                setInterval(()=>{
                    if(res.code!=null){
                        $("#res-pk-code")[0].innerText=res.code;
                        $("#res-pk-url")[0].innerText=location.origin+"/pk/"+res.code+"/play";
                        if(res.coolingEndTime-new Date().getTime()<=0)$("#res-cooling-end")[0].innerText="Complete.";
                        else $("#res-cooling-end")[0].innerText=String(parseInt((res.coolingEndTime-new Date().getTime())/60000))+" min "+String(parseInt((res.coolingEndTime-new Date().getTime())/1000)%60)+" s";
                        if(res.failureTime-new Date().getTime()<=0)$("#res-failure-time")[0].innerText="Expired.";
                        else $("#res-failure-time")[0].innerText=String(parseInt((res.failureTime-new Date().getTime())/60000))+" min "+String(parseInt((res.failureTime-new Date().getTime())/1000)%60)+" s";
                    }
                },500);
                setInterval(()=>{
                    if(res.code!=null)
                        $.post("/pk/status",{code:res.code},
                            (data,status)=>{
                                if(data.error==undefined&&data.started)
                                    location.pathname="/pk/"+res.code+"/play";
                            }
                        );
                },5000);
                $("#create-pk-code").click(()=>{
                    var temp=document.ruleform.ruleselect.value.split('+'),rule=temp[0];
                    for(var i=1;i<temp.length;i++)rule+=" "+temp[i];
                    $.post("/pk/create",
                        {rule:document.ruleform.ruleselect.value},
                        (data,status)=>{
                            if(data.error!=undefined)alert(data.error);
                            else{
                                $("#remover").remove();
                                res=data;
                            }
                        }
                    );
                });
                $("#enter-pk-code").click(()=>{
                    location.pathname="/pk/"+$("#pk-code")[0].value+"/play";
                });
            });
        </script>
    </head>
    <body>
        <h3>1v1 PK arena</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <p>If you receive an invitation from others, please enter the invitation code below and confirm.</p>
        <p>若您收到他人的邀请，请在下面输入邀请码并且确认。</p>
        <p><input placeholder="PK code" id="pk-code"></input><button id="enter-pk-code">Enter</button></p>
        <p>If you want to invite others, please select a competition rule and generate an invitation code.</p>
        <p>若您想邀请他人，请选择一个比赛规则并生成邀请码。</p>
        <p>Note that the invitation code is valid for 10 minutes. If no one joins the game within the validity period, it will become invalid. However, no new invitation code can be generated within 5 minutes after the invitation code is generated.</p>
        <p>注意邀请码的有效期为 10 分钟，有效期内无人加入游戏则失效。而生成邀请码后 5 分钟内不能生成新的邀请码。</p>
        <div id="remover">
            <form name="ruleform">
                <label>Rule: </label>
                <select name="ruleselect">${codes}</select>
            </form>
            <button id="create-pk-code">Create</button>
        </div>
        <p>Code: <span id="res-pk-code"></span></p>
        <p>Cooling end time: <span id="res-cooling-end"></span></p>
        <p>Failure time: <span id="res-failure-time"></span></p>
        <p>Link: <span id="res-pk-url"></span></p>
    </body>
</html>
        `);
    }
});
app.get('/pk/*/play',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        var pkid=req.url.split('/pk/')[1].split('/')[0];
        var i=0;
        while(i<pkcodes.length&&pkcodes[i].code!=pkid)i++;
        if(i==pkcodes.length)res.redirect('/pk');
        else{
            var uid=Number(getCookie("loginid",req.headers.cookie));
            if(!pkcodes[i].started){
                if(pkcodes[i].inviter==uid){
                    res.redirect('/pk');
                    return;
                }
                pkcodes[i].started=true;
                pkcodes[i].participant=uid;
                pkcodes[i].answer=easywords[parseInt(Math.random()*easywords.length)];
                console.log("[log] "+getUserdataById(pkcodes[i].participant).name+" accepted "+getUserdataById(pkcodes[i].inviter).name+"'s invitation.")
                delete pkcodes[i].failureTime;
                pkcodes[i].startTime=new Date().getTime()+15000;
                pkcodes[i].records={
                    inviter: [],
                    participant: []
                };
                pkcodes[i].status={
                    timeout: {
                        inviter: pkcodes[i].startTime+60000,
                        participant: pkcodes[i].startTime+60000
                    },
                    lastsubmit: {
                        inviter: pkcodes[i].startTime,
                        participant: pkcodes[i].startTime
                    }
                }
            }
            if(uid!=pkcodes[i].inviter&&uid!=pkcodes[i].participant){
                res.redirect('/pk'); return;
            }
            fs.writeFile("datas/pkcode.json",JSON.stringify({codes:pkcodes}),(err)=>{});
            var recs;
            if(pkcodes[i].inviter==uid) recs=pkcodes[i].records.inviter;
            else                        recs=pkcodes[i].records.participant;
            var recordcode="<table border='1'><tr><th>ID</th><th>Result</th></tr>";
            for(var j=recs.length-1;j>=0;j--)
                recordcode+=`<tr><th>${j+1}</th>
                    <th>${wordlechecker(recs[j],pkcodes[i].answer,pkcodes[i].rule)}</th></tr>`;
            recordcode+=`</table>`;
            res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">1v1 PK arena</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <script>
            var timeout,starttime;
            $(document).ready(()=>{
                $.post("/pk/status",{code:"${pkid}"},
                    (data,status)=>{
                        $("#recordstotal-inviter")[0].innerText=data.total.inviter;
                        $("#recordstotal-participant")[0].innerText=data.total.participant;
                        $("#lastsubmittime-inviter")[0].innerText=new Date(data.lastsubmit.inviter).toLocaleString();
                        $("#lastsubmittime-participant")[0].innerText=new Date(data.lastsubmit.participant).toLocaleString();
                        starttime=data.startTime;
                        timeout=data.timeout;
                        setInterval(()=>{
                            if($("#gamestart").length>0){
                                if(new Date().getTime()>=starttime)
                                    $("#gamestart").remove();
                                else{
                                    var temp=parseInt((starttime-new Date().getTime())/1000);
                                    $("#starttime")[0].innerText=parseInt(temp/60)+" min "+temp%60+" s";
                                }
                            }
                            var temp2=parseInt((timeout-new Date().getTime())/1000);
                            $("#submittimelimit")[0].innerText=parseInt(temp2/60)+" min "+temp2%60+" s";
                        },500);
                    }
                );
                setInterval(()=>{
                    $.post("/pk/status",{code:"${pkid}"},
                        (data,status)=>{
                            $("#recordstotal-inviter")[0].innerText=data.total.inviter;
                            $("#recordstotal-participant")[0].innerText=data.total.participant;
                            $("#lastsubmittime-inviter")[0].innerText=new Date(data.lastsubmit.inviter).toLocaleString();
                            $("#lastsubmittime-participant")[0].innerText=new Date(data.lastsubmit.participant).toLocaleString();
                            starttime=data.startTime;
                            timeout=data.timeout;
                        }
                    );
                },3000);
                $(document).ready(function(){
                    $('#submit').click(()=>{
                        if($("#gamestart").length==0)
                            $.post("/pk/${pkid}/submit",
                                {word: $('#submit-answer')[0].value},
                                (data,status)=>{
                                    if(data.error!=undefined)alert(data.error);
                                    else location.href="";
                                }
                            );
                    });
                });
            });
        </script>
    </head>
    <body>
        <h3>1v1 PK arena</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <p><span id="recordstotal-inviter">0</span> <a
        href="/user/${pkcodes[i].inviter}">${getUserdataById(pkcodes[i].inviter).name}
        </a> VS <a href="/user/${pkcodes[i].participant}">${getUserdataById(pkcodes[i].participant).name}</a> <span
        id="recordstotal-participant">0</span></p>
        <p><a href="/user/${pkcodes[i].inviter}">${getUserdataById(pkcodes[i].inviter).name}</a>'s last submission time: <span id="lastsubmittime-inviter"></span></p>
        <p><a href="/user/${pkcodes[i].participant}">${getUserdataById(pkcodes[i].participant).name}</a>'s last submission time: <span id="lastsubmittime-participant"></span></p>
        <p>Checker: ${pkcodes[i].rule}</p>
        <h4>Rule Describe</h4>
        ${getRuleDescribe(pkcodes[i].rule)}
        <p id="gamestart"><strong>Game will start after <span id="starttime"></span></strong></p>
        <h4>Submit (Please submit within <span id="submittimelimit"></span>)</h4>
        <p><input placeholder="Your Answer" id="submit-answer"></input><button id="submit">Submit</button></p>  
        <h4>Records</h4>
        ${recordcode}
    </body>
</html>
            `);
        }
    }
});
app.post('/pk/status',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        var uid=Number(getCookie("loginid",req.headers.cookie));
        var pkid=req.body.code,i=0;
        while(i<pkcodes.length&&pkcodes[i].code!=pkid)i++;
        if(i==pkcodes.length)res.redirect('/pk');
        else if(uid!=pkcodes[i].inviter&&uid!=pkcodes[i].participant)res.redirect('/pk');
        else if(pkcodes[i].started){
            res.status(200).json({
                started: true,
                total: {
                    inviter: pkcodes[i].records.inviter.length,
                    participant: pkcodes[i].records.participant.length
                },
                lastsubmit: pkcodes[i].status.lastsubmit,
                startTime: pkcodes[i].startTime,
                timeout: uid==pkcodes[i].inviter
                         ?pkcodes[i].status.timeout.inviter
                         :pkcodes[i].status.timeout.participant
            });
        }
        else res.status(200).json({started:false});
    }
});
app.post('/pk/*/submit',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        var uid=Number(getCookie("loginid",req.headers.cookie));
        var pkid=req.url.split('/pk/')[1].split('/')[0];
        var i=0;
        while(i<pkcodes.length&&pkcodes[i].code!=pkid)i++;
        if(i==pkcodes.length||!pkcodes[i].started)res.redirect('/pk');
        else if(uid!=pkcodes[i].inviter&&uid!=pkcodes[i].participant)res.redirect('/pk');
        else{
            if(new Date().getTime()<pkcodes[i].startTime){
                res.status(200).json({error:"The pk hasn't started yet."});
                return;
            }
            var word=req.body.word;
            if(pkcodes[i].inviter==uid&&pkcodes[i].records.inviter[pkcodes[i].records.inviter.length-1]==pkcodes[i].answer)
                res.status(200).json({error:"You have passed this task and cannot submit it again."});
            else if(pkcodes[i].participant==uid&&pkcodes[i].records.participant[pkcodes[i].records.participant.length-1]==pkcodes[i].answer)
                res.status(200).json({error:"You have passed this task and cannot submit it again."});
            else if(!checkword(word))res.status(200).json({error:"Word length must be 5 and it is a legal word."});
            else{
                var submittime=new Date().getTime();
                if(pkcodes[i].inviter==uid){
                    pkcodes[i].records.inviter.push(word);
                    pkcodes[i].status.lastsubmit.inviter=submittime;
                    pkcodes[i].status.timeout.inviter=submittime+60000;
                }
                else{
                    pkcodes[i].records.participant.push(word);
                    pkcodes[i].status.lastsubmit.participant=submittime;
                    pkcodes[i].status.timeout.participant=submittime+60000;
                }
                fs.writeFile("datas/pkcode.json",JSON.stringify({codes:pkcodes}),(err)=>{});
                res.status(200).json({success:true});
            }
        }
    }
});
app.post('/pk/create',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        var uid=Number(getCookie("loginid",req.headers.cookie));
        var rule=Number(req.body.rule);
        var id=getidofuser(uid);
        if(userdata.users[id].data.pk.coolingEndTime>new Date().getTime())
            res.status(200).json({error:"The cooling time is not over yet. ("
                +String(parseInt((userdata.users[id].data.pk.coolingEndTime-new Date().getTime())/60000))+" minute(s) left)"});
        else{
            var nowtime=new Date().getTime();
            userdata.users[id].data.pk.coolingEndTime=nowtime+300000;
            pkcodes.push({
                inviter: uid,
                code: newpkcode(),
                rule: rules[rule].name,
                failureTime: nowtime+600000,
                started: false
            });
            fs.writeFile("datas/users.json",JSON.stringify(userdata),(err)=>{});
            fs.writeFile("datas/pkcode.json",JSON.stringify({codes:pkcodes}),(err)=>{});
            console.log(`[log] ${userdata.users[id].name} created a new pk code: ${pkcodes[pkcodes.length-1].code}`);
            res.status(200).json({
                code: pkcodes[pkcodes.length-1].code,
                coolingEndTime: userdata.users[id].data.pk.coolingEndTime,
                failureTime: pkcodes[pkcodes.length-1].failureTime
            });
        }
    }
});

app.get('/ranking',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">Chat</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <style>
        </style>
    </head>
    <body>
        <h3>Chat</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <div style=""></div>
    </body>
</html>
        `);
    }
});

app.get('/answer',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">Answers</title>
        <script src="/f/jquery.js" type="text/javascript" charset="utf-8"></script>
        <script src="/f/user.js" type="text/javascript" charset="utf-8"></script>
        <script>
            function getCurrentTime() {
                var date=new Date();
                var year=date.getFullYear();
                var month=repair(date.getMonth() + 1);
                var day=repair(date.getDate());
                var hour=repair(date.getHours());
                var minute=repair(date.getMinutes());
                var second=repair(date.getSeconds());
                var curTime=year+"-"+month+"-"+day
                           +" "+hour+":"+minute+":"+second;
                return curTime;
            }
            function repair(i){
                if(i>=0&&i<=9)return "0"+i;
                else return i;
            }
            $(document).ready(()=>{
                $("#date")[0].value=getCurrentTime();
                $.post("/answer/query",
                    {date:$("#date")[0].value},
                    (data,status)=>{
                        $("#result")[0].innerText=data.answer;
                    }
                );
                $("#query").click(()=>{
                    $.post("/answer/query",
                        {date:$("#date")[0].value},
                        (data,status)=>{
                            $("#result")[0].innerText=data.answer;
                        }
                    );
                });
            });
        </script>
    </head>
    <body>
        <h3>Answers</h3>
        <p id="user-tip">Please login first. <a href="/login">Click here &gt;&gt;&gt;</a></p>
        <p><input placeholder="Date" id="date"></input><button id="query">Query</button></p>
        <p>The day's answer is "<span id="result"></span>".</p>
    </body>
</html>
        `);
    }
});
app.post('/answer/query',(req,res)=>{
    if(!checklogin(req))res.redirect('/login');
    else{
        var nowtime=new Date(req.body.date).getTime();
        nowtime/=1000*60*60*24;
        nowtime=Math.floor(nowtime-324-2/3)%easywords.length;
        res.json({answer:easywords[nowtime]});
    }
});

app.listen(8699,()=>{
    console.log('[log] Port :8699 is opened.');
});