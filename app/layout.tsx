import type { Metadata } from "next"; // Importa o tipo Metadata do Next.js para tipar os metadados da página
import { ThemeProvider } from "next-themes"; // Importa o ThemeProvider para controle de temas (claro/escuro)
import "./globals.css"; // Importa o arquivo global de estilos CSS
import { Toaster } from 'react-hot-toast'; // Importa o componente Toaster para exibir notificações toast

export const metadata: Metadata = { // Declara o objeto de metadados da aplicação
  title: "Password Manager", // Define o título da aplicação
  description: "Seu gerenciador de senhas pessoal", // Define a descrição da aplicação
};

export default function RootLayout({ // Exporta o componente RootLayout como padrão
  children, // Recebe os elementos filhos como propriedade
}: Readonly<{ // Define o tipo da propriedade children como somente leitura
  children: React.ReactNode; // children deve ser um nó React
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Define o idioma da página e suprime avisos de hidratação */}
      <body> {/* Início do corpo da página */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> {/* Provider para alternar temas, padrão escuro, permite tema do sistema */}
          <Toaster 
            position="bottom-right" // Define a posição dos toasts no canto inferior direito
            toastOptions={{ // Opções de estilo para os toasts
              style: {
                background: '#333', // Cor de fundo dos toasts
                color: '#fff' // Cor do texto dos toasts
              }
            }}
          />
          {children} {/* Renderiza os componentes filhos dentro do layout */}
        </ThemeProvider>
      </body>
    </html>
  );
}