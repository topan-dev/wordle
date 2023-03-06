const yaml=require('js-yaml');
const fs=require('fs');

var langs=['en','zh','jp'];
var datas={},selector=``;

langs.forEach((lang)=>{
    datas[lang]=yaml.load(fs.readFileSync(`./locales/${lang}.yaml`,'utf8'));
    if(selector.length>0)selector+=` | `;
    selector+=`<a href="/setlang/${lang}">${datas[lang]['_self']}</a>`;
});

function main(lang,key){
    if(datas[lang][key])return datas[lang][key];
    for(var i=0;i<langs.length;i++)
        if(datas[langs[i]][key])
            return datas[langs[i]][key];
    return `[${key}]`;
}

module.exports={
    en: (key)=>{return main('en',key)},
    zh: (key)=>{return main('zh',key)},
    jp: (key)=>{return main('jp',key)},
    langs: langs,
    selector: selector
};