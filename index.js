const express=require('express'),
      app=express();
const cors=require('cors');
app.use(cors());
const path=require('path');
const fs=require('fs');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(require('cookie-parser')());
const URL=require('url');

const ejs=require('ejs');
const Template=require('./src/lib/template.js');

const _=require('./locales/index.js');

var colors=require('colors');
colors.setTheme({
    warn: 'yellow',
    error: 'red',
    log: 'green',
    user: 'white',
    underline: 'underline',
    italic: 'italic',
    bold: 'bold',
    head: 'grey'
});

if(!fs.existsSync("db")){
    fs.mkdirSync("db");
    fs.copyFileSync("src/database/main.json","db/main.json");
    fs.mkdirSync("db/headimages");
    fs.copyFileSync("src/database/headimages/default.png","db/headimages/default.png");
}

var DB=require('./data/main.json');

// const path=require('path');
// var multer=require('multer');
// var upl=multer({dest: "upload"});

const User=require("./src/model/user.js");

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
        req.uid=req.cookies['wordle-uid'],
        req.logined=true;
    else res.cookie("wordle-uid",""),
         res.cookie("wordle-cookie",""),
         req.logined=false;
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

app.use("/file",express.static(path.join(__dirname,'src/assets')));

app.get('/',(req,res)=>{
    ejs.renderFile("./src/templates/home.html",{rules: DB.rules, _: req.body._},(err,HTML)=>{
        res.send(Template({title: `${req.body._('home')}`,
                           header: ``,
                           user: User.userdataByReq(req).name,
                           startTime: req.body.startTime,
                           _: req.body._
                          },HTML));
    });
});

app.use('/login',require('./src/api/login.js'));
app.use('/i',require('./src/api/i.js'));
app.use('/user/:uid',require('./src/api/user.js'));
app.use('/pk',require('./src/api/pk.js'));

app.get('/setlang/:lang',(req,res)=>{
    var to=req.params.lang;
    if(!_.langs.includes(to))to=_.langs[0];
    res.cookie("wordle-lang",to);
    if(!req.headers.referer)return res.redirect("/");
    var direct=URL.parse(req.headers.referer);
    if(direct.host!=req.headers.host)res.redirect("/");
    else res.redirect(direct.href);
});
app.get('/robots.txt',(req,res)=>{
    res.sendFile("src/assets/robots.txt",{root:__dirname},(err)=>{});
});

app.listen(8599,()=>{
    console.log('    system | '.head+'Port :8599 is opened'.log);
});

/*
ELO Rating: https://blog.csdn.net/qq100440110/article/details/70240824
Git: https://molmin.github.io/blog/article?id=16eb41280d1fb970c8705ae637a094c7
Crypto: https://blog.csdn.net/loeyln/article/details/118254996
正则：https://deerchao.cn/tutorials/regex/regex.htm
*/