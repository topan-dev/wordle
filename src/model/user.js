const crypto=require('crypto');
const encode=(str)=>{
    // second time
    const MD5=crypto.createHash('md5');
    const SHA256=crypto.createHash('sha256');
    var md5=MD5.update(str,'utf8').digest('hex');
    var sha256=SHA256.update(str,'utf8').digest('hex');
    return sha256.substr(0,32)+md5+sha256.substr(32);
};
const Encode=(str,uid)=>{
    // first time
    return encode(`wordle_${uid}_${str}`);
}

const nulluserdata={
    uid: null,
    name: null
};

const checkloginByPassword=(password,username)=>{
    var datas=require('../../data/main.json').users;
    var i=0;
    while(i<datas.length&&datas[i].name!=username)i++;
    if(i==datas.length)return null;
    else return encode(Encode(password,datas[i].uid))==datas[i].checker;
};
const checkloginByReq=(req)=>{
    var uid=req.cookies['wordle-uid'],
        cookie=req.cookies['wordle-cookie'];
    if(uid==undefined||cookie==undefined)return false;
    var data=userdataByUID(uid);
    if(data==nulluserdata)return false;
    else return encode(cookie)==data.checker;
};

function idByUID(uid){
    var datas=require('../../data/main.json').users;
    var i=0;
    while(i<datas.length&&datas[i].uid!=uid)i++;
    if(i==datas.length)return -1;
    else return i;
}

function userdataByUID(uid){
    var datas=require('../../data/main.json').users;
    var i=0;
    while(i<datas.length&&datas[i].uid!=uid)i++;
    if(i==datas.length)return nulluserdata;
    else return datas[i];
}
function userdataByName(name){
    var datas=require('../../data/main.json').users;
    var i=0;
    while(i<datas.length&&datas[i].name!=name)i++;
    if(i==datas.length)return nulluserdata;
    else return datas[i];
}
function userdataByReq(req){
    if(!checkloginByReq(req))return nulluserdata;
    return userdataByUID(req.cookies['wordle-uid']);
}

module.exports={encode,
                Encode,
                nulluserdata,
                checkloginByPassword,
                checkloginByReq,
                idByUID,
                userdataByUID,
                userdataByName,
                userdataByReq
               };