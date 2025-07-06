'use client';

import { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom';
import { loginUser } from '@/lib/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400">
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  );
}

export default function LoginForm({ setMode }: { setMode: (mode: 'login' | 'register') => void }) {
    const initialState = { message: '' };
    const [state, dispatch] = useActionState(loginUser, initialState);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Login</h2>
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
                {state?.message && <p className="text-red-500 text-center">{state.message}</p>}
                <SubmitButton />
            </form>
             <p className="text-center text-sm">
                Não tem uma conta?{' '}
                <button onClick={() => setMode('register')} className="font-semibold text-blue-600 hover:underline">
                Registre-se
                </button>
            </p>
        </div>
    );
}