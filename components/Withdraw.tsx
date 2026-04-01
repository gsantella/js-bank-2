"use client"; // Marks this as a client-side component in Next.js

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTransaction } from "@/app/context/TransactionContext";
import { db } from "../app/firebase";
import { collection, getDocs, Transaction } from "firebase/firestore"
export default function Withdraw() {

  // State to store all account fetched from API
  const [account, setAccount] = useState<any[]>([]);

  // State to store selected account ID
  const [accountID, setAccountID] = useState("");

  // State to store withdrawal amount
  const [amount, setAmount] = useState("");

  // Next.js router for navigation
  const router = useRouter();

  // storing context
  const { setTransaction } = useTransaction()

  
  // Fetch account data when component mounts
  useEffect(() => {
    const fetchAccount = async (): Promise<void> => {
      try{
        const querySnapshot = await getDocs(collection(db, "Accounts"));
        const accountList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAccount(accountList)
      } catch (err){
        console.log(err)
      }
    }
    fetchAccount();
  })

//
//
//
//

  // Function to handle withdrawal action
  const handleWithdraw = () => {
    // Validate input: must have account selected and amount > 0
    if (!accountID || Number(amount) <= 0) {
      alert("Enter valid details");
      return;
    }

    setTransaction({ account, accountID, amount, type: "withdraw"})

    // Redirect to pending page with query params
    router.push(
      `/pending`
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Withdraw Funds</h2>

      {/* Dropdown to select account */}
      <select value={accountID} onChange={(e) => setAccountID(e.target.value)}>
        <option value="">Select Account</option>

        {/* Loop through account and create options */}
        {account.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.id} (${acc.balance})
          </option>
        ))}
      </select>
      <br /><br />
      {/* Input field for withdrawal amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />
      {/* Button to trigger withdrawal */}
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
}