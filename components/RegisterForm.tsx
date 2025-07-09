'use client'; // Indica que este componente é um Client Component do Next.js

import React from 'react'; // Importa o React
import { useActionState } from 'react'; // Importa hook para gerenciar estado de ações do React
import { useFormStatus } from 'react-dom'; // Importa hook para status do formulário
import { registerUser } from '@/lib/actions'; // Importa função para registrar usuário

function SubmitButton() { // Componente para o botão de submit
  const { pending } = useFormStatus(); // Obtém status do formulário
  return (
    <button type="submit" disabled={pending} className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400">
      {pending ? 'Registrando...' : 'Registrar'} {/* Texto muda conforme status */}
    </button>
  );
}

export default function RegisterForm({ setMode }: { setMode: (mode: 'login' | 'register') => void }) { // Componente principal do formulário de registro
  const initialState = { message: '', success: false }; // Estado inicial do formulário
  const [state, dispatch] = useActionState(registerUser, initialState); // Estado e dispatcher para ação de registro

  React.useEffect(() => { // Efeito para trocar para login após registro com sucesso
    if (state.success) { // Se registro foi bem-sucedido
      const timer = setTimeout(() => setMode('login'), 2000); // Troca para login após 2 segundos
      return () => clearTimeout(timer); // Limpa o timer ao desmontar
    }
  }, [state.success, setMode]);

  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Criar Conta</h2> {/* Título do formulário */}
        <form action={dispatch} className="space-y-4"> {/* Formulário de registro */}
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
            {state?.message && (
                <p className={`${state.success ? "text-green-500" : "text-red-500"} text-center`}>
                    {state.message} {/* Exibe mensagem de sucesso ou erro */}
                </p>
            )}
            <SubmitButton /> {/* Botão de submit */}
        </form>
        <p className="text-center text-sm">
            Já tem uma conta?{' '} {/* Texto para login */}
            <button onClick={() => setMode('login')} className="font-semibold text-blue-600 hover:underline">
            Faça login {/* Botão para mudar para modo de login */}
            </button>
        </p>
    </div>
  );
}