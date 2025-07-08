import { cookies } from 'next/headers'; // Importa utilitário para acessar cookies no Next.js
import { NextRequest, NextResponse } from 'next/server'; // Importa tipos e helpers para rotas do Next.js
import axios from 'axios'; // Importa o axios para fazer requisições HTTP

export async function GET(
  request: NextRequest, // Objeto da requisição HTTP recebida
  context: { params: Promise<{ id: string }> } // Contexto com os parâmetros da rota (id)
) {

  const { id } = await context.params; // Extrai o parâmetro 'id' da rota
  console.log(`ID recebido: ${id}`); // Loga o ID recebido para debug

  if (!id) { // Verifica se o ID foi fornecido
    return NextResponse.json({ error: 'ID do parâmetro não encontrado' }, { status: 400 }); // Retorna erro 400 se não houver ID
  }

  const token = (await cookies()).get('authToken')?.value; // Busca o token de autenticação nos cookies
  if (!token) { // Verifica se o token existe
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 }); // Retorna erro 401 se não houver token
  }

  try {
    // Faz requisição GET ao backend, passando o token no header Authorization
    const response = await axios.get(`${process.env.URL_BACKEND}/passwords/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data); // Retorna os dados recebidos do backend como resposta JSON
  } catch (error) {
    console.error("Erro ao chamar a API externa:", error); // Loga o erro no console
    return NextResponse.json({ error: 'Falha ao buscar senha' }, { status: 500 }); // Retorna erro 500 em caso de falha
  }
}