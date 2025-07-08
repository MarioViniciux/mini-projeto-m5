'use client'; // Indica que este componente é um Client Component do Next.js

import { useRouter } from 'next/navigation'; // Importa hook para navegação do Next.js
import { logoutUser } from '@/lib/actions'; // Importa função para logout do usuário

export default function DashboardHeader({ onReset }: { onReset: () => void }) { // Componente principal do cabeçalho do dashboard
  const router = useRouter(); // Hook para navegação

  const handleResetFilters = () => { // Função para resetar filtros (não utilizada)
    router.refresh(); // Atualiza a página
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm p-4"> {/* Cabeçalho com fundo, sombra e padding */}
      <div className="max-w-4xl mx-auto flex justify-between items-center"> {/* Container centralizado e espaçado */}
        
        <button 
          onClick={onReset}  // Chama função para resetar filtros ao clicar
          className="text-2xl font-bold hover:text-blue-600 transition-colors hover:cursor-pointer"
        >
          Meu Cofre {/* Título do dashboard */}
        </button>
        
        <form action={logoutUser}> {/* Formulário para logout */}
          <button type="submit" className="font-semibold text-red-500 hover:text-red-700 hover:cursor-pointer">
            Sair {/* Botão de sair */}
          </button>
        </form>
      </div>
    </header>
  );
}