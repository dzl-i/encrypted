// Generate RSA Key Pair
export const generateKeyPair = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return keyPair;
};

// Export the public key as a base64 string
export const exportPublicKey = async (publicKey: CryptoKey) => {
  const exportedPublicKey = await window.crypto.subtle.exportKey("spki", publicKey);
  const exportedKeyBuffer = new Uint8Array(exportedPublicKey);
  const exportedKeyArray = Array.from(exportedKeyBuffer);
  const exportedKeyBase64 = btoa(String.fromCharCode(...exportedKeyArray));

  return exportedKeyBase64;
};

// Import the public key from a base64 string
export const importPublicKey = async (exportedKeyBase64: string) => {
  const exportedKeyArray = new Uint8Array(atob(exportedKeyBase64).split('').map(char => char.charCodeAt(0)));
  const importedKey = await window.crypto.subtle.importKey(
    "spki",
    exportedKeyArray.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );

  return importedKey;
};

// Function to generate an AES key
export const generateAESKey = async () => {
  const aesKey = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  return aesKey;
};

// Encrypt an AES key with an RSA public key
export const encryptAndExportAESKey = async (aesKey, publicKey) => {
  // Import the RSA public key
  const importedPublicKey = await importPublicKey(publicKey);

  // Export the AES key as raw data
  const exportedAESKey = await window.crypto.subtle.exportKey("raw", aesKey);

  // Encrypt the exported AES key with the RSA public key
  const encryptedKey = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    importedPublicKey,
    exportedAESKey
  );

  // Convert the encrypted key to a Base64 string
  const base64EncryptedKey = arrayBufferToBase64(encryptedKey);

  return base64EncryptedKey;
}

// Import the encrypted AES key back into its original state
export const importEncryptedAESKey = async (base64EncryptedKey, rsaPrivateKey) => {
  // Convert the Base64 string back to a buffer
  const encryptedKeyBuffer = new Uint8Array(atob(base64EncryptedKey).split("").map(char => char.charCodeAt(0)));

  // Import the RSA private key into a format usable by the Web Crypto API
  const importedPrivateKey = await window.crypto.subtle.importKey(
    "jwk", // Assuming the RSA private key is in JWK format
    rsaPrivateKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    false,
    ["decrypt"]
  );

  // Decrypt the AES key
  const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP"
    },
    importedPrivateKey,
    encryptedKeyBuffer
  );

  // Import the decrypted key back into the AES format
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    decryptedKeyBuffer,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  return aesKey;
}

// Convert the encrypted key to a Base64 string
const arrayBufferToBase64 = async (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

// Convert a Base64 string to an ArrayBuffer
const base64ToArrayBuffer = async (base64) => {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }

  return bytes.buffer;
}
