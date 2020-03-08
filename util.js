module.exports={
    int2Bytes:(int)=>{
        let buf= Buffer.alloc(4);
        buf.writeInt32BE(int);
        return buf;
    },
    //with left trim leading natively
    BigNumber2Bytes:(bn)=>{
        let bnstr=bn.toString(16);
        if(bnstr.length %2 ==1)bnstr='0'+bnstr;
        let buf = Buffer.from(bnstr,'hex');
        return buf;
    },
    //remove buffer left 00
    trimLeading:(buf)=>{
        let i=0;
        while(buf[i]==0)i++;
        return buf.slice(i);
    },
    //prefix 4 bytes length
    encode:(buf)=>{
        let result = Buffer.alloc(4);
        result.writeInt32BE(buf.length);
        
        return Buffer.concat([result,buf],4+buf.length);
    },
    //fill in an array length long , right align.
    toBytesPadded:(str, length = 32)=>{
        str=str.startsWith('DD')?str.substring(2):str;
        str = ('0000000000000000000000000000000000000000000000000000000000000000'+str).slice(-64);
        let src=Buffer.from(str,'hex');
        let buf = Buffer.alloc(length);
        let result = Buffer.concat([buf,src],length+src.length);
        let r = result.slice(length*-1);
        return r;
        //return Buffer.concat([buf,src],4+length);
    }
}
