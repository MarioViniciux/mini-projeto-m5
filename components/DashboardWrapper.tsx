'use client'; // Indica que este componente é um Client Component do Next.js

import { useState } from 'react'; // Importa o hook useState do React
import DashboardClientContent from './DashboardClientContent'; // Importa o conteúdo do dashboard (client)
import DashboardHeader from './DashboardHeader'; // Importa o cabeçalho do dashboard

interface Password { // Define a interface Password para tipar os dados das senhas
  id: number; // ID da senha
  service: string; // Nome do serviço
  username?: string; // Nome de usuário (opcional)
  email?: string; // Email (opcional)
  notes?: string; // Notas (opcional)
  tags?: { id: number; name: string }[]; // Lista de tags (opcional)
}

export default function DashboardWrapper({ initialPasswords }: { initialPasswords: Password[] }) { // Componente principal do wrapper do dashboard
  const [resetKey, setResetKey] = useState(0); // Estado para forçar o reset do conteúdo

  const handleReset = () => { // Função chamada para resetar o conteúdo do dashboard
    setResetKey(prevKey => prevKey + 1); // Incrementa a chave, forçando o remount do componente filho
  };

  return (
    <>
      <DashboardHeader onReset={handleReset} /> {/* Cabeçalho do dashboard, recebe função de reset */}
      <main className="max-w-4xl mx-auto p-4 md:p-8"> {/* Área principal centralizada e com espaçamento */}
        <DashboardClientContent key={resetKey} initialPasswords={initialPasswords} /> {/* Conteúdo do dashboard, reinicia ao mudar a chave */}
      </main>
    </>
  );
}