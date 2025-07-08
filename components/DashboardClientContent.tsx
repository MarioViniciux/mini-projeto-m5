'use client'; // Indica que este componente é um Client Component do Next.js

import { useState, useMemo } from 'react'; // Importa hooks de estado e memoização do React
import { PlusCircle, Search } from 'lucide-react'; // Importa ícones
import PasswordList from './PasswordList'; // Importa o componente de lista de senhas
import AddPasswordModal from './AddPasswordModal'; // Importa o modal de adicionar senha
import ConfirmationModal from './ConfirmationModal'; // Importa o modal de confirmação
import { deletePassword } from '@/lib/actions'; // Importa função para deletar senha
import EditPasswordModal from './EditPasswordModal'; // Importa o modal de edição de senha
import { useRouter } from 'next/navigation'; // Importa hook para navegação

interface Password { // Define a interface Password para tipar os dados das senhas
  id: number; // ID da senha
  service: string; // Nome do serviço
  username?: string; // Nome de usuário (opcional)
  email?: string; // Email (opcional)
  notes?: string; // Notas (opcional)
  tags?: { id: number; name: string }[]; // Lista de tags (opcional)
}

export default function DashboardClientContent({ initialPasswords }: { initialPasswords: Password[] }) { // Componente principal do conteúdo do dashboard
  const router = useRouter(); // Hook para navegação

  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Estado para controlar abertura do modal de adicionar senha
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Estado para controlar abertura do modal de confirmação
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controlar abertura do modal de edição

  const [passwordToDelete, setPasswordToDelete] = useState<Password | null>(null); // Estado para armazenar a senha a ser deletada
  const [passwordToEdit, setPasswordToEdit] = useState<Password | null>(null); // Estado para armazenar a senha a ser editada

  const [isDeleting, setIsDeleting] = useState(false); // Estado para indicar se está deletando

  const [searchTerm, setSearchTerm] = useState(''); // Estado para termo de busca
  const [selectedTag, setSelectedTag] = useState<string>(''); // Estado para tag selecionada

  const allTags = useMemo(() => { // Memoiza todas as tags únicas presentes nas senhas
    const tagSet = new Set<string>();
    initialPasswords.forEach(pw => {
      pw.tags?.forEach(tag => tagSet.add(tag.name));
    });
    return Array.from(tagSet).sort();
  }, [initialPasswords]);

  const filteredPasswords = useMemo(() => { // Memoiza a lista de senhas filtradas por busca e tag
    return initialPasswords.filter(password => {
      const matchesSearch = password.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag ? password.tags?.some(tag => tag.name === selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [initialPasswords, searchTerm, selectedTag]);

  const handleOpenDeleteModal = (password: Password) => { // Abre o modal de confirmação para deletar senha
    setPasswordToDelete(password);
    setIsConfirmModalOpen(true);
  };

  const handleCloseDeleteModal = () => { // Fecha o modal de confirmação e limpa a senha selecionada
    setIsConfirmModalOpen(false);
    setPasswordToDelete(null);
  };

  const handleConfirmDelete = async () => { // Função para confirmar a exclusão da senha
    if (!passwordToDelete) return;

    setIsDeleting(true); // Marca como deletando
    await deletePassword(passwordToDelete.id); // Chama função para deletar senha
    router.refresh(); // Atualiza a página
    setIsDeleting(false); // Marca como não deletando
    handleCloseDeleteModal(); // Fecha o modal de confirmação
  };

  const handleOpenEditModal = (password: Password) => { // Abre o modal de edição para a senha selecionada
    setPasswordToEdit(password);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <AddPasswordModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} /> {/* Modal para adicionar senha */}

      <EditPasswordModal 
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        password={passwordToEdit}
      /> {/* Modal para editar senha */}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        isConfirming={isDeleting}
      >
        <p>Tem certeza que deseja deletar permanentemente a senha do serviço <strong>"{passwordToDelete?.service}"</strong>?</p>
        <p>Esta ação não pode ser desfeita.</p>
      </ConfirmationModal> {/* Modal de confirmação de exclusão */}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Barra superior com busca e botão de adicionar */}
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /> {/* Ícone de busca */}
          <input
            type="text"
            placeholder="Buscar por serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors hover:cursor-pointer"
        >
          <PlusCircle size={20} />
          <span>Adicionar Nova</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {/* Filtros de tags */}
        <button
          onClick={() => setSelectedTag('')}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${!selectedTag ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 hover:cursor-pointer'}`}
        >
          Todas
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 hover:cursor-pointer'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <PasswordList 
        initialPasswords={filteredPasswords} 
        onAskForDelete={handleOpenDeleteModal}
        onAskForEdit={handleOpenEditModal} 
      /> {/* Lista de senhas filtradas, com handlers para editar e deletar */}
    </>
  );
}