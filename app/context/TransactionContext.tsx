"use client";

import { createContext, useContext, useState } from "react";

interface Transaction {
    account?: any[];
    accountID?: string;
    amount?: string;
    type?: "deposit" | "withdraw" | "transfer";
    from?: string;
    to?: string;
}

interface TransactionContextType {
    transaction: Transaction;
    setTransaction: (transaction: Transaction) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
    undefined
);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transaction, setTransaction] = useState<Transaction>({});

  return (
    <TransactionContext.Provider value={{ transaction, setTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("useTransaction must be used within TransactionProvider");
    }
    return context;
}