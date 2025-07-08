'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  isConfirming?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  isConfirming = false
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-8 cursor-default"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full mb-4">
                <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <div className="text-slate-600 dark:text-slate-400 mb-6">
                {children}
              </div>
              <div className="flex w-full space-x-4">
                <button
                  onClick={onClose}
                  disabled={isConfirming}
                  className="flex-1 p-3 rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isConfirming}
                  className="flex-1 p-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:bg-red-400 flex justify-center items-center"
                >
                  {isConfirming ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Sim, Deletar'
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