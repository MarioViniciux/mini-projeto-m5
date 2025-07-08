'use client';

import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core';
import { useMemo } from 'react';

interface PasswordStrengthMeterProps {
  password?: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const result = useMemo<ZxcvbnResult | null>(() => {
    if (!password) return null;
    return zxcvbn(password);
  }, [password]);

  const score = result?.score ?? 0;
  
  const getStrengthLabel = () => {
    switch (score) {
      case 0: return 'Muito Fraca';
      case 1: return 'Fraca';
      case 2: return 'Razoável';
      case 3: return 'Forte';
      case 4: return 'Muito Forte';
      default: return '';
    }
  };

  const getBarColor = () => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      case 4: return 'bg-emerald-600';
      default: return 'bg-slate-200';
    }
  };

  const getBarWidth = () => {
    return `${((score + 1) / 5) * 100}%`;
  };

  if (!password) {
    return null; 
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Força da Senha:
        </span>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {getStrengthLabel()}
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: getBarWidth() }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;