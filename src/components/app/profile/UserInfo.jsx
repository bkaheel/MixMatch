import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../../context/AuthenticationContext';
import { FetchFromCollection } from '../../FetchFromCollection';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase";

const UserInfo = () => {
  const { currentUser } = useContext(AuthenticationContext);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

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


  return (
      <div className='pb-10 pt-5'>
        {user ?
        <div className='pl-10'> 

            <h1 className='text-4xl font-bold text-yellow-600'>{user.displayName}</h1>
           <h3 className='text-xl'>@{user.userName}</h3>
  
        </div>
        : <h1>Loading...</h1>}
      </div>
    );
        }

export default UserInfo;
