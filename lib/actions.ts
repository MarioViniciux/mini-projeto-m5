'use server'; // Indica que este arquivo roda no contexto do servidor (Next.js)

import { z } from 'zod'; // Importa zod para validação de dados
import { cookies } from 'next/headers'; // Importa utilitário para manipular cookies
import { redirect } from 'next/navigation'; // Importa função para redirecionamento de rotas
import axios from 'axios'; // Importa axios para requisições HTTP
import { revalidatePath } from 'next/cache' // Importa função para revalidar cache de rotas

const API_URL = process.env.URL_BACKEND; // Define a URL base da API a partir das variáveis de ambiente

const registerSchema = z.object({ // Esquema de validação para registro
  email: z.string().email("Por favor, insira um e-mail válido"),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const loginSchema = z.object({ // Esquema de validação para login
  email: z.string().email('Por favor, insira um e-mail válido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const createPasswordSchema = z.object({ // Esquema de validação para criação de senha
  service: z.string().min(1, 'O nome do serviço é obrigatório.'),
  username: z.string().optional(),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }).optional().or(z.literal('')),
  notes: z.string().optional(),
  tags: z.string().optional(),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

const updatePasswordSchema = createPasswordSchema.extend({ // Esquema de validação para atualização de senha
  password: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres.').optional().or(z.literal('')),
});

export async function registerUser(prevState: any, formData: FormData) { // Função para registrar usuário
  const validatedFields = registerSchema.safeParse(Object.fromEntries(formData.entries())); // Valida os campos do formulário

  if (!validatedFields.success) { // Se a validação falhar
    return { message: validatedFields.error.errors[0].message }; // Retorna a mensagem de erro
  }

  try {
    await axios.post(`${API_URL}/auth/register`, validatedFields.data); // Faz requisição para registrar usuário
    return { message: 'Usuário registrado com sucesso! Faça o login.', success: true }; // Retorna sucesso
  } catch (error) {
    return { message: 'Este e-mail já foi cadastrado.' }; // Retorna erro se o e-mail já existe
  }
}

export async function loginUser(prevState: any, formData: FormData) { // Função para login do usuário
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries())); // Valida os campos do formulário

  if (!validatedFields.success) { // Se a validação falhar
    return { message: 'Dados inválidos.' }; // Retorna erro
  }
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, validatedFields.data); // Faz requisição de login
    const { token } = response.data; // Extrai o token da resposta

    (await cookies()).set('authToken', token, { // Salva o token nos cookies
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  } catch (error) {
    return { message: 'E-mail ou senha inválidos.' }; // Retorna erro se login falhar
  }

  redirect('/dashboard'); // Redireciona para o dashboard após login
}

export async function logoutUser() { // Função para logout do usuário
  (await cookies()).delete('authToken'); // Remove o token dos cookies
  redirect('/'); // Redireciona para a página inicial
}

export async function createPassword(prevState: any, formData: FormData) { // Função para criar nova senha
  const validatedFields = createPasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  ); // Valida os campos do formulário

  if (!validatedFields.success) { // Se a validação falhar
    return { error: 'Dados inválidos. Verifique os campos.' }; // Retorna erro
  }
  
  const { tags, ...passwordData } = validatedFields.data; // Separa tags dos outros dados
  const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []; // Converte tags em array

  const dataToSend = {
    ...passwordData,
    tags: tagArray, 
  };

  const token = (await cookies()).get('authToken')?.value; // Busca o token de autenticação
  if (!token) return { error: 'Não autorizado.' }; // Retorna erro se não houver token

  try {
    await axios.post(
      `${API_URL}/passwords`,
      dataToSend, 
      { headers: { Authorization: `Bearer ${token}` } },
    ); // Faz requisição para criar senha

    revalidatePath('/dashboard'); // Revalida o cache do dashboard
    return { message: 'Senha criada com sucesso!' }; // Retorna sucesso
  } catch (error) {
    return { error: 'Falha ao criar a senha.' }; // Retorna erro se falhar
  }
}

export async function deletePassword(passwordId: number) { // Função para deletar senha
  const token = (await cookies()).get('authToken')?.value; // Busca o token de autenticação
  if (!token) {
    throw new Error('Não autorizado.'); // Lança erro se não houver token
  }

  try {
    await axios.delete(`${API_URL}/passwords/${passwordId}`, {
        headers: { Authorization: `Bearer ${token}` }
    }); // Faz requisição para deletar senha

    revalidatePath('/dashboard'); // Revalida o cache do dashboard
  } catch(error) {
    throw new Error('Falha ao deletar a senha.'); // Lança erro se falhar
  }
}

export async function updatePassword(
  passwordId: number, 
  prevState: any, 
  formData: FormData
) { // Função para atualizar senha
  const validatedFields = updatePasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  ); // Valida os campos do formulário

  if (!validatedFields.success) { // Se a validação falhar
    return { error: 'Dados inválidos. Verifique os campos e tente novamente.' }; // Retorna erro
  }

  const dataToUpdate = { ...validatedFields.data }; // Copia os dados validados
  if (!dataToUpdate.password) {
    delete dataToUpdate.password; // Remove o campo senha se estiver vazio
  }

  const { tags, ...passwordData } = validatedFields.data; // Separa tags dos outros dados
  const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []; // Converte tags em array

  const dataToSend = {
    ...passwordData,
    tags: tagArray,
  };

  const token = (await cookies()).get('authToken')?.value; // Busca o token de autenticação
  if (!token) {
    return { error: 'Não autorizado.' }; // Retorna erro se não houver token
  }

  try {
    await axios.put(
      `${API_URL}/passwords/${passwordId}`,
      dataToSend,
      { headers: { Authorization: `Bearer ${token}` } },
    ); // Faz requisição para atualizar senha

    revalidatePath('/dashboard'); // Revalida o cache do dashboard
    return { message: 'Senha atualizada com sucesso!' }; // Retorna sucesso
  } catch (error) {
    return { error: 'Falha ao atualizar a senha.' }; // Retorna erro se falhar
  }
}