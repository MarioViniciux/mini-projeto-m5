export function generateSecurePassword(
  length: number = 16,
  options: {
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
  } = {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  }
) : string {
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  let availableChars = '';
  if (options.includeUppercase) availableChars += charSets.uppercase;
  if (options.includeLowercase) availableChars += charSets.lowercase;
  if (options.includeNumbers) availableChars += charSets.numbers;
  if (options.includeSymbols) availableChars += charSets.symbols;

  if (availableChars.length === 0) {
    return 'Nenhuma opção selecionada';
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    password += availableChars[randomIndex];
  }

  return password;
}