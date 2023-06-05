// So we know who is logged in and if or if not somebody is logged in

import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
  
    useEffect(() => {

      const unsub = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        console.log(user);
      });
  
      return () => {
        unsub();
      };
    }, [currentUser]);
  
    return (
      <AuthenticationContext.Provider value={{ currentUser }}>
        {children}
      </AuthenticationContext.Provider>
    );
  };