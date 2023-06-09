// Daily Match Feature
// Everyday, users get a list of song reccomendations based on their own and a friend's music taste
// 1. Create a match form (select a friend to match with from your list of friends)
// 2. Match is added to matches collection in firebase
// 3. Match function is ran taking in user id of current user and friend selected

import React, {useState, useEffect, useContext} from 'react'
import { AuthenticationContext } from './context/AuthenticationContext'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";



const Match = () => {
    const [friends, setFriends] = useState();
    const { currentUser } = useContext(AuthenticationContext);
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [friend, setFriend] = useState(null);

    useEffect(() => {
      if (currentUser) {
        setUsername(currentUser.uid);
      }
    }, [currentUser]);
  
    useEffect(() => {
      const handleSearch = async () => {
        const q = query(collection(db, "accounts"), where("uid", "==", username));
  
        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUser(doc.data());
          });
        } catch (err) {
          console.log(err);
        }
      };
  
      if (username !== "") {
        handleSearch();
      }
    }, [username]);

    const handleSelect = () => {

    }


  return (
    <div>
        <h1>Match</h1>
        <h3>Choose a friend to match with and get recommndations based on your combined music taste once a day everyday.</h3>
        <div>
            <h3> Select a friend </h3>
            <ul>

            </ul>
        </div>
        <div>
            <h3> My Matches </h3>
        </div>
    </div>
  )
}

export default Match