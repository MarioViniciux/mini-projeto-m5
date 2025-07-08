'use client' // Indica que este componente é renderizado no cliente (Client Component)

import { useState } from 'react'; // Importa o hook useState do React para gerenciar estado
import Head from 'next/head'; // Importa o componente Head do Next.js para manipular o <head> da página
import { LockKeyhole } from 'lucide-react'; // Importa o ícone LockKeyhole da biblioteca lucide-react
import { ThemeSwitcher } from '@/components/ThemeSwitcher'; // Importa o componente ThemeSwitcher para alternar temas
import AuthModal from '@/components/AuthModal'; // Importa o componente AuthModal para autenticação

export default function Home() {
    const [modalOpen, setModalOpen] = useState(false); // Estado para controlar se o modal está aberto
    const [modalMode, setModalMode] = useState<'login' | 'register'>('login'); // Estado para controlar o modo do modal (login ou register)

    const openModal = (mode: 'login' | 'register') => { // Função para abrir o modal no modo especificado
        setModalMode(mode); // Define o modo do modal
        setModalOpen(true); // Abre o modal
    }

    return (
        <>
            <Head>
                <title>Password Manager</title>
                <meta name='description' content='Tela inicial'/>
            </Head>

            <AuthModal 
                isOpen={modalOpen} // Controla se o modal está aberto
                setIsOpen={setModalOpen} // Função para alterar o estado de abertura do modal
                mode={modalMode} // Define o modo do modal (login ou register)
                setMode={setModalMode} // Função para alterar o modo do modal
            />

            <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200'>
                {/* Container principal com estilos para fundo, cor do texto e layout flexível */}
                <header className='w-full p-4 border-b border-slate-200 dark:border-slate-800'>
                    {/* Cabeçalho com borda inferior e padding */}
                    <nav className='max-w-6xl mx-auto flex justify-between items-center'>
                        {/* Barra de navegação centralizada e espaçada */}
                        <div className='flex items-center space-x-2'>
                            {/* Logo e nome do app */}
                            <LockKeyhole className="text-blue-600" size={32}/>
                            <span className='font-bold text-xl'>Password Manager</span>
                        </div>
                        <div className='flex items-center space-x-4'>
                            {/* Botões de ação no cabeçalho */}
                            <ThemeSwitcher /> {/* Componente para alternar tema claro/escuro */}
                            <button className='hidden sm:block font-medium hover:text-blue-600 transition-colors'>
                                {/* Botão "Sobre" visível apenas em telas médias para cima */}
                                <a href="https://github.com/MarioViniciux/mini_projeto_m4/tree/main" target='_blank'>Sobre</a>
                            </button>
                            <button onClick={() => openModal('login')} className='font-medium hover:text-blue-600 hoveR:cursor-pointer transition-colors'>Login</button> {/* Botão para abrir modal de login */}
                            <button onClick={() => openModal('register')} className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:cursor-pointer transition-colors'>Register</button> {/* Botão para abrir modal de registro */}
                        </div>
                    </nav>
                </header>

                <main className='flex-grow flex flex-col items-center justify-center text-center p-8'>
                    {/* Conteúdo principal centralizado vertical e horizontalmente */}
                    <h1 className='text-5xl md:text-7xl font-extrabold bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500'>Segurança e Simplicidade</h1>
                    {/* Título principal com gradiente */}
                    <p className='mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400'>
                        Gerencie suas senhas com uma API robusta e uma interface intuitiva. Foque no que importa, nós cuidamos do resto.
                    </p> {/* Descrição da aplicação */}
                </main>
            </div>
        </>
    )
}