import { sha1 } from 'crypto-hash';

export async function checkPwnedPassword(password: string): Promise<{ isPwned: boolean; count: number }> {
  try {
    const hash = (await sha1(password)).toUpperCase();
    const hashPrefix = hash.substring(0, 5);
    const hashSuffix = hash.substring(5);

    const response = await fetch('/api/pwned', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hashPrefix }),
    });

    if (!response.ok) {
      throw new Error('Falha ao se comunicar com a API de verificação.');
    }

    const { hashes } = await response.json();
    
    const lines = hashes.split('\n');
    for (const line of lines) {
      const [suffix, countStr] = line.split(':');
      if (suffix === hashSuffix) {
        return { isPwned: true, count: parseInt(countStr, 10) };
      }
    }

    return { isPwned: false, count: 0 };

  } catch (error) {
    console.error("Erro ao verificar senha vazada:", error);
    return { isPwned: false, count: 0 };
  }
}