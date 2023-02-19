const express=require('express'),
      router=express.Router();

const User=require("./../model/user.js");
const ejs=require('ejs');
const Template=require('./../lib/template.js');
const _=require('./../../locales/index.js');

const format=require('string-format');
format.extend(String.prototype);

var DB=require('./../../data/main.json');
var colors=require('colors');
colors.setTheme({
    warn: 'yellow',
    error: 'red',
    log: 'green',
    user: 'white',
    underline: 'underline',
    bold: 'bold',
    head: 'grey'
});

router.get('/',(req,res)=>{
    if(req.logined){
        ejs.renderFile("./src/templates/pk_logined.html",{rules: DB.rules, _: req.body._},(err,HTML)=>{
            res.send(Template({title: `${req.body._('pk_onheader')}`,
                               header: `<script src="/file/scripts/login.js"></script>`,
                               user: User.userdataByReq(req).name,
                               startTime: req.body.startTime,
                               onpk: true,
                               _: req.body._
                              },HTML));
        });
    }
    else{
        ejs.renderFile("./src/templates/pk_guest.html",{_: req.body._},(err,HTML)=>{
            res.send(Template({title: `${req.body._('pk_onheader')}`,
                               header: `<script src="/file/scripts/pk_home.js"></script>`,
                               user: User.userdataByReq(req).name,
                               startTime: req.body.startTime,
                               onpk: true,
                               _: req.body._
                              },HTML));
        });
    }
});

module.exports=router;