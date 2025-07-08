'use client'; // Indica que este componente é um Client Component do Next.js

import { useActionState, useEffect, useRef, useState } from 'react'; // Importa hooks do React
import { useFormStatus } from 'react-dom'; // Importa hook para status do formulário
import { createPassword } from '@/lib/actions'; // Importa função para criar senha
import { useRouter } from 'next/navigation'; // Importa hook para navegação
import { generateSecurePassword } from '@/lib/password-generator'; // Importa função para gerar senha segura
import { Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react'; // Importa ícones
import PasswordStrengthMeter from './PasswordStrengthMeter'; // Importa componente de força de senha
import { checkPwnedPassword } from '@/lib/pwned-checker'; // Importa função para checar senha vazada

function SubmitButton() { // Componente para o botão de submit
  const { pending } = useFormStatus(); // Obtém status do formulário
  return (
    <button type="submit" disabled={pending} className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400">
      {pending ? 'Salvando...' : 'Salvar Senha'} // Texto muda conforme status
    </button>
  );
}

export default function AddPasswordForm({ closeModal }: { closeModal: () => void }) { // Componente principal do formulário
  const [password, setPassword] = useState(''); // Estado para senha digitada
  const router = useRouter(); // Hook para navegação
  const initialState: { error?: string; message?: string } = {}; // Estado inicial do formulário
  const [state, dispatch] = useActionState(createPassword, initialState); // Estado e dispatcher para ação de criar senha
  const [isCheckingPwned, setIsCheckingPwned] = useState(false); // Estado para checagem de senha vazada
  const [pwnedResult, setPwnedResult] = useState<{ isPwned: boolean; count: number } | null>(null); // Resultado da checagem

  const formRef = useRef<HTMLFormElement>(null); // Ref para o formulário
  const passwordInputRef = useRef<HTMLInputElement>(null); // Ref para o input de senha

  const handlePwnedCheck = async () => { // Função para checar se senha foi vazada
    if (!password) return; // Não faz nada se senha vazia
    setIsCheckingPwned(true); // Marca como checando
    setPwnedResult(null); // Limpa resultado anterior
    const result = await checkPwnedPassword(password); // Checa senha
    setPwnedResult(result); // Atualiza resultado
    setIsCheckingPwned(false); // Marca como não checando
  };

  const handleGeneratePassword = () => { // Função para gerar senha segura
    const newPassword = generateSecurePassword(); // Gera nova senha
    if (passwordInputRef.current) { // Se input existe
      passwordInputRef.current.value = newPassword; // Atualiza valor do input
    }
  };

  useEffect(() => { // Efeito para fechar modal ao salvar senha
    if (state?.message) { // Se mensagem de sucesso
      router.refresh(); // Atualiza página
      closeModal(); // Fecha modal
    }
  }, [state, closeModal, router]);

  return (
    <form ref={formRef} action={dispatch} className="space-y-4"> {/* Formulário principal */}
      <h2 className="text-2xl font-bold text-center mb-6">Adicionar Nova Senha</h2> {/* Título */}

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
            setPassword(e.target.value); // Atualiza estado da senha
            setPwnedResult(null); // Limpa resultado da checagem
          }}
        />

        <button 
          type="button" 
          onClick={handleGeneratePassword}
          className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center space-x-2 text-xs bg-slate-200 dark:bg-slate-700 p-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
          title="Gerar senha segura"
        >
          <Sparkles size={16} /> {/* Ícone de brilho */}
          <span>Gerar</span>
        </button>
      </div>

      <PasswordStrengthMeter password={password} /> {/* Medidor de força da senha */}
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

      {state?.error && <p className="text-red-500 text-center">{state.error}</p>} {/* Exibe erro se houver */}

      <SubmitButton /> {/* Botão de submit */}
    </form>
  );
}