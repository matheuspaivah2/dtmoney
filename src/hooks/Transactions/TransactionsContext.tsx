import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../../services/api";

interface TransactionProps {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

interface TransactionsCotextProps {
  transactions: TransactionProps[];
  loadTransactions: () => void;
  creacteTrasaction: (transaction: TransactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

type TransactionInput = Omit<TransactionProps, "id" | "createdAt">;

export const TransactionsContext = createContext<TransactionsCotextProps>(
  {} as TransactionsCotextProps
);

export const TransactionsProvider = ({
  children,
}: TransactionsProviderProps) => {
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    api
      .get("transactions")
      .then((response) => setTransactions(response.data.transactions));
  };

  async function creacteTrasaction(transactionInput: TransactionInput) {
    const response = await api.post("/transactions", {
      ...transactionInput,
      createdAt: new Date(),
    });
    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }

  return (
    <TransactionsContext.Provider
      value={{ transactions, loadTransactions, creacteTrasaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
