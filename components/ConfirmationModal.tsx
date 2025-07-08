'use client'; // Indica que este componente é um Client Component do Next.js

import { AnimatePresence, motion } from 'framer-motion'; // Importa componentes para animação
import { AlertTriangle } from 'lucide-react'; // Importa ícone de alerta

interface ConfirmationModalProps { // Define as props do modal de confirmação
  isOpen: boolean; // Indica se o modal está aberto
  onClose: () => void; // Função para fechar o modal
  onConfirm: () => void; // Função chamada ao confirmar a ação
  title: string; // Título do modal
  children: React.ReactNode; // Conteúdo do modal (mensagem)
  isConfirming?: boolean; // Indica se está processando a confirmação
}

export default function ConfirmationModal({
  isOpen, // Estado de abertura do modal
  onClose, // Função para fechar
  onConfirm, // Função para confirmar
  title, // Título do modal
  children, // Conteúdo do modal
  isConfirming = false // Estado de confirmação (padrão: false)
}: ConfirmationModalProps) {
  return (
    <AnimatePresence> {/* Controla a presença animada do modal */}
      {isOpen && ( // Renderiza o modal se isOpen for true
        <motion.div
          initial={{ opacity: 0 }} // Estado inicial da opacidade do fundo
          animate={{ opacity: 1 }} // Estado animado da opacidade do fundo
          exit={{ opacity: 0 }} // Estado ao sair (desmontar)
          onClick={onClose} // Fecha o modal ao clicar no fundo
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
            <div className="flex flex-col items-center text-center"> {/* Container centralizado */}
              <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full mb-4"> {/* Fundo do ícone */}
                <AlertTriangle size={32} className="text-red-600 dark:text-red-400" /> {/* Ícone de alerta */}
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3> {/* Título do modal */}
              <div className="text-slate-600 dark:text-slate-400 mb-6">
                {children} {/* Mensagem ou conteúdo do modal */}
              </div>
              <div className="flex w-full space-x-4"> {/* Container dos botões */}
                <button
                  onClick={onClose} // Fecha o modal ao clicar
                  disabled={isConfirming} // Desabilita se estiver confirmando
                  className="flex-1 p-3 rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm} // Chama a função de confirmação
                  disabled={isConfirming} // Desabilita se estiver confirmando
                  className="flex-1 p-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:bg-red-400 flex justify-center items-center"
                >
                  {isConfirming ? ( // Se estiver confirmando, mostra spinner
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Sim, Deletar' // Senão, mostra texto padrão
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}