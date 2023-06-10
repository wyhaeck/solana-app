import { TransactionType } from "../../types/TransactionType";

export function sendTransactionToAPI(transaction: TransactionType) {
  const transactionData = async () => {
    const data = {
      id: transaction.id,
      type: transaction.type,
      timestamp: transaction.timestamp,
      from_acc: transaction.from_acc,
      to_acc: transaction.to_acc,
      amount: transaction.amount,
    };

    const response = await fetch("/api/database", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  };
  transactionData();
}

export async function getTransactionsFromAPI() {
  const transactionData = async () => {
    const response = await fetch("/api/database", {
      method: "GET",
    });
    return response.json();
  };
  return transactionData();
}
