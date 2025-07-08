import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import DashboardWrapper from '@/components/DashboardWrapper';

interface Password {
  id: number;
  service: string;
  username?: string;
  email?: string;
  notes?: string;
  tags?: { id: number; name: string }[];
}

async function getPasswords(token: string) {
  try {
    const response = await axios.get(`${process.env.URL_BACKEND}/passwords`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as Password[];
  } catch (error) {
    console.error('Falha ao buscar senhas:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const authToken = (await cookies()).get('authToken')?.value;

  if (!authToken) {
    redirect('/');
  }

  const passwords = await getPasswords(authToken);
  
  if (passwords === null) {
    (await
      cookies()).delete('authToken');
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <DashboardWrapper initialPasswords={passwords} />
      </main>
    </div>
  );
}