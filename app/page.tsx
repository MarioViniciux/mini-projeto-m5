'use client'

import { useState } from 'react';
import Head from 'next/head';
import { LockKeyhole } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import AuthModal from '@/components/AuthModal';

export default function Home() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'login' | 'register'>('login');

    const openModal = (mode: 'login' | 'register') => {
        setModalMode(mode);
        setModalOpen(true);
    }

    return (
        <>
            <Head>
                <title>Password Manager</title>
                <meta name='description' content='Tela inicial'/>
            </Head>

            <AuthModal 
                isOpen={modalOpen}
                setIsOpen={setModalOpen}
                mode={modalMode}
                setMode={setModalMode}
            />

            <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200'>
                <header className='w-full p-4 border-b border-slate-200 dark:border-slate-800'>
                    <nav className='max-w-6xl mx-auto flex justify-between items-center'>
                        <div className='flex items-center space-x-2'>
                            <LockKeyhole className="text-blue-600" size={32}/>
                            <span className='font-bold text-xl'>Password Manager</span>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <ThemeSwitcher />
                            <button className='hidden sm:block font-medium hover:text-blue-600 transition-colors'>
                                <a href="https://github.com/MarioViniciux/mini_projeto_m4/tree/main" target='_blank'>Sobre</a>
                            </button>
                            <button onClick={() => openModal('login')} className='font-medium hover:text-blue-600 hoveR:cursor-pointer transition-colors'>Login</button>
                            <button onClick={() => openModal('register')} className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:cursor-pointer transition-colors'>Register</button>
                        </div>
                    </nav>
                </header>

                <main className='flex-grow flex flex-col items-center justify-center text-center p-8'>
                    <h1 className='text-5xl md:text-7xl font-extrabold bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500'>Segurança e Simplicidade</h1>
                    <p className='mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400'>
                        Gerencie suas senhas com uma API robusta e uma interface intuitiva. Foque no que importa, nós cuidamos do resto.
                    </p>
                </main>
            </div>
        </>
    )
}