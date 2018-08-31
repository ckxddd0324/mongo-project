//SHA56
const { SHA256 } = require('crypto-js');

// let message = 'I am user number 1';
// let hash = SHA256(message).toString();
// let hash2 = SHA256(message).toString();

// console.log(message);
// console.log(hash);
// console.log(hash2);

// let data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id= 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash= SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash){
//     console.log('data was not changed');
// }else{
//     console.log('data was changed')
// }

const jwt = require('jsonwebtoken');

let data = {
    id: 10
};

let token = jwt.sign(data, '123abc');
//jwt.verify

console.log(token);
var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded)