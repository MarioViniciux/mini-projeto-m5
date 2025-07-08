'use client';

import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/actions';

export default function DashboardHeader({ onReset }: { onReset: () => void }) {
  const router = useRouter();

  const handleResetFilters = () => {
    router.refresh();
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        
        <button 
          onClick={onReset}  
          className="text-2xl font-bold hover:text-blue-600 transition-colors hover:cursor-pointer"
        >
          Meu Cofre
        </button>
        
        <form action={logoutUser}>
          <button type="submit" className="font-semibold text-red-500 hover:text-red-700 hover:cursor-pointer">
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}