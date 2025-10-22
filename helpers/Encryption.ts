import * as crypto from "crypto";
import * as forge from "node-forge";

export class Encryption{
    private static _secretSalt: string = "dCdV1UI+09PYTadlbOOIIg==";
    private static _instance: Encryption;

    private constructor() {}

    public static getInstance(): Encryption{
        if(Encryption._instance != null || Encryption._instance != undefined) return Encryption._instance;

        Encryption._instance = new Encryption();

        return Encryption._instance;
    }

    private get secretSalt(){
        return Encryption._secretSalt;
    }

    private get instance(){
        return Encryption._instance;
    }

    public encrypt(word: string, secretKey: string): string | null{
        try{
            const keyBuffer = Buffer.from(secretKey, 'base64');
            const saltBuffer = Buffer.from(this.secretSalt, 'base64');

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

    public decrypt(word: string, secretKey: string){
        try{
            const keyBuffer = Buffer.from(secretKey, 'base64');
            const saltBuffer = Buffer.from(this.secretSalt, 'base64');

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

