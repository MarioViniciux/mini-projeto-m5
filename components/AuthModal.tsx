import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  mode: 'login' | 'register';
  setMode: Dispatch<SetStateAction<'login' | 'register'>>;
}

export default function AuthModal({ isOpen, setIsOpen, mode, setMode }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
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
            {mode === 'login' ? (
              <LoginForm setMode={setMode} />
            ) : (
              <RegisterForm setMode={setMode} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}