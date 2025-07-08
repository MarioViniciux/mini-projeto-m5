import { sha1 } from 'crypto-hash'; // Importa função para gerar hash SHA-1

export async function checkPwnedPassword(password: string): Promise<{ isPwned: boolean; count: number }> { // Função para checar se a senha foi vazada
  try {
    const hash = (await sha1(password)).toUpperCase(); // Gera hash SHA-1 da senha e converte para maiúsculas
    const hashPrefix = hash.substring(0, 5); // Pega os 5 primeiros caracteres do hash
    const hashSuffix = hash.substring(5); // Pega o restante do hash

    const response = await fetch('/api/pwned', { // Faz requisição para a API local passando o prefixo do hash
      method: 'POST', // Método POST
      headers: {
        'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
      },
      body: JSON.stringify({ hashPrefix }), // Envia o prefixo do hash no corpo da requisição
    });

    if (!response.ok) { // Se a resposta não for OK
      throw new Error('Falha ao se comunicar com a API de verificação.'); // Lança erro
    }

    const { hashes } = await response.json(); // Extrai os hashes retornados da API
    
    const lines = hashes.split('\n'); // Separa cada linha (cada hash+contagem)
    for (const line of lines) { // Para cada linha retornada
      const [suffix, countStr] = line.split(':'); // Separa o sufixo do hash e a contagem
      if (suffix === hashSuffix) { // Se o sufixo bate com o da senha
        return { isPwned: true, count: parseInt(countStr, 10) }; // Retorna que a senha foi vazada e quantas vezes
      }
    }

    return { isPwned: false, count: 0 }; // Se não encontrou, retorna que não foi vazada

  } catch (error) {
    console.error("Erro ao verificar senha vazada:", error); // Loga erro no console
    return { isPwned: false, count: 0 }; // Retorna que não foi vazada em caso de erro
  }
}