const express=require('express'),
      app=express();
const cors=require('cors');
app.use(cors());
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const ejs=require('ejs');
const Template=require('./src/lib/template.js');

const fs=require('fs');

var rules;
fs.readFile("datas/rules.json",'utf8',(err,data)=>{
    rules=JSON.parse(data).rules;
});

// const path=require('path');
// var multer=require('multer');
// var upl=multer({dest: "upload"});

// const User=require("./src/user.js"),
//       Judger=require("./src/lib/judger.js");

app.all('*',(req,res,next)=>{
    // if(new Date().getTime()>pklastfix+600000){
    //     for(var i=0;i<pkcodes.length;i++)
    //         checkpkfinish(i,pkcodes[i].code);
    //     pklastfix=new Date().getTime();
    // }
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

// app.get('/',require("./src/model/home.js"));
app.get('/',(req,res)=>{
    ejs.renderFile("./src/templates/home.html",{rules: rules},(err,HTML)=>{
        res.send(Template({title: `Home`,
                           header: ``,
                           user: null},HTML));
    });
});

app.listen(8599,()=>{
    console.log('[log] Port :8599 is opened.');
});