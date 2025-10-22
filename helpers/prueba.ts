import * as crypto from 'crypto';

const secretKey = "lxnc/1lqQOdaRD0UBa585w==";
const secretSalt = "DOKX890!FM1";

export function encrypt(plainText: string): string | null {
    try {
        // Convertir la clave y salt de base64 a buffers
        const keyBuffer = Buffer.from(secretKey, 'base64');
        const saltBuffer = Buffer.from(secretSalt, 'base64');
        
        // Derivar la clave usando PBKDF2 (equivalente a Rfc2898DeriveBytes)
        const derivedKey = crypto.pbkdf2Sync(keyBuffer, saltBuffer, 10000, 48, 'sha1');
        
        // Extraer key (32 bytes) y IV (16 bytes)
        const key = derivedKey.slice(0, 32);
        const iv = derivedKey.slice(32, 48);
        
        // Crear cipher
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        
        // Cifrar el texto
        let encrypted = cipher.update(plainText, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        
        return encrypted;
    } catch (ex) {
        console.error((ex as Error).message);
        return null;
    }
}

export function decrypt(cipherText: string): string | null {
    try {
        // Convertir la clave y salt de base64 a buffers
        const keyBuffer = Buffer.from(secretKey, 'base64');
        const saltBuffer = Buffer.from(secretSalt, 'base64');
        
        // Derivar la clave usando PBKDF2
        const derivedKey = crypto.pbkdf2Sync(keyBuffer, saltBuffer, 10000, 48, 'sha1');
        
        // Extraer key (32 bytes) y IV (16 bytes)
        const key = derivedKey.slice(0, 32);
        const iv = derivedKey.slice(32, 48);
        
        // Crear decipher
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        
        // Descifrar el texto
        let decrypted = decipher.update(cipherText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (ex) {
        console.error((ex as Error).message);
        return null;
    }
}

// Ejemplo de uso:
const encrypted = encrypt("Texto secreto");
console.log(encrypted);

const decrypted = decrypt(encrypted!);
console.log(decrypted);