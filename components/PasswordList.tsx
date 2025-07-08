'use client'; // Indica que este componente é um Client Component do Next.js

import { Eye, EyeOff, Trash2, Clipboard, Pencil, User, Mail, FileText } from 'lucide-react'; // Importa ícones
import { useState } from 'react'; // Importa hook de estado do React
import axios from 'axios'; // Importa o axios para requisições HTTP
import { toast } from 'react-hot-toast'; // Importa o toast para notificações

interface Password { // Define a interface Password para tipar os dados das senhas
  id: number; // ID da senha
  service: string; // Nome do serviço
  username?: string; // Nome de usuário (opcional)
  email?: string; // Email (opcional)
  notes?: string; // Notas (opcional)
  tags?: { id: number; name: string }[]; // Lista de tags (opcional)
  password?: string; // Senha (opcional)
}

function PasswordCard({ 
  password, 
  onAskForDelete,
  onAskForEdit 
} : { 
  password: Password,
  onAskForDelete: (password: Password) => void,
  onAskForEdit: (password: Password) => void
}) {
  const [isVisible, setIsVisible] = useState(false); // Estado para mostrar/esconder senha
  const [fullPassword, setFullPassword] = useState<string | null>(null); // Estado para senha completa
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

  const toggleVisibility = async () => { // Alterna a visibilidade da senha
    if (isVisible) {
      setIsVisible(false); // Esconde a senha
      setFullPassword(null); // Limpa a senha completa
      return;
    }
    setIsLoading(true); // Inicia carregamento
    try {
      const response = await axios.get(`/api/passwords/${password.id}`); // Busca a senha completa na API
      setFullPassword(response.data.password); // Salva a senha completa
      setIsVisible(true); // Mostra a senha
    } catch (error) {
      console.error("Falha ao buscar senha:", error); // Loga erro
      toast.error("Falha ao buscar senha."); // Mostra erro ao usuário
    } finally {
      setIsLoading(false); // Finaliza carregamento
    }
  }

  const handleCopy = (textToCopy: string | undefined, fieldName: string) => { // Função para copiar texto para a área de transferência
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success(`${fieldName} copiado(a) com sucesso!`); // Mostra sucesso ao copiar
    });
  };
    
  const handleCopyPassword = async () => { // Função para copiar a senha
    if (fullPassword) {
      handleCopy(fullPassword, 'Senha'); // Copia a senha já carregada
      return;
    }

    setIsLoading(true); // Inicia carregamento
    try {
      const response = await axios.get(`/api/passwords/${password.id}`); // Busca a senha completa na API
      const passwordToCopy = response.data.password; 

      if (passwordToCopy) {
        setFullPassword(passwordToCopy); // Salva a senha completa
        handleCopy(passwordToCopy, 'Senha'); // Copia a senha
      } else {
        toast.error("Não foi possível obter a senha."); // Mostra erro se não conseguir senha
      }
    } catch (error) {
      console.error("Falha ao buscar senha para copiar:", error); // Loga erro
      toast.error("Falha ao buscar senha."); // Mostra erro ao usuário
    } finally {
      setIsLoading(false); // Finaliza carregamento
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-col space-y-3">
      <div className="flex justify-between items-center">
          <p className="font-bold text-lg">{password.service}</p> {/* Nome do serviço */}
          <div className="flex items-center space-x-2">
            <button onClick={() => onAskForEdit(password)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:cursor-pointer" title="Editar">
              <Pencil size={20} />
            </button>
            <button onClick={() => onAskForDelete(password)} className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 hover:cursor-pointer" title="Deletar">
              <Trash2 size={20} />
            </button>
          </div>
      </div>

      {password.username && (
        <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-3">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <User size={16} />
            <span className="font-mono">{password.username}</span>
          </div>
          <button onClick={() => handleCopy(password.username, 'Usuário')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:cursor-pointer" title="Copiar usuário">
            <Clipboard size={20} />
          </button>
        </div>
      )}
            
      {password.email && (
        <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-3">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Mail size={16} />
              <span className="font-mono">{password.email}</span>
            </div>
            <button onClick={() => handleCopy(password.email, 'Email')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:cursor-pointer" title="Copiar email">
              <Clipboard size={20} />
            </button>
        </div>
      )}
            
      <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-3">
        <span className="font-mono text-slate-600 dark:text-slate-400">
          {isVisible && fullPassword ? fullPassword : '••••••••••'}
        </span>
        <div className="flex items-center space-x-2">
          <button onClick={handleCopyPassword} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:cursor-pointer" title="Copiar senha">
            <Clipboard size={20} />
          </button>
          <button onClick={toggleVisibility} disabled={isLoading} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:cursor-pointer">
            {isLoading ? '...' : isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {password.notes && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
          <div className="flex items-start space-x-2 text-slate-600 dark:text-slate-400">
            <FileText size={16} className="mt-1 flex-shrink-0" />
            <p className="text-sm whitespace-pre-wrap">{password.notes}</p>
          </div>
        </div>
      )}

      {password.tags && password.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            {password.tags.map(tag => (
              <span key={tag.id} className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
              {tag.name}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}

export default function PasswordList({ 
  initialPasswords, 
  onAskForDelete,
  onAskForEdit
} : { 
  initialPasswords: Password[],
  onAskForDelete: (password: Password) => void,
  onAskForEdit: (password: Password) => void
}) {
  if (initialPasswords.length === 0) {
    return <p className="text-center text-slate-500 mt-8">Nenhum resultado encontrado.</p>; // Mensagem se não houver senhas
  }

  return (
    <div className="space-y-4">
      {initialPasswords.map(pw => 
        <PasswordCard key={pw.id} password={pw} onAskForDelete={onAskForDelete} onAskForEdit={onAskForEdit} />
      )}
    </div>
  );
}