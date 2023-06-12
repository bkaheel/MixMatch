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
  const [currUser, setCurrUser] = useState();
  const [friends, setFriends] = useState([]);

  const { currentUser } = useContext(AuthenticationContext);

  useEffect(() => {
    const handleSearch = async () => {
      const q = query(collection(db, 'accounts'), where('uid', '==', currentUser.uid));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setCurrUser(doc.data());
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (currentUser) {
      handleSearch(); 
    }


  }, [currentUser])

  useEffect(() => {
    if(currUser) {
      const friends = currUser.friends.map((friend) => friend);
      setFriends(friends);

    }
    
  }, [currUser])

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
    } else {
      setUser(null); // Reset user when the input is empty
    }
  }, [username]);

  const handleChange = (e) => {
    setUsername(e.target.value);
  };


  const handleSelect = async () => {
    try {
      //create user chats
      await updateDoc(doc(db, "accounts", currentUser.uid), {
        friends: arrayUnion(user),
      });

      await updateDoc(doc(db, "accounts", user.uid), {
        friends: arrayUnion(currentUser),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h1>Friends</h1>
        </div>
        <div>
          <h3>Search for Friends</h3>
          <form>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleChange}
            />
          </form>
          {user ?
            <div>
              <div>
                <span>{user.displayName}</span>
                <span>{user.userName}</span>
                <button onClick={handleSelect}>Add Friend</button>
              </div>
            </div>
            :
            <span></span>
          }
        </div>
        <div>
          <h3>My Friends</h3>
          <ul>
          {friends.map((friend, index) => (
            <li key={index}>
              <span>{friend.displayName}</span>
            </li>
            ))} 
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Friends;
