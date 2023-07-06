import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import React, { useState, useEffect } from 'react';

export const FetchFromCollection = ( code ) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const handleSearch = async () => {
      const q = query(
        collection(db, "accounts"),
        where("uid", "==", code.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (err) {
        console.log(err);
      }
    };

    if(code) {
         handleSearch(); 
    }


  }, [code]);

  if (user) {
    return user;
  }

};
