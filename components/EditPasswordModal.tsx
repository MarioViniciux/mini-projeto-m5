'use client'; // Indica que este componente é um Client Component do Next.js

import { AnimatePresence, motion } from 'framer-motion'; // Importa componentes para animação
import EditPasswordForm from './EditPasswordForm'; // Importa o formulário de edição de senha

interface Password { // Define a interface Password para tipar os dados das senhas
  id: number; // ID da senha
  service: string; // Nome do serviço
  password?: string; // Senha (opcional)
}

interface EditPasswordModalProps { // Define as props do modal de edição
  isOpen: boolean; // Indica se o modal está aberto
  setIsOpen: (isOpen: boolean) => void; // Função para alterar o estado de abertura do modal
  password: Password | null; // Senha a ser editada (ou null)
}

export default function EditPasswordModal({ isOpen, setIsOpen, password }: EditPasswordModalProps) { // Componente principal do modal de edição
  if (!password) return null; // Se não houver senha selecionada, não renderiza nada

  return (
    <AnimatePresence> {/* Controla a presença animada do modal */}
      {isOpen && ( // Renderiza o modal se isOpen for true
        <motion.div
          initial={{ opacity: 0 }} // Estado inicial da opacidade do fundo
          animate={{ opacity: 1 }} // Estado animado da opacidade do fundo
          exit={{ opacity: 0 }} // Estado ao sair (desmontar)
          onClick={() => setIsOpen(false)} // Fecha o modal ao clicar no fundo
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm cursor-pointer" // Estilos do fundo do modal
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} // Estado inicial do conteúdo (escala e opacidade)
            animate={{ scale: 1, opacity: 1 }} // Estado animado do conteúdo
            exit={{ scale: 0.9, opacity: 0 }} // Estado ao sair do conteúdo
            transition={{ type: 'spring', damping: 25, stiffness: 300 }} // Configuração da animação
            onClick={(e) => e.stopPropagation()} // Impede que o clique no conteúdo feche o modal
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-8 cursor-default" // Estilos do conteúdo do modal
          >
            <EditPasswordForm password={password} closeModal={() => setIsOpen(false)} /> {/* Renderiza o formulário de edição e fecha o modal ao salvar */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}