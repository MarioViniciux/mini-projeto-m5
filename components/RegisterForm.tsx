'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { registerUser } from '@/lib/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400">
      {pending ? 'Registrando...' : 'Registrar'}
    </button>
  );
}

export default function RegisterForm({ setMode }: { setMode: (mode: 'login' | 'register') => void }) {
  const initialState = { message: '', success: false };
  const [state, dispatch] = useActionState(registerUser, initialState);

  React.useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => setMode('login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, setMode]);

  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Criar Conta</h2>
        <form action={dispatch} className="space-y-4">
            <div>
                <input 
                  name="email" 
                  type="email"
                  placeholder="E-mail" 
                  className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
            </div>
            <div>
                <input name="password" type="password" placeholder="Senha" className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {state?.message && (
                <p className={`${state.success ? "text-green-500" : "text-red-500"} text-center`}>
                    {state.message}
                </p>
            )}
            <SubmitButton />
        </form>
        <p className="text-center text-sm">
            Já tem uma conta?{' '}
            <button onClick={() => setMode('login')} className="font-semibold text-blue-600 hover:underline">
            Faça login
            </button>
        </p>
    </div>
  );
}