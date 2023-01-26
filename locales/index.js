const yaml=require('js-yaml');
const fs=require('fs');

var langs=['en','zh','ko'];
var datas={};

langs.forEach((lang)=>{
    datas[lang]=yaml.load(fs.readFileSync(`./locales/${lang}.yaml`,'utf8'));
});

function main(lang,key){
    if(datas[lang][key])return datas[lang][key];
    if(datas[langs[0]][key])return datas[langs[0]][key];
    return `[${key}]`;
}

module.exports={
    en: (key)=>{return main('en',key)},
    zh: (key)=>{return main('zh',key)},
    ko: (key)=>{return main('ko',key)}
};