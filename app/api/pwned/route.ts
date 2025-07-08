import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { hashPrefix } = await request.json();

    if (!hashPrefix || typeof hashPrefix !== 'string' || hashPrefix.length !== 5) {
      return NextResponse.json({ error: 'Prefixo de hash inválido.' }, { status: 400 });
    }

    const hibpApiUrl = `https://api.pwnedpasswords.com/range/${hashPrefix}`;
    const response = await axios.get(hibpApiUrl);
    
    return NextResponse.json({ hashes: response.data });

  } catch (error) {
    console.error("Erro ao verificar a API do HIBP:", error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
        return NextResponse.json({ hashes: '' });
    }

    return NextResponse.json({ error: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}