import { NextRequest, NextResponse } from 'next/server'; // Importa tipos e helpers para rotas do Next.js
import axios from 'axios'; // Importa o axios para fazer requisições HTTP

export async function POST(request: NextRequest) { // Define a função assíncrona para lidar com requisições POST
  try {
    const { hashPrefix } = await request.json(); // Extrai o campo 'hashPrefix' do corpo da requisição

    // Valida se o hashPrefix existe, é uma string e tem exatamente 5 caracteres
    if (!hashPrefix || typeof hashPrefix !== 'string' || hashPrefix.length !== 5) {
      return NextResponse.json({ error: 'Prefixo de hash inválido.' }, { status: 400 }); // Retorna erro 400 se inválido
    }

    const hibpApiUrl = `https://api.pwnedpasswords.com/range/${hashPrefix}`; // Monta a URL da API do HIBP com o prefixo
    const response = await axios.get(hibpApiUrl); // Faz requisição GET para a API do HIBP
    
    return NextResponse.json({ hashes: response.data }); // Retorna os hashes recebidos da API como JSON

  } catch (error) {
    console.error("Erro ao verificar a API do HIBP:", error); // Loga o erro no console
    // Se o erro for 404 da API externa, retorna hashes vazio
    if (axios.isAxiosError(error) && error.response?.status === 404) {
        return NextResponse.json({ hashes: '' });
    }

    // Para outros erros, retorna erro 500
    return NextResponse.json({ error: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}