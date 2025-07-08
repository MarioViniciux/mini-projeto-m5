'use client'; // Indica que este componente é um Client Component do Next.js

import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core'; // Importa a função e o tipo para análise de senha
import { useMemo } from 'react'; // Importa hook para memoização

interface PasswordStrengthMeterProps { // Define as props do componente
  password?: string; // Senha a ser analisada (opcional)
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => { // Componente principal
  const result = useMemo<ZxcvbnResult | null>(() => { // Memoiza o resultado da análise de senha
    if (!password) return null; // Se não houver senha, retorna null
    return zxcvbn(password); // Analisa a senha e retorna o resultado
  }, [password]); // Executa novamente se a senha mudar

  const score = result?.score ?? 0; // Score da força da senha (0 a 4), padrão 0

  const getStrengthLabel = () => { // Função para retornar o rótulo da força
    switch (score) {
      case 0: return 'Muito Fraca';
      case 1: return 'Fraca';
      case 2: return 'Razoável';
      case 3: return 'Forte';
      case 4: return 'Muito Forte';
      default: return '';
    }
  };

  const getBarColor = () => { // Função para retornar a cor da barra de força
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      case 4: return 'bg-emerald-600';
      default: return 'bg-slate-200';
    }
  };

  const getBarWidth = () => { // Função para calcular a largura da barra de força
    return `${((score + 1) / 5) * 100}%`;
  };

  if (!password) { // Se não houver senha, não renderiza nada
    return null; 
  }

  return (
    <div className="mt-2"> {/* Margem superior */}
      <div className="flex justify-between items-center mb-1"> {/* Linha com label e valor */}
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Força da Senha:
        </span>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {getStrengthLabel()}
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"> {/* Barra de fundo */}
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`} // Barra colorida de acordo com a força
          style={{ width: getBarWidth() }} // Largura proporcional ao score
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter; // Exporta o componente