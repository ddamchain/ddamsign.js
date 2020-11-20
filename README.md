# ddamsign.js

Pure node.js client for DDAM.
Support sign, serialization, etc.

# Install
    npm install ddamsign.js --save

# Usage

## Key gen

    const Signer = require('ddamsign.js');
    const signer = new Signer();
    let key = signer.genKey();

## Address

    let privateKey = '0xf5e4c655df9b6618781d4a04b645209c2e468391d72b145ff0d2f3fee155e399';
    signer.getAddressFromPrivateKey(privateKey);

## Sign
### Sign transaction

    let tx={target:'DD7e7e1b322d0649000976b469561ed8a44501ce5094662e1befa61f061b991752',value:new BigNumber('10000000000'),gas:3000,gasprice:500,nonce:15,type:0};
    let h=signer.genTxHash(tx);
    let s=signer.sign(h, '0xf241759f4e85b2188314c4636e88b8b8076606b53ebe9817bbe1b2379b930ca6');
    tx.sign=s;

### Sign recover

    let sd = signer.hexToSign(s)
    signer.recoverAddress(signer.genTxHash(tx),sd) ,'want',signer.getAddressFromPrivateKey('0xf5e4c655df9b6618781d4a04b645209c2e468391d72b145ff0d2f3fee155e399')


## Serialize Transaction

    let stx = signer.serializeTX(tx);
    //deserialization just utilize JSON.parse
    let txObj = JSON.parse(stx);
