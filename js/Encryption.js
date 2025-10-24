const crypto = require('crypto');

class Encryption{
    static _secretSalt = "dCdV1UI+09PYTadlbOOIIg==";
    static _instance;

    constructor() {}

    static getInstance(){
        if(Encryption._instance) return Encryption._instance;

        Encryption._instance = new Encryption();

        return Encryption._instance;
    }

    get _secretSalt(){
        return Encryption._secretSalt;
    }

    get _instance(){
        return Encryption._instance;
    }

    encrypt(word, secretKey){
        try{
            const keyBuffer = Buffer.from(secretKey, 'base64');
            const saltBuffer = Buffer.from(this._secretSalt, 'base64');

            const derivedKey = crypto.pbkdf2Sync(keyBuffer, saltBuffer, 10000, 48, 'sha1');

            const key = derivedKey.slice(0,32);
            const iv = derivedKey.slice(32,48);

            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

            let encrypted = cipher.update(word, 'utf8', 'base64');
            encrypted += cipher.final('base64');

            return encrypted;
        } catch(error){
            console.error(error);
            throw error;
        }
    }

    decrypt(word, secretKey){
        try{
            const keyBuffer = Buffer.from(secretKey, 'base64');
            const saltBuffer = Buffer.from(this._secretSalt, 'base64');

            const derivedKey = crypto.pbkdf2Sync(keyBuffer, saltBuffer, 10000, 48, 'sha1');

            const key = derivedKey.slice(0,32);
            const iv = derivedKey.slice(32,48);

            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

            let decrypted = decipher.update(word, 'base64', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch(error){
            console.error(error);
            throw error;
        }
    }
}

module.exports = { Encryption };