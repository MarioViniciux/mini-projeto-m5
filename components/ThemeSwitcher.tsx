'use client' // Indica que este componente é um Client Component do Next.js

import { useTheme } from 'next-themes'; // Importa hook para manipular tema (claro/escuro)
import { Sun, Moon } from 'lucide-react'; // Importa ícones de sol e lua
import { useEffect, useState } from 'react'; // Importa hooks do React

export const ThemeSwitcher = () => { // Componente para alternar tema
    const [mounted, setMounted] = useState(false); // Estado para saber se o componente foi montado
    const { theme, setTheme } = useTheme(); // Obtém o tema atual e função para alterar

    useEffect(() => setMounted(true), []); // Marca como montado após renderização

    if (!mounted) return null; // Evita problemas de hidratação, só renderiza após montagem

    return (
        <div className='flex items-center space-x-2 rounded-full bg-slate-200 dark:bg-slate-700 p-1'> {/* Container com estilos */}
            <button
                onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))} // Alterna entre claro e escuro
                className='p-2 rounded-full bg-slate-200 dark:bg-slate-800' // Estilos do botão
                aria-label='Mudar tema' // Acessibilidade
            >
                {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>} 
            </button>
        </div>
    )
}