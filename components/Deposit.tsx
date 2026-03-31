"use client"; // Enables client-side rendering in Next.js

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../app/firebase";
import { collection, getDocs } from "firebase/firestore"
import { useTransaction } from "@/app/context/TransactionContext";

export default function DepositBox() {

  // Holds list of account fetched from API
  const [account, setAccount] = useState<any[]>([]);

  // Stores selected account ID from dropdown
  const [accountID, setAccountID] = useState("");

  // Stores deposit amount entered by user
  const [amount, setAmount] = useState("");

  // Router used for navigating between pages
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

/*    
    fetch("https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account")
      .then((res) => res.json()) // Convert response to JSON
      .then((data) => setAccount(data)); // Save data into state
  }, []); // Runs only once
*/

  // Handles deposit button click
  const handleDeposit = () => {
    // Basic validation: account must be selected and amount must be positive
    if (!accountID || Number(amount) <= 0) {
      alert("Enter valid details");
      return;
    }

    setTransaction({ account, accountID, amount, type: "deposit"})

    // Navigate to pending page with deposit details
    router.push('/pending');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Deposit Funds</h2>

      {/* Dropdown for selecting an account */}
      <select value={accountID} onChange={(e) => setAccountID(e.target.value)}>
        <option value="">Select Account</option>

        {/* Render each account as an option */}
        {account.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.id} (${acc.balance})
          </option>
        ))}
      </select>

      <br /><br />

      {/* Input field for deposit amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      {/* Button to trigger deposit action */}
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
}