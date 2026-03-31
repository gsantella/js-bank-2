"use client"; // Marks this component for client-side rendering in Next.js

import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function TotalMoney() {
  const [total, setTotal] = useState<number>(0);
  const [account, setAccount] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccount = async (): Promise<void> => {
      try {
        const querySnapshot = await getDocs(collection(db, "Accounts"));
        const accountList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAccount(accountList);

        // Calculate total here after fetching
        let sum = 0;
        for (let i = 0; i < accountList.length; i++) {
          sum += Number(accountList[i].balance || 0);
        }
        setTotal(sum);
      } catch (err) {
        console.log(err);
        setTotal(0);
      }
    };

    fetchAccount();
  }, []);

  return <div style={{ fontSize: 20, marginTop: 5 }}>Total Money: ${total}</div>;
}