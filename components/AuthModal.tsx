import { AnimatePresence, motion } from 'framer-motion'; // Importa componentes para animação
import { Dispatch, SetStateAction } from 'react'; // Importa tipos para manipulação de estado
import LoginForm from './LoginForm'; // Importa o formulário de login
import RegisterForm from './RegisterForm'; // Importa o formulário de registro

interface AuthModalProps { // Define as props do modal de autenticação
  isOpen: boolean; // Indica se o modal está aberto
  setIsOpen: Dispatch<SetStateAction<boolean>>; // Função para alterar o estado de abertura do modal
  mode: 'login' | 'register'; // Modo do modal: login ou registro
  setMode: Dispatch<SetStateAction<'login' | 'register'>>; // Função para alterar o modo do modal
}

export default function AuthModal({ isOpen, setIsOpen, mode, setMode }: AuthModalProps) { // Componente principal do modal de autenticação
  return (
    <AnimatePresence> {/* Controla a presença animada do modal */}
      {isOpen && ( // Renderiza o modal se isOpen for true
        <motion.div
          initial={{ opacity: 0 }} // Estado inicial da opacidade
          animate={{ opacity: 1 }} // Estado animado da opacidade
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
            {mode === 'login' ? ( // Se o modo for login
              <LoginForm setMode={setMode} /> // Renderiza o formulário de login
            ) : ( // Senão
              <RegisterForm setMode={setMode} /> // Renderiza o formulário de registro
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}