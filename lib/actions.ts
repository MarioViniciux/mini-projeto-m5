'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { revalidatePath } from 'next/cache'

const API_URL = process.env.URL_BACKEND;

const registerSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido"),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const createPasswordSchema = z.object({
  service: z.string().min(1, 'O nome do serviço é obrigatório.'),
  username: z.string().optional(),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }).optional().or(z.literal('')),
  notes: z.string().optional(),
  tags: z.string().optional(),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

const updatePasswordSchema = createPasswordSchema.extend({
  password: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres.').optional().or(z.literal('')),
});

export async function registerUser(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { message: validatedFields.error.errors[0].message };
  }

  try {
    await axios.post(`${API_URL}/auth/register`, validatedFields.data);
    return { message: 'Usuário registrado com sucesso! Faça o login.', success: true };
  } catch (error) {
    return { message: 'Este e-mail já foi cadastrado.' };                                                                                                                                                                                                         
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { message: 'Dados inválidos.' };
  }
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, validatedFields.data);
    const { token } = response.data;

    (await cookies()).set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  } catch (error) {
    return { message: 'E-mail ou senha inválidos.' };
  }

  redirect('/dashboard');
}

export async function logoutUser() {
  (await cookies()).delete('authToken');
  redirect('/');
}

export async function createPassword(prevState: any, formData: FormData) {
  const validatedFields = createPasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return { error: 'Dados inválidos. Verifique os campos.' };
  }
  
  const { tags, ...passwordData } = validatedFields.data;
  const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

  const dataToSend = {
    ...passwordData,
    tags: tagArray, 
  };

  const token = (await cookies()).get('authToken')?.value;
  if (!token) return { error: 'Não autorizado.' };

  try {
    await axios.post(
      `${API_URL}/passwords`,
      dataToSend, 
      { headers: { Authorization: `Bearer ${token}` } },
    );

    revalidatePath('/dashboard');
    return { message: 'Senha criada com sucesso!' };
  } catch (error) {
    return { error: 'Falha ao criar a senha.' };
  }
}


export async function deletePassword(passwordId: number) {
  const token = (await cookies()).get('authToken')?.value;
  if (!token) {
    throw new Error('Não autorizado.');
  }

  try {
    await axios.delete(`${API_URL}/passwords/${passwordId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    revalidatePath('/dashboard');
  } catch(error) {
    throw new Error('Falha ao deletar a senha.');
  }
}

export async function updatePassword(
  passwordId: number, 
  prevState: any, 
  formData: FormData
) {
  const validatedFields = updatePasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return { error: 'Dados inválidos. Verifique os campos e tente novamente.' };
  }

  const dataToUpdate = { ...validatedFields.data };
  if (!dataToUpdate.password) {
    delete dataToUpdate.password;
  }

  const { tags, ...passwordData } = validatedFields.data;
  const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

  const dataToSend = {
    ...passwordData,
    tags: tagArray,
  };

  const token = (await cookies()).get('authToken')?.value;
  if (!token) {
    return { error: 'Não autorizado.' };
  }

  try {
    await axios.put(
      `${API_URL}/passwords/${passwordId}`,
      dataToSend,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    revalidatePath('/dashboard');
    return { message: 'Senha atualizada com sucesso!' };
  } catch (error) {
    return { error: 'Falha ao atualizar a senha.' };
  }
}