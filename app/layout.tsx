import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Password Manager",
  description: "Seu gerenciador de senhas pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff'
              }
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
