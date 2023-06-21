import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../../context/AuthenticationContext';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase";
import profile from '../../../assets/images/profile.png'

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
      <div className=''>
        {user ?
        <div className='pl-10 flex flex-row gap-20 items-center'> 
          <div className='w-[180px] h-[180px] overflow-hidden rounded-full border-4 border-textYellow'>
            <img src={user.photoURL || profile} alt='Profile' /> 
            <input className='hidden' type="file" id="file" />

          </div>
          <div>
            <h1 className='text-6xl font-bold text-textYellow'>{user.displayName}</h1>
            <h3 className='text-2xl text-textLight'>@{user.userName}</h3>
          </div>

        </div>
        : <h1>Loading...</h1>}
      </div>
    );
        }

export default UserInfo;
