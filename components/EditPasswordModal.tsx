'use client';

import { AnimatePresence, motion } from 'framer-motion';
import EditPasswordForm from './EditPasswordForm';

interface Password {
  id: number;
  service: string;
  password?: string;
}

interface EditPasswordModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  password: Password | null;
}

export default function EditPasswordModal({ isOpen, setIsOpen, password }: EditPasswordModalProps) {
  if (!password) return null;

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
            <EditPasswordForm password={password} closeModal={() => setIsOpen(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}