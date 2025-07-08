'use client'; // Indica que este componente é um Client Component do Next.js

import { useActionState } from 'react'; // Importa hook para gerenciar estado de ações do React
import { useFormStatus } from 'react-dom'; // Importa hook para status do formulário
import { loginUser } from '@/lib/actions'; // Importa função para login do usuário

function SubmitButton() { // Componente para o botão de submit
  const { pending } = useFormStatus(); // Obtém status do formulário
  return (
    <button type="submit" disabled={pending} className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400">
      {pending ? 'Entrando...' : 'Entrar'} // Texto muda conforme status
    </button>
  );
}

export default function LoginForm({ setMode }: { setMode: (mode: 'login' | 'register') => void }) { // Componente principal do formulário de login
    const initialState = { message: '' }; // Estado inicial do formulário
    const [state, dispatch] = useActionState(loginUser, initialState); // Estado e dispatcher para ação de login

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Login</h2> {/* Título do formulário */}
            <form action={dispatch} className="space-y-4"> {/* Formulário de login */}
                <div>
                    <input 
                      name="email" // Nome do campo para email
                      type="email" // Tipo email
                      placeholder="E-mail" // Placeholder do campo
                      className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" // Estilos do input
                    />
                </div>
                <div>
                    <input 
                      name="password" // Nome do campo para senha
                      type="password" // Tipo password
                      placeholder="Senha" // Placeholder do campo
                      className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" // Estilos do input
                    />
                </div>
                {state?.message && <p className="text-red-500 text-center">{state.message}</p>} // Exibe mensagem de erro, se houver
                <SubmitButton /> {/* Botão de submit */}
            </form>
             <p className="text-center text-sm">
                Não tem uma conta?{' '} {/* Texto para registro */}
                <button onClick={() => setMode('register')} className="font-semibold text-blue-600 hover:underline">
                Registre-se {/* Botão para mudar para modo de registro */}
                </button>
            </p>
        </div>
    );
}