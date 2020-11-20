
//console.log('eth-lib:',eth_lib);
//console.log('Signer:',Signer);
const Signer = require('./index');
const BigNumber = require('bignumber.js');

const signer = new Signer();

console.log('#校验地址');
console.log("DDcec506e893f59e1e9a0f82fd20f8e54f47b5fc826800fdca93df217fe21f7fb6 is valid: %s", signer.isAddress("DDcec506e893f59e1e9a0f82fd20f8e54f47b5fc826800fdca93df217fe21f7fb6"));
console.log("DDfb6916095ca1df60bb79ce92ce3ea74c37c5d359 is valid: %s", signer.isAddress("DDfb6916095ca1df60bb79ce92ce3ea74c37c5d359"));
console.log("0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359 is valid: %s", signer.isAddress("0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"));

console.log('\n#生成目标账户');

//ECKeyPair keyPair = Signer.genKeyPair();
//String target = Signer.getAddress(keyPair);

let key = signer.genKey();


console.log("[转账目标账户] privateKey: %s, address: %s", key.privateKey, key.address);
//0xf241759f4e85b2188314c4636e88b8b8076606b53ebe9817bbe1b2379b930ca6
//console.log('[GetAddressFromSK] want:DD7c7c0b72665ad5af83f6ef63680f0695b99d138122fed0eb5edd9c1a2056c10a, got:', signer.getAddressFromPK('0xf241759f4e85b2188314c4636e88b8b8076606b53ebe9817bbe1b2379b930ca6'));
//1a04f47458984b43ba9223df38a54ad169e1e899259d340cb5bf0c1b7fbfdd770de6c30213deffd75815a93126393735192fb341430e0ae5eded1a4af3fb831d
console.log('[GetAddressFromPublicKey] want:DD7c7c0b72665ad5af83f6ef63680f0695b99d138122fed0eb5edd9c1a2056c10a, got:', signer.getAddressFromPublicKey('0x1a04f47458984b43ba9223df38a54ad169e1e899259d340cb5bf0c1b7fbfdd770de6c30213deffd75815a93126393735192fb341430e0ae5eded1a4af3fb831d'));
console.log('[GetAddressFromPrivateKey] want:DD7c7c0b72665ad5af83f6ef63680f0695b99d138122fed0eb5edd9c1a2056c10a, got:',signer.getAddressFromPrivateKey('0xf241759f4e85b2188314c4636e88b8b8076606b53ebe9817bbe1b2379b930ca6'));
console.log('[GetAddressFromPrivateKey] want:DD05e2eaf6e96b1ba6b97564f28d5a868044db9bf8804e40e4b00f6142549ae83e, got:',signer.getAddressFromPrivateKey('0x8f5c940e0ddb8473f5c9ad11a9b5d0b174009676d603638bc5e2f18971a34e3f'));

console.log('\n#签名');
/*
 tx.setTarget(target);
        tx.setValue(new BigInteger("1000000000"));
        tx.setGasLimit(BigInteger.valueOf(3000));
        tx.setGasPrice(BigInteger.valueOf(500));
        tx.setNonce(BigInteger.valueOf(nonce));
        tx.setType((byte) 0);
        tx.setSign(Signer.sign(src, tx.genHash()));
*/

let tx={target:'DD7e7e1b322d0649000976b469561ed8a44501ce5094662e1befa61f061b991752',value:new BigNumber('10000000000'),gas:3000,gasprice:500,nonce:15,type:0};
//tx.sign=signer.sign(src,tx);
let h=signer.genTxHash(tx);
console.log('Hash result:',h);

let s=signer.sign(h, '0xf241759f4e85b2188314c4636e88b8b8076606b53ebe9817bbe1b2379b930ca6');
console.log('sign:',s);
tx.sign=s;
let sd = signer.hexToSign(s)
console.log('signatureData:',sd);
console.log('recover address:',signer.recoverAddress(signer.genTxHash(tx),sd) ,'want',signer.getAddressFromPrivateKey('0xf241759f4e85b2188314c4636e88b8b8076606b53ebe9817bbe1b2379b930ca6'));

console.log('\n#序列化');
let stx = signer.serializeTX(tx);
console.log('[serialized tx]',stx);
console.log('[deserialize tx]',JSON.parse(stx))


let decTx = JSON.parse("{\"target\": \"DD51a7b5a21cce0009e830a9551e3beded07f183b3f4c38e89d0471c4d4764f264\",\"value\": 1000000000,\"nonce\": 15,\"gas\":3000,\"gasprice\":500,\"tx_type\":0,\"data\": null,\"sign\": \"0xe13bbdd0a785080acd66dc8527554f9a3d3b076917ed2159eda23d08a4d7436265063515ad9548e548120ebddd38e5e182a7f9cc040b0a1f5e034888259258c200\"}");
console.log('UnserializeTX and recover address:',signer.recoverAddress(signer.genTxHash(decTx), signer.hexToSign(decTx.sign)) ,'want',signer.getAddressFromPrivateKey('0xf241759f4e85b2188314c4636e88b8b8076606b53ebe9817bbe1b2379b930ca6'));
