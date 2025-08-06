// 将PEM格式的公钥转换为CryptoKey对象
async function importRSAKey(pemKey: string) {
  // 移除PEM头尾和换行符
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = pemKey.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');

  // Base64解码
  const binaryDerString = atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  // 导入密钥
  return await window.crypto.subtle.importKey(
    'spki',
    binaryDer.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  );
}

// 使用RSA公钥加密密码
export async function encryptPassword(password: string, pemPublicKey: string) {
  try {
    // 导入公钥
    const publicKey = await importRSAKey(pemPublicKey);

    // 将密码转换为ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // 加密
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      data
    );

    // 转换为Base64
    const encryptedArray = new Uint8Array(encrypted);
    let binary = '';
    for (let i = 0; i < encryptedArray.byteLength; i++) {
      binary += String.fromCharCode(encryptedArray[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error('加密失败:', error);
    throw new Error('密码加密失败');
  }
}
