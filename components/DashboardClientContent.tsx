'use client';

import { useState, useMemo } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import PasswordList from './PasswordList';
import AddPasswordModal from './AddPasswordModal';
import ConfirmationModal from './ConfirmationModal';
import { deletePassword } from '@/lib/actions';
import EditPasswordModal from './EditPasswordModal';
import { useRouter } from 'next/navigation';

interface Password {
  id: number;
  service: string;
  username?: string;
  email?: string;
  notes?: string;
  tags?: { id: number; name: string }[];
}

export default function DashboardClientContent({ initialPasswords }: { initialPasswords: Password[] }) {
  const router = useRouter();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [passwordToDelete, setPasswordToDelete] = useState<Password | null>(null);
  const [passwordToEdit, setPasswordToEdit] = useState<Password | null>(null);
  
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialPasswords.forEach(pw => {
      pw.tags?.forEach(tag => tagSet.add(tag.name));
    });
    return Array.from(tagSet).sort();
  }, [initialPasswords]);

  const filteredPasswords = useMemo(() => {
    return initialPasswords.filter(password => {
      const matchesSearch = password.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag ? password.tags?.some(tag => tag.name === selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [initialPasswords, searchTerm, selectedTag]);

  const handleOpenDeleteModal = (password: Password) => {
    setPasswordToDelete(password);
    setIsConfirmModalOpen(true);
  };
  
  const handleCloseDeleteModal = () => {
    setIsConfirmModalOpen(false);
    setPasswordToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!passwordToDelete) return;
    
    setIsDeleting(true);
    await deletePassword(passwordToDelete.id);
    router.refresh(); 
    setIsDeleting(false);
    handleCloseDeleteModal();
  };

  const handleOpenEditModal = (password: Password) => {
    setPasswordToEdit(password);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <AddPasswordModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} />
      
      <EditPasswordModal 
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        password={passwordToEdit}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        isConfirming={isDeleting}
      >
        <p>Tem certeza que deseja deletar permanentemente a senha do serviço <strong>"{passwordToDelete?.service}"</strong>?</p>
        <p>Esta ação não pode ser desfeita.</p>
      </ConfirmationModal>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
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
      />
    </>
  );
}