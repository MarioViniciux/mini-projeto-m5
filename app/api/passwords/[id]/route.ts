import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID do parâmetro não encontrado' }, { status: 400 });
  }

  const token = (await cookies()).get('authToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const response = await axios.get(`${process.env.URL_BACKEND}/passwords/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar a API externa:", error);
    return NextResponse.json({ error: 'Falha ao buscar senha' }, { status: 500 });
  }
}