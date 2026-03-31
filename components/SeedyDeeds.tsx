//
//
//
// This is just for seeding our database
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../app/firebase";

export default async function copy() {

  const NewData = async () => {

  const oldRef = doc(db, "Accounts", "0");
  const oldSnap = await getDoc(oldRef);

  if (!oldSnap.exists()) {
    console.error("Original document does not exist");
    return;
  }

  const data = oldSnap.data();

  // Optional: adjust fields
  // data.accountID = newId;

  //change value of x to reflect the latest data entry
  for ( var x = 0; x < 10; x++) {
    const newRef = doc(db, "Accounts", `${x}`);
    await setDoc(newRef, data);
    console.log(`Copied Account → ${x}`);
  }
  }

  return (
    <button onClick={NewData}></button>
  )
}


