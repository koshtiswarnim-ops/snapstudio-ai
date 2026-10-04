import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { UserCredits } from '../types';
import { getInitialMockCredits, saveMockCredits } from '../services/supabase';

interface CreditContextType {
  availableCredits: number;
  totalUsed: number;
  deductCredit: () => boolean;
  addCredits: (amount: number) => void;
  hasSufficientCredits: () => boolean;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits>({
    id: 'crd_guest',
    user_id: user?.id || 'guest',
    available_credits: 0,
    total_used: 0,
    updated_at: new Date().toISOString(),
  });

  useEffect(() => {
    if (user?.id) {
      const initial = getInitialMockCredits(user.id);
      setCredits(initial);
    } else {
      setCredits({
        id: 'crd_guest',
        user_id: 'guest',
        available_credits: 0,
        total_used: 0,
        updated_at: new Date().toISOString(),
      });
    }
  }, [user?.id]);

  const deductCredit = (): boolean => {
    if (credits.available_credits < 1) return false;
    const updated: UserCredits = {
      ...credits,
      available_credits: credits.available_credits - 1,
      total_used: credits.total_used + 1,
      updated_at: new Date().toISOString(),
    };
    setCredits(updated);
    saveMockCredits(updated);
    return true;
  };

  const addCredits = (amount: number) => {
    const updated: UserCredits = {
      ...credits,
      available_credits: credits.available_credits + amount,
      updated_at: new Date().toISOString(),
    };
    setCredits(updated);
    saveMockCredits(updated);
  };

  const hasSufficientCredits = () => credits.available_credits >= 1;

  return (
    <CreditContext.Provider
      value={{
        availableCredits: credits.available_credits,
        totalUsed: credits.total_used,
        deductCredit,
        addCredits,
        hasSufficientCredits,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) throw new Error('useCredits must be used within a CreditProvider');
  return context;
};
