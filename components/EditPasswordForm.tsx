'use client'; // Indica que este componente é um Client Component do Next.js

import { useActionState, useEffect, useRef, useState } from 'react'; // Importa hooks do React
import { useFormStatus } from 'react-dom'; // Importa hook para status do formulário
import { updatePassword } from '@/lib/actions'; // Importa função para atualizar senha
import { useRouter } from 'next/navigation'; // Importa hook para navegação
import { generateSecurePassword } from '@/lib/password-generator'; // Importa função para gerar senha segura
import { Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react'; // Importa ícones
import PasswordStrengthMeter from './PasswordStrengthMeter'; // Importa componente de força de senha
import { checkPwnedPassword } from '@/lib/pwned-checker'; // Importa função para checar senha vazada

interface Password { // Define a interface Password para tipar os dados das senhas
  id: number; // ID da senha
  service: string; // Nome do serviço
  username?: string; // Nome de usuário (opcional)
  email?: string; // Email (opcional)
  notes?: string; // Notas (opcional)
  password?: string; // Senha (opcional)
  tags?: { id: number; name: string }[]; // Lista de tags (opcional)
}

function SubmitButton() { // Componente para o botão de submit
  const { pending } = useFormStatus(); // Obtém status do formulário
  return (
    <button type="submit" disabled={pending} className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400">
      {pending ? 'Atualizando...' : 'Atualizar Senha'} // Texto muda conforme status
    </button>
  );
}

export default function EditPasswordForm({ password: initialPassword, closeModal }: { password: Password, closeModal: () => void }) { // Componente principal do formulário de edição
  const router = useRouter(); // Hook para navegação
  const [password, setPassword] = useState(''); // Estado para senha digitada
  const passwordInputRef = useRef<HTMLInputElement>(null); // Ref para o input de senha
  type State = { error?: string; message?: string }; // Tipo para estado do formulário
  const initialState: State = {}; // Estado inicial do formulário
  const updatePasswordWithId = updatePassword.bind(null, initialPassword.id); // Função de atualização já com o ID da senha
  const [state, dispatch] = useActionState<State, FormData>(updatePasswordWithId, initialState); // Estado e dispatcher para ação de atualizar senha
  const [isCheckingPwned, setIsCheckingPwned] = useState(false); // Estado para checagem de senha vazada
  const [pwnedResult, setPwnedResult] = useState<{ isPwned: boolean; count: number } | null>(null); // Resultado da checagem

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

  useEffect(() => { // Efeito para fechar modal ao atualizar senha com sucesso
    if (state?.message) { // Se mensagem de sucesso
      router.refresh(); // Atualiza página
      closeModal(); // Fecha modal
    }
  }, [state, closeModal, router]);

  return (
    <form action={dispatch} className="space-y-4"> {/* Formulário principal */}
      <h2 className="text-2xl font-bold text-center mb-6">Editar Senha</h2> {/* Título */}

      <div>
        <input 
          name="service" // Nome do campo para serviço
          placeholder="Nome do Serviço" // Placeholder do campo
          defaultValue={initialPassword.service} // Valor inicial com o nome do serviço
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" // Estilos do input
        />
      </div>
      
      <div>
        <input 
          name="username" // Nome do campo para usuário
          placeholder="Usuário (opcional)" // Placeholder do campo
          defaultValue={initialPassword.username} // Valor inicial com o usuário
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" // Estilos do input
        />
      </div>
      
      <div>
        <input 
          name="email" // Nome do campo para email
          type="email" // Tipo email
          placeholder="Email (opcional)" // Placeholder do campo
          defaultValue={initialPassword.email} // Valor inicial com o email
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" // Estilos do input
        />
      </div>

      <div className="relative">
        <input 
          ref={passwordInputRef} // Ref para manipular o input
          name="password" // Nome do campo para senha
          type="password" // Tipo password
          placeholder="Deixe em branco para não alterar" // Placeholder do campo
          onChange={(e) => { // Ao alterar o valor
            setPassword(e.target.value); // Atualiza estado da senha
            setPwnedResult(null); // Limpa resultado da checagem
          }}
          className="w-full p-3 pr-20 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" // Estilos do input
        />
        <button 
          type="button" 
          onClick={handleGeneratePassword} // Gera nova senha ao clicar
          className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center space-x-2 text-xs bg-slate-200 dark:bg-slate-700 p-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
          title="Gerar nova senha segura"
        >
          <Sparkles size={16} /> {/* Ícone de brilho */}
          <span>Gerar</span>
        </button>
      </div>

      <PasswordStrengthMeter password={password} /> {/* Medidor de força da senha */}
        <div className="mt-2">
          <button
            type="button"
            onClick={handlePwnedCheck} // Checa se senha foi vazada ao clicar
            disabled={!password || isCheckingPwned} // Desabilita se não houver senha ou estiver checando
            className="w-full text-sm p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingPwned ? 'Verificando...' : 'Verificar se a senha vazou'}
          </button>

          {pwnedResult && !isCheckingPwned && ( // Se houver resultado e não estiver checando
          <div className={`mt-2 p-2 rounded-lg text-sm flex items-center space-x-2 ${
            pwnedResult.isPwned ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
          }`}>
            {pwnedResult.isPwned ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />} {/* Ícone de alerta ou sucesso */}
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
          name="tags" // Nome do campo para tags
          placeholder="Tags (separadas por vírgula)" // Placeholder do campo
          defaultValue={initialPassword.tags?.map(tag => tag.name).join(', ')} // Valor inicial com as tags separadas por vírgula
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" // Estilos do input
        />
      </div>
      
      <div>
        <textarea 
          name="notes" // Nome do campo para anotações
          placeholder="Anotações (opcional)" // Placeholder do campo
          defaultValue={initialPassword.notes} // Valor inicial com as anotações existentes
          rows={3} // Número de linhas do textarea
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" // Estilos do textarea
        ></textarea>
      </div>

      {state?.error && <p className="text-red-500 text-center">{state.error}</p>} {/* Exibe mensagem de erro, se houver */}
      <SubmitButton /> {/* Botão de submit do formulário */}
    </form>
  );
}