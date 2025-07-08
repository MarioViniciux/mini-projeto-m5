# Gerenciador de Senhas - Projeto Next.js

## 📖 Sobre

Este é um projeto **Full-Stack** de um **Gerenciador de Senhas**, construído com o framework **Next.js**. A aplicação permite que os usuários salvem, visualizem, editem e excluam suas credenciais de forma segura e intuitiva.

O frontend foi desenvolvido com **React** e estilizado com **Tailwind CSS** para uma interface moderna e responsiva. O backend utiliza as **API Routes** do Next.js para fornecer uma API RESTful completa, que se conecta a um banco de dados **PostgreSQL** para persistência dos dados. A segurança das senhas é garantida através da criptografia com **bcrypt.js** antes de serem salvas.

## ✨ Funcionalidades

  - **CRUD Completo de Senhas:**
      - **Criar:** Adicionar novas credenciais (site, usuário e senha).
      - **Ler:** Visualizar a lista de todas as senhas salvas.
      - **Atualizar:** Editar credenciais existentes.
      - **Excluir:** Remover uma credencial da lista.
  - **Interface Responsiva:** Construída com Tailwind CSS para se adaptar a diferentes tamanhos de tela.
  - **Segurança:** As senhas são criptografadas (hashed) antes de serem armazenadas no banco de dados.
  - **Arquitetura Serverless:** Utiliza as API Routes do Next.js, otimizadas para deploy em plataformas como a Vercel.
  - **Validação de Força de Senha:** Medidor visual para indicar a força da senha que está sendo criada.
  - **Gerador de Senhas Seguras:** Ferramenta para gerar senhas aleatórias e fortes.
  - **Verificação de Vazamentos:** Integração com a API "Have I Been Pwned" para verificar se uma senha já foi exposta em vazamentos de dados conhecidos.
  - **Autenticação de Usuários:** Sistema de login e registro para que cada usuário tenha acesso apenas às suas próprias senhas.
  - **Tema Claro e Escuro (Dark Mode):** Opção para alternar entre temas. (atualmente, com erro).

## 🛠️ Tecnologias Utilizadas

  - **Framework:** [Next.js](https://nextjs.org/)
  - **Linguagem:** TypeScript
  - **Frontend:** [React](https://react.dev/)
  - **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
  - **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
  - **ORM (Object-Relational Mapping):** [Neon](https://neon.com/)
  - **Criptografia de Senhas:** [bcrypt.js](https://www.google.com/search?q=https://github.com/dcodeIO/bcrypt.js)
  - **Deploy:** [Vercel](https://vercel.com/)

## 🏛️ Arquitetura

O sistema é construído sobre uma arquitetura de microsserviços, onde as responsabilidades são divididas:

-   **API Externa:** Uma API principal e dedicada cuida da maior parte da lógica de negócio e da comunicação com o banco de dados PostgreSQL.
-   **API Routes do Next.js:** O backend do projeto Next.js (`/app/api/*`) é usado para tarefas específicas do frontend, como formatar dados, integrar com serviços de terceiros (ex: "Have I Been Pwned") e atuar como um proxy para a API principal, otimizando a comunicação.

## 🚀 Como Executar o Projeto

Apenas clique [aqui](https://mini-projeto-m5-snowy.vercel.app/), ou, caso queira rodar localmente, siga os passos abaixo para executar o projeto em seu ambiente.

### Pré-requisitos

  - [Node.js](https://nodejs.org/en) (versão 20 ou superior)

### 1\. Clone o Repositório

```bash
git clone https://github.com/MarioViniciux/mini-projeto-m5
cd mini-projeto-m5
```

### 2\. Instale as Dependências

```bash
npm install --legacy-peer-deps
```

### 3\. Configure as Variáveis de Ambiente

Crie um arquivo chamado `.env.local` na raiz do projeto e adicione a string de conexão a API presente em [mini-projeto-m4](https://github.com/MarioViniciux/mini_projeto_m4):

**.env.local**

```
URL_BACKEND="https://passwordmanager-dyb4.onrender.com/api"

```

### 4\. Execute a Aplicação

```bash
npm run dev
```

Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) no seu navegador para ver o projeto em execução. 
