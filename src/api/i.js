const express=require('express'),
      router=express.Router();
const ejs=require('ejs');
const fs=require('fs');

const User=require("./../model/user.js");
const Template=require('./../lib/template.js');
const _=require('./../../locales/index.js');

const validators=require('./../lib/validator.js');

router.all('*',(req,res,next)=>{
    if(!req.logined)res.redirect("/login");
    else next();
});
router.get('/',(req,res)=>{
    res.redirect(`/user/${req.uid}`);
});
router.get('/settings',(req,res)=>{
    ejs.renderFile("./src/templates/i_settings.html",{_: req.body._, uid: req.uid},(err,HTML)=>{
        res.send(Template({title: `${req.body._('settings')}`,
                           header: ``,
                           user: User.userdataByReq(req).name,
                           startTime: req.body.startTime,
                           onsettings: true,
                           _: req.body._
                          },HTML));
    });
});
router.post('/changepassword',(req,res)=>{
    if(req.body.new!=req.body.repeat){
        res.status(200).json({error: req.body._('two_passwords_are_diffrent')});
        return;
    }
    if(!User.checkloginByPassword(req.body.old,User.userdataByReq(req).name)){
        res.status(200).json({error: req.body._('password_error')});
        return;
    }
    if(!validators.password(req.body.new)){
        res.status(200).json({error: req.body._('password_validator_failed')});
        return;
    }
    var newchecker=User.encode(User.Encode(req.body.new,req.uid));
    var datas=require('./../../data/main.json');
    datas.users[User.idByUID(req.uid)].checker=newchecker;
    fs.writeFileSync('data/main.json',JSON.stringify(datas));
    res.status(200).json({message:req.body._('password_change_success')});
});
router.get('/headimage',(req,res)=>{
    res.redirect(`/user/${req.uid}/headimage`);
});

module.exports=router;