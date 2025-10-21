import { setUncaughtExceptionCaptureCallback } from "process";

export class Encryption{
    private static _secretSalt: string = "dCdV1UI+09PYTadlbOOIIg==";
    private static _instance: Encryption;

    private constructor() {}

    public static getInstance(): Encryption{
        if(Encryption._instance != null || Encryption._instance != undefined) return Encryption._instance;

        Encryption._instance = new Encryption();

        return Encryption._instance;
    }

    public static async encrypt(word: string, secretKey: string): Promise<string>{
        try{
            const keyBytes = new TextEncoder().encode(secretKey);
            const saltBytes = new TextEncoder().encode(Encryption._secretSalt);

            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(secretKey),
                { name: "PBKDF2" },
                false,
                ["deriveBits"]
            );

            const derivedBits = await crypto.subtle.deriveBits(
                {
                    name: "PBKDF2",
                    salt: new TextEncoder().encode(Encryption._secretSalt),
                    iterations: 10000,
                    hash: "SHA-1"
                },
                keyMaterial,
                48 * 4
            );

            const derivedBytes = new Uint8Array(derivedBits);
            const aesKey = derivedBytes.slice(0,32);
            const iv = derivedBytes.slice(32,48);

            console.log("TAMAÑO DE IV:", iv.length);

            const cryptoKey = await crypto.subtle.importKey(
                "raw",
                aesKey,
                { name: "AES-CBC" },
                false,
                ["encrypt"]
            );

            const encrypted = await crypto.subtle.encrypt(
                { name: "AES-CBC", iv },
                cryptoKey,
                new TextEncoder().encode(word)
            );

            return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}

(async () => {
    const textoOriginal = "Hola mundo desde TypeScript";

    const cifrado = await Encryption.encrypt(textoOriginal, "yiKRn4wrzAMjw98QrlyF3QvFSrL3tudRjCKxGnqTzOM=");
    console.log("Texto encriptado:", cifrado);
})();
