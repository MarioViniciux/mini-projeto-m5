'use client';

import { useState } from 'react';
import DashboardClientContent from './DashboardClientContent';
import DashboardHeader from './DashboardHeader';

interface Password {
  id: number;
  service: string;
  username?: string;
  email?: string;
  notes?: string;
  tags?: { id: number; name: string }[];
}

export default function DashboardWrapper({ initialPasswords }: { initialPasswords: Password[] }) {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(prevKey => prevKey + 1);
  };

  return (
    <>
      <DashboardHeader onReset={handleReset} />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <DashboardClientContent key={resetKey} initialPasswords={initialPasswords} />
      </main>
    </>
  );
}