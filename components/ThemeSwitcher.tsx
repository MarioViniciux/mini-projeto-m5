'use client'

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className='flex items-center space-x-2 rounded-full bg-slate-200 dark:bg-slate-700 p-1'>
            <button
                onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
                className='p-2 rounded-full bg-slate-200 dark:bg-slate-800'
                aria-label='Mudar tema'
            >
                {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
        </div>
    )
}