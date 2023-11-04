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

export const exportCryptoKey = async (key) => {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  let binaryString = "";
  const bytes = new Uint8Array(exported);

  for (let i = 0; i < bytes.byteLength; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }

  const base64String = btoa(binaryString);

  return base64String;
};

export const importCryptoKey = async (keyData) => {
  const key = await window.crypto.subtle.importKey(
    "jwk",
    keyData,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );

  return key;
};

export const encryptData = async (key, data) => {
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    key,
    data
  );

  return encrypted;
};
