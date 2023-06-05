// Needs refactoring

import React, { useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthenticationContext } from "../context/AuthenticationContext";
import { useCollectionData } from 'react-firebase-hooks/firestore';



const Friends = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthenticationContext);

  useEffect(() => {
    const handleSearch = async () => {
      const q = query(collection(db, "accounts"), where("userName", "==", username));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (err) {
        setErr(true);
      }
    };

    if (username !== "") {
      handleSearch();
    }
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputUsername = e.target[0].value;
    setUsername(inputUsername);
  };

  const handleSelect = async () => {
    try {
      //create user chats
      await updateDoc(doc(db, "accounts", currentUser.uid), {
        friends: arrayUnion(user.uid),
      });

      await updateDoc(doc(db, "accounts", user.uid), {
        friends: arrayUnion(currentUser.uid),
      });
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div>
      <div>
        <div>
          <h1> Friends </h1>
        </div>
        <div>
          <h3>Search for Friends </h3>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" />
            <button type="submit">Search</button>
          </form>
          <div>
            {user ? (
              <div>
                <span> {user.displayName} </span>
                <span> {user.userName} </span>
                <button onClick={handleSelect}> Add Friend </button>
              </div>
            ) : (
              <p>User Not Found</p>
            )}
          </div>
        </div>
        <div>
          <h3> My Friends </h3>
          <ul>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Friends;
