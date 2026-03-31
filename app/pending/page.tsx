"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTransaction } from "../context/TransactionContext";

export default function PendingPage() {
  const router = useRouter();
  const { transaction } = useTransaction();

  const accountID = transaction.accountID;
  const amount = transaction.amount;
  const type = transaction.type;

  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const processTransaction = async () => {
      // Validate
      if (!amount || !accountID || !type) {
        setStatus("error");
        setMessage("Missing transaction details.");
        return;
      }

      try {
        const transactionAmount = Number(amount);

        // Fetch account from Firestore
        const accountRef = doc(db, "Accounts", accountID);
        const accountSnap = await getDoc(accountRef);

        if (!accountSnap.exists()) {
          setStatus("error");
          setMessage("Account not found.");
          return;
        }

        const account = accountSnap.data();
        const currentBalance = Number(account.balance);
        let newBalance = currentBalance;

        // Calculate new balance
        if (type === "deposit") {
          newBalance = currentBalance + transactionAmount;
        } else if (type === "withdraw") {
          if (transactionAmount > currentBalance) {
            setStatus("error");
            setMessage("Insufficient funds.");
            return;
          }
          newBalance = currentBalance - transactionAmount;
        }

        // Update transaction history
        const updatedTransactions = [
          ...(account.transactions || []),
          {
            type,
            amount: transactionAmount,
            date: new Date().toISOString(),
          },
        ];

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Update in Firestore
        await updateDoc(accountRef, {
          balance: newBalance,
          transactions: updatedTransactions,
        });

        setStatus("success");
        setMessage(
          `${type === "deposit" ? "Deposited" : "Withdrew"} $${transactionAmount}. New balance: $${newBalance}`
        );

        setTimeout(() => {
          router.push(`/accounts/${accountID}`);
        }, 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Transaction failed.");
      }
    };

    processTransaction();
  }, [accountID, amount, type, router]);

  return (
    <div style={{ padding: 20 }}>
      {status === "processing" && (
        <>
          <h2>Processing...</h2>
          <p>Please wait</p>
        </>
      )}

      {status === "success" && (
        <>
          <h2>Success</h2>
          <p>{message}</p>
        </>
      )}

      {status === "error" && (
        <>
          <h2>Error</h2>
          <p>{message}</p>
          <button onClick={() => router.back()}>Go Back</button>
        </>
      )}
    </div>
  );
}