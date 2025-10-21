export class Encryption{
    static _instance;
    
    constructor() { }

    static getInstance(){
        if(Encryption._instance != null || Encryption._instance != undefined) return Encryption._instance;

        Encryption._instance = new Encryption();

        return Encryption._instance;
    }

    arrayBufferToHex(buffer){
        return[...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    hexToArrayBuffer(hex){
        const bytes = new Uint8Array(hex.length / 2);
        for(let i = 0; i < hex.length; i+=2){
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes.buffer;
    }

    async getCryptoKey(password){
        const encoder = new TextEncoder();
        const keyMaterial = encoder.encode(password);
        return crypto.subtle.importKey(
            'raw',
            keyMaterial,
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );
    }

    async deriveKey(password, salt){
        const keyMaterial = await this.getCryptoKey(password);
        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async encrypt(word, password){
        const encoder = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.deriveKey(password, salt);

        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encoder.encode(word)
        );

        return {
            cipherText: this.arrayBufferToHex(encrypted),
            iv: this.arrayBufferToHex(iv),
            salt: this.arrayBufferToHex(salt)
        };
    }

    async decrypt(word, password){
        const { cipherText, iv, salt } = word;
        const key = await this.deriveKey(password, this.hexToArrayBuffer(salt));

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: this.hexToArrayBuffer(iv) },
            key,
            this.hexToArrayBuffer(cipherText)
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    }
}


// console.log(await obj.encrypt("HOLAQTAL", "FQMC#A#NGG890"));

(async () => {
    let obj = Encryption.getInstance();
    const text = 'MySecretAPIKey123456';
    const password = 'StrongPassword123!';

    // Encrypt
    const encryptedData = await obj.encrypt(text, password);
    console.log(`Encrypted Data: ${encryptedData.cipherText}`);

    // Decrypt
    const decryptedText = await obj.decrypt(encryptedData, password);
    console.log('Decrypted Text:', decryptedText);
})();

