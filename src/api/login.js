const express=require('express'),
      router=express.Router();

const User=require("./../model/user.js");
const ejs=require('ejs');
const Template=require('./../lib/template.js');
const _=require('./../../locales/index.js');

router.get('/',(req,res)=>{
    if(req.logined){
        res.redirect("/");
        return;
    }
    ejs.renderFile("./src/templates/login.html",{_: req.body._},(err,HTML)=>{
        res.send(Template({title: `${req.body._('login')}`,
                           header: `<script src="/file/scripts/login.js"></script>`,
                           user: User.userdataByReq(req).name,
                           startTime: req.body.startTime,
                           onlogin: true,
                           _: req.body._
                          },HTML));
    });
});
router.post('/try',(req,res)=>{
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

module.exports=router;