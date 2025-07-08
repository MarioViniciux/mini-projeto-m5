'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createPassword } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { generateSecurePassword } from '@/lib/password-generator';
import { Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { checkPwnedPassword } from '@/lib/pwned-checker';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400">
      {pending ? 'Salvando...' : 'Salvar Senha'}
    </button>
  );
}

export default function AddPasswordForm({ closeModal }: { closeModal: () => void }) {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const initialState: { error?: string; message?: string } = {};
  const [state, dispatch] = useActionState(createPassword, initialState);
  const [isCheckingPwned, setIsCheckingPwned] = useState(false);
  const [pwnedResult, setPwnedResult] = useState<{ isPwned: boolean; count: number } | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handlePwnedCheck = async () => {
    if (!password) return;
    setIsCheckingPwned(true);
    setPwnedResult(null); 
    const result = await checkPwnedPassword(password);
    setPwnedResult(result);
    setIsCheckingPwned(false);
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    if (passwordInputRef.current) {
      passwordInputRef.current.value = newPassword;
    }
  };
  
  useEffect(() => {
    if (state?.message) {
      router.refresh();
      closeModal();
    }
  }, [state, closeModal, router]);

  return (
    <form ref={formRef} action={dispatch} className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Adicionar Nova Senha</h2>
      
      <div>
        <input 
          name="service" 
          placeholder="Nome do Serviço (ex: Gmail)" 
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>
      
      <div>
        <input 
          name="username" 
          placeholder="Usuário (opcional)" 
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>
      
      <div>
        <input 
          name="email" 
          type="email" 
          placeholder="Email (opcional)" 
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div className="relative">
        <input 
          ref={passwordInputRef}
          name="password" 
          type="text"
          placeholder="Senha" 
          className="w-full p-3 pr-20 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          onChange={(e) => {
            setPassword(e.target.value);
            setPwnedResult(null);
          }}
        />

        <button 
          type="button" 
          onClick={handleGeneratePassword}
          className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center space-x-2 text-xs bg-slate-200 dark:bg-slate-700 p-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
          title="Gerar senha segura"
        >
          <Sparkles size={16} />
          <span>Gerar</span>
        </button>
      </div>

      <PasswordStrengthMeter password={password} />
        <div className="mt-2">
          <button
            type="button"
            onClick={handlePwnedCheck}
            disabled={!password || isCheckingPwned}
            className="w-full text-sm p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingPwned ? 'Verificando...' : 'Verificar se a senha vazou'}
          </button>

          {pwnedResult && !isCheckingPwned && (
          <div className={`mt-2 p-2 rounded-lg text-sm flex items-center space-x-2 ${
            pwnedResult.isPwned ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
          }`}>
            {pwnedResult.isPwned ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
            <span>
              {pwnedResult.isPwned
                ? `Esta senha foi encontrada em ${pwnedResult.count.toLocaleString('pt-BR')} vazamentos!`
                : 'Esta senha não foi encontrada em vazamentos conhecidos.'}
            </span>
          </div>
          )}
        </div>

      <div>
        <input 
          name="tags" 
          placeholder="Tags (separadas por vírgula)" 
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div>
        <textarea 
          name="notes" 
          placeholder="Anotações (opcional)" 
          rows={3} 
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {state?.error && <p className="text-red-500 text-center">{state.error}</p>}
      
      <SubmitButton />
    </form>
  );
}