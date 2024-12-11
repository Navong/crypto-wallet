import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AccountContextProps {
  account: string | null;
  chainId: number | null;
  setChain: (chainId: number | null) => void;
  setAccount: (account: string | null) => void;
  disconnected: boolean;
  setDisconnected: (disconnected: boolean) => void;
}

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChain] = useState<number | null>(null);
  const [disconnected, setDisconnected] = useState<boolean>(true);

  return (
    <AccountContext.Provider value={{ account, setAccount, chainId, setChain, disconnected, setDisconnected }}>
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