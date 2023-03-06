module.exports={
    password: (str)=>/^[\u0020-\u007e]{6,100}$/.test(str) // 6～100 位字母、数字和特殊字符
};