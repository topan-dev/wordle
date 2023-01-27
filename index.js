const express=require('express'),
      app=express();
const cors=require('cors');
app.use(cors());
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(require('cookie-parser')());

const ejs=require('ejs');
const Template=require('./src/lib/template.js');

const fs=require('fs');

const _=require('./locales/index.js');

var colors=require('colors');
colors.setTheme({
    warn: 'yellow',
    error: 'red',
    log: 'green',
    user: 'white',
    underline: 'underline',
    italic: 'italic',
    bold: 'bold'
});

var DB=require('./datas/main.json');

// const path=require('path');
// var multer=require('multer');
// var upl=multer({dest: "upload"});

const User=require("./src/model/user.js"),
      Judger=require("./src/lib/judger.js");

app.all('*',(req,res,next)=>{
    // if(new Date().getTime()>pklastfix+600000){
    //     for(var i=0;i<pkcodes.length;i++)
    //         checkpkfinish(i,pkcodes[i].code);
    //     pklastfix=new Date().getTime();
    // }
    req.body.startTime=new Date().getTime();
    if(!_.langs.includes(req.cookies['wordle-lang']))
        req.cookies['wordle-lang']='en',
        res.cookie("wordle-lang",'en');
    req.body._=_[req.cookies['wordle-lang']];
    if(User.checkloginByReq(req))
        req.uid=req.cookies['wordle-uid'];
    else res.cookie("wordle-uid",""),
         res.cookie("wordle-cookie","");
    res.set('Access-Control-Allow-Origin','*');
    res.set('Access-Control-Allow-Methods','GET');
    res.set('Access-Control-Allow-Headers','X-Requested-With, Content-Type');
    if ('OPTIONS'==req.method)return res.send(200);
    // if (checklogin(req) || req.url == '/' || req.url == '/login' || req.url == '/login/try' || !(req.url.split("/f/")[0])) {
    next();
    // } else {
    //     res.redirect('/login');
    // }
});

app.get('/',(req,res)=>{
    ejs.renderFile("./src/templates/home.html",{rules: DB.rules, _: req.body._},(err,HTML)=>{
        res.send(Template({title: `Home`,
                           header: ``,
                           user: User.userdataByReq(req).name,
                           startTime: req.body.startTime,
                           _: req.body._
                          },HTML));
    });
});
app.get('/login',(req,res)=>{
    if(User.checkloginByReq(req)){
        res.redirect("/");
        return;
    }
    ejs.renderFile("./src/templates/login.html",{_: req.body._},(err,HTML)=>{
        res.send(Template({title: `Login`,
                           header: `<script src="/file/scripts/login.js"></script>`,
                           user: User.userdataByReq(req).name,
                           startTime: req.body.startTime,
                           onlogin: true,
                           _: req.body._
                          },HTML));
    });
});
app.post('/login/try',(req,res)=>{
    var login_name=req.body.name,
        login_password=req.body.password;
    var result=User.checkloginByPassword(login_password,login_name);
    if(result==null)
        res.status(200).json({error: req.body._('cannot_find_user')});
    else if(result){
        var uid=User.userdataByName(login_name).uid;
        res.cookie("wordle-uid",uid,{maxAge: 1000*60*60*24});
        res.cookie("wordle-cookie",User.Encode(login_password,uid),{maxAge: 1000*60*60*24});
        res.status(200).json({});
    }
    else res.status(200).json({error: req.body._('password_error')});
});

app.get('/file/*',(req,res)=>{
    /* Params is not used because secondary folders
       are prevented from appearing in static resources. */
    var filename=req.params[0];
    res.sendFile("src/assets/"+filename,{root:__dirname},(err)=>{});
});

app.listen(8599,()=>{
    console.log('Port :8599 is opened.'.log);
});

/*
ELO Rating: https://blog.csdn.net/qq100440110/article/details/70240824
Git: https://molmin.github.io/blog/article?id=16eb41280d1fb970c8705ae637a094c7
Crypto: https://blog.csdn.net/loeyln/article/details/118254996
*/