const crypto=require('crypto');
const Encode=(str)=>{
    const MD5=crypto.createHash('md5');
    const SHA256=crypto.createHash('sha256');
    var md5=MD5.update(str,'utf8').digest('hex');
    var sha256=SHA256.update(str,'utf8').digest('hex');
    return sha256.substr(0,32)+md5+sha256.substr(32);
};

const nulluserdata={
    uid: null,
    name: null
};

const checkloginByPassword=(password,username)=>{
    var datas=require('../../datas/main.json').users;
    var i=0;
    while(i<datas.length&&datas[i].name!=username)i++;
    if(i==datas.length)return null;
    else return Encode(Encode(password))==datas[i].checker;
};

function userdataByReq(req){
    return nulluserdata;
}

module.exports={userdataByReq,
                Encode,
                checkloginByPassword
               };