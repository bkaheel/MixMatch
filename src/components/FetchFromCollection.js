import {
    collection,
    query,
    where,
    getDocs
  } from "firebase/firestore";
import { db } from "../firebase";
import React, {useState} from 'react';
  
export const FetchFromCollection = (uid) => {
  const [user, setUser] = useState(null);

  const handleSearch = async () => {
    const q = query(
      collection(db, "accounts"),
      where("uid", "===", uid)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  handleSearch();
  return user;
}
  