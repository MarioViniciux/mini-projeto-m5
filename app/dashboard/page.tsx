import { cookies } from 'next/headers'; // Importa utilitário para acessar cookies no Next.js
import { redirect } from 'next/navigation'; // Importa função para redirecionamento de rotas no Next.js
import axios from 'axios'; // Importa o axios para fazer requisições HTTP
import DashboardWrapper from '@/components/DashboardWrapper'; // Importa o componente DashboardWrapper

interface Password { // Define a interface Password para tipar os dados das senhas
  id: number; // ID da senha
  service: string; // Nome do serviço
  username?: string; // Nome de usuário (opcional)
  email?: string; // Email (opcional)
  notes?: string; // Notas (opcional)
  tags?: { id: number; name: string }[]; // Lista de tags (opcional)
}

async function getPasswords(token: string) { // Função assíncrona para buscar as senhas do backend
  try {
    const response = await axios.get(`${process.env.URL_BACKEND}/passwords`, { // Faz requisição GET para a API de senhas
      headers: { Authorization: `Bearer ${token}` }, // Envia o token de autenticação no header
    });
    return response.data as Password[]; // Retorna os dados tipados como Password[]
  } catch (error) {
    console.error('Falha ao buscar senhas:', error); // Loga erro no console
    return null; // Retorna null em caso de erro
  }
}

export default async function DashboardPage() { // Função principal da página do dashboard (SSR/SSG)
  const authToken = (await cookies()).get('authToken')?.value; // Busca o token de autenticação nos cookies

  if (!authToken) { // Se não houver token
    redirect('/'); // Redireciona para a página inicial
  }

  const passwords = await getPasswords(authToken); // Busca as senhas usando o token
  
  if (passwords === null) { // Se não conseguiu buscar as senhas (token inválido ou erro)
    (await cookies()).delete('authToken'); // Remove o token dos cookies
    redirect('/'); // Redireciona para a página inicial
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Container principal com estilos para fundo e texto, adaptando ao tema */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Área principal centralizada e com espaçamento */}
        <DashboardWrapper initialPasswords={passwords} /> {/* Renderiza o DashboardWrapper com as senhas iniciais */}
      </main>
    </div>
  );
}