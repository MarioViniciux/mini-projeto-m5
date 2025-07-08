export function generateSecurePassword(
  length: number = 16, // Parâmetro para o tamanho da senha (padrão: 16)
  options: { // Parâmetro para opções de composição da senha
    includeUppercase: boolean; // Incluir letras maiúsculas
    includeLowercase: boolean; // Incluir letras minúsculas
    includeNumbers: boolean;   // Incluir números
    includeSymbols: boolean;   // Incluir símbolos
  } = {
    includeUppercase: true,    // Padrão: incluir maiúsculas
    includeLowercase: true,    // Padrão: incluir minúsculas
    includeNumbers: true,      // Padrão: incluir números
    includeSymbols: true,      // Padrão: incluir símbolos
  }
) : string {
  const charSets = { // Define os conjuntos de caracteres disponíveis
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // Letras maiúsculas
    lowercase: 'abcdefghijklmnopqrstuvwxyz', // Letras minúsculas
    numbers: '0123456789',                   // Números
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',   // Símbolos
  };

  let availableChars = ''; // String para armazenar todos os caracteres permitidos
  if (options.includeUppercase) availableChars += charSets.uppercase; // Adiciona maiúsculas se selecionado
  if (options.includeLowercase) availableChars += charSets.lowercase; // Adiciona minúsculas se selecionado
  if (options.includeNumbers) availableChars += charSets.numbers;     // Adiciona números se selecionado
  if (options.includeSymbols) availableChars += charSets.symbols;     // Adiciona símbolos se selecionado

  if (availableChars.length === 0) { // Se nenhum conjunto foi selecionado
    return 'Nenhuma opção selecionada'; // Retorna mensagem de erro
  }

  let password = ''; // Inicializa a senha vazia
  for (let i = 0; i < length; i++) { // Loop para gerar cada caractere da senha
    const randomIndex = Math.floor(Math.random() * availableChars.length); // Gera índice aleatório
    password += availableChars[randomIndex]; // Adiciona caractere aleatório à senha
  }

  return password; // Retorna a senha gerada
}