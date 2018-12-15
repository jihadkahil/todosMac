var AES = require('crypto-js/aes');
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
  };


var decrept = jwt.sign(data,'123abc'); 
var decrept2 = jwt.sign(10,'123abc');

console.log(decrept);
console.log(decrept2);

var encrypt = jwt.verify(decrept,'123abc');


