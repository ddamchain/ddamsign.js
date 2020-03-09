/**
 * Created by DDAM tech team
 * First created at 2019.11.10
 * Initiator: EastBlock
 */
const elliptic = require("elliptic");
const {Bytes,Nat,RLP,Hash} = require('eth-lib');
const secp256k1 = new (elliptic.ec)("secp256k1"); // eslint-disable-line
const {keccak256, keccak256s} = Hash;
const { SHA3 } = require('sha3');
const BigNumber = require('bignumber.js');
const crypto = require('crypto');
const Util = require('./util');

class Signer {
    genKey(entropy){
        const innerHex = keccak256(Bytes.concat(Bytes.random(32), entropy || Bytes.random(32)));
        const middleHex = Bytes.concat(Bytes.concat(Bytes.random(32), innerHex), Bytes.random(32));
        const outerHex = keccak256(middleHex);

        return {
            address: this.getAddressFromPrivateKey(outerHex),
            privateKey: outerHex
        }
    }


    genTxHash(tx){

        let buf_target=Util.encode(Util.toBytesPadded(tx.target,32));

        let buf_value = Util.encode(Util.BigNumber2Bytes(tx.value));

        let buf_nonce = Util.encode(Util.trimLeading(Util.int2Bytes(tx.nonce)));

        let buf_gas_limit = Util.encode(Util.trimLeading(Util.int2Bytes(tx.gas)));

        let buf_gas_price = Util.encode(Util.trimLeading(Util.int2Bytes(tx.gasprice)));

        let buf_type = Buffer.from([tx.type]);

        let buf_data;
        if (tx.data) {
            buf_data = Util.encode(Buffer.from(tx.data,'hex'));
        }
        else {
            buf_data = Util.encode(Buffer.alloc(0));
        }


        let len = (buf_target.length+buf_value.length+buf_nonce.length+buf_gas_limit.length+buf_gas_price.length+buf_type.length+buf_data.length);

        let result = Buffer.concat([buf_target,buf_value,buf_nonce,buf_gas_limit,buf_gas_price,buf_type,buf_data],);

        let hash = crypto.createHash('sha256');
        hash.update(result);
        return hash.digest('hex');
    }

    sign(hashStr, privateKey){
        let hashBuf = Buffer.from(hashStr,'hex');

        let buf=privateKey.startsWith('0x')?Buffer.from(privateKey.slice(2),'hex'):Buffer.from(privateKey,'hex');

        let signature= secp256k1.keyFromPrivate(buf).sign(hashBuf, {canonical: true});
        let buf_r = Util.toBytesPadded(signature.r.toString(16),32);


        let buf_s = Util.toBytesPadded(signature.s.toString(16),32);

        let buf_v = Buffer.from([signature.recoveryParam]);

        let ret= Buffer.concat([buf_r,buf_s,buf_v],65);
        return '0x'+ret.toString('hex')
    }
    hexToSign(sign){
        if(sign.startsWith('0x'))sign=sign.slice(2);
        let r = sign.substring(0,64);
        let s = sign.substring(64,128);
        let v = sign.substring(128,130);
        return {r,s,v}
    }

    serializeTX(tx){
       return `"{\\"target\\": \\"${tx.target}\\",\\"value\\": ${tx.value.toString()},\\"nonce\\": ${tx.nonce},\\"gas\\":${tx.gas},\\"gasprice\\":${tx.gasPrice},\\"tx_type\\":${tx.type},\\"data\\": ${tx.data||null},\\"sign\\": \\"${tx.sign}\\"}"`;
    }

    sha3Sum256Digest(buffer){
        let hash = new SHA3(256);
        hash.update(buffer);
        return hash.digest('hex');
    }

    getAddressFromPublicKey(publicKey){
        const buffer = Buffer.from(publicKey.startsWith('0x')?publicKey.slice(2):publicKey,"hex");
        let result=this.sha3Sum256Digest(buffer);
        return 'DD'+result;
    }

    isAddress(addr){
        return /DD[a-fA-F0-9]{64}/.test(addr);
    }

    getAddressFromPrivateKey(privateKey){
        const buffer = Buffer.from(privateKey.slice(2), "hex");
        const ecKey = secp256k1.keyFromPrivate(buffer);
        const publicKey = ecKey.getPublic(false, 'hex').slice(2);
        return this.getAddressFromPublicKey(publicKey);
    }

    recoverAddress(hash, vrs){
        hash=hash.startsWith('0x')?hash.slice(2):hash;
        vrs.v = Number.parseInt(vrs.v,16);
        const ecPublicKey = secp256k1.recoverPubKey(Buffer.from(hash, "hex"), vrs, vrs.v < 2 ? vrs.v : 1 - (vrs.v % 2));
        const publicKey = "0x" + ecPublicKey.encode("hex", false).slice(2);
        return this.getAddressFromPublicKey(publicKey);
    }

}


module.exports = Signer;
