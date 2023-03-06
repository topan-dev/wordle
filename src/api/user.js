const express=require('express'),
      router=express.Router();

const User=require("./../model/user.js");
const ejs=require('ejs');
const Template=require('./../lib/template.js');
const _=require('./../../locales/index.js');

router.all('*',(req,res,next)=>{
    req.body.uid=Number(req.baseUrl.substr(6));
    req.body.userdata=User.userdataByUID(req.body.uid);
    if(req.body.userdata==User.nulluserdata){
        res.sendStatus(404);
        return;
    }
    next();
});
router.get('/headimage',(req,res)=>{
    var data=req.body.userdata.headimage;
    if(data.type=='default')
        res.sendFile("data/headimages/default.png",{root:process.cwd()},(err)=>{});
    if(data.type=="upload")
        res.sendFile(`data/headimages/${data.filename}`,{root:process.cwd()},(err)=>{});
});

module.exports=router;