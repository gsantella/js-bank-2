"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../app/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";


export default function History() {
  const router = useRouter(); // navigation
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadAllTransactions = async () => {
            
      const querySnapshot = await getDocs(collection(db, "Accounts"));
      const accountList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
        setAccounts(accountList)

        // combine transactions
      const allTransactions = accountList.flatMap((Accounts: any) =>
          (Accounts.transactions || []).map((t: any) => ({
            ...t,
            accountId: Accounts.id,
          }))
        );

        // sort newest first
        allTransactions.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(allTransactions);
      } 

    loadAllTransactions();
    console.log(transactions)
  }, []);

  // filter transfers
  const transferTransactions = transactions.filter(
    (t) =>
      t.type === "transfer" ||
      t.type === "transfer-in" ||
      t.type === "transfer-out"
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>All Transactions</h2>

      {(
        <>
          <h3>Transfer History</h3>
          <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
            <ul>
              {transferTransactions.map((t, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <strong>{t.type.toUpperCase()}</strong> — ${t.amount} <br />
                  Account: {t.accountId} <br />
                  Date: {new Date(t.date).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* all activity with scroll */}
      {(
        <>
          <h3>All Activity</h3>
          <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
            <ul>
              {transactions.map((t, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <strong>{t.type.toUpperCase()}</strong> — ${t.amount} <br />
                  Account: {t.accountId} <br />
                  Date: {new Date(t.date).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}