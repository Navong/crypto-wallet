import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AccountContextProps {
  account: string | null;
  chainId: number | null;
  setChain: (chainId: number | null) => void;
  setAccount: (account: string | null) => void;
}

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChain] = useState<number | null>(null);

  return (
    <AccountContext.Provider value={{ account, setAccount, chainId, setChain }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }
  return context;
};