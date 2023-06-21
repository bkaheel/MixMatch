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
import profile from '../assets/images/profile.png'
import ProfileView from "../components/app/friends/ProfileView";

const Friends = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [currUser, setCurrUser] = useState();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

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
  }, [currentUser]);

  useEffect(() => {
    if (currUser) {
      const friends = currUser.friends.map((friend) => friend);
      setFriends(friends);
    }
  }, [currUser]);

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

    const excludeMap = friends.map((friend) => friend.userName);

    // exclude myself and my current friends from search
    if (username !== "" && username !== currUser.userName && !excludeMap.includes(username)) {
      handleSearch();
    }
  }, [username]);

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSelect = async () => {
    try {
      // create user chats
      await updateDoc(doc(db, "accounts", currentUser.uid), {
        friends: arrayUnion(user),
      });

      await updateDoc(doc(db, "accounts", user.uid), {
        friends: arrayUnion(currUser),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const friendSelect = (friendUid) => {
    setSelectedFriend(friendUid);
  };


  return (
    <div className="px-10 py-10">
      <div className="flex flex-row justify-around">
        <div className="">
          <h3 className="text-center text-3xl font-bold italic text-textYellow">My Friends</h3>
          <ul>
            {friends.map((friend, index) => (
              <li key={index}>
                <div className="mt-5">
                  <div className="flex flex-row items-center gap-5 bg-background rounded-full w-[380px]">
                    <div className="w-[80px] h-[80px] border-4 border-textDark overflow-hidden rounded-full">
                      <img src={friend?.photoURL || profile} alt='Profile' />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-textDark">{friend?.displayName}</span>
                      <span className="text-textLight">@{friend?.userName}</span>
                    </div>
                    <button
                      className="text-white bg-blue-500 px-4 py-2 rounded-full"
                      onClick={() => setSelectedFriend(friend)}
                    >
                      Show Profile
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center gap-5">
          <h3 className="text-center text-3xl font-bold italic text-textYellow">Search for Friends</h3>
          <form>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleChange}
              className='w-[350px] h-[30px] rounded-full text-center'
            />
          </form>
          {user && (
            <div>
              <div>
                <div className="flex flex-row items-center gap-5 bg-background rounded-full w-[380px]">
                  <div className="w-[80px] h-[80px] border-4 border-textDark overflow-hidden rounded-full">
                    <img src={user.photoURL || profile} alt='Profile' />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-textDark">{user.displayName}</span>
                    <span className="text-textLight">@{user.userName}</span>
                  </div>
                  <button
                    className="text-white bg-blue-500 px-4 py-2 rounded-full"
                    onClick={handleSelect}
                  >
                    Add Friend
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    
      {selectedFriend && (
          <div className="">
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
              <button
                className=""
                onClick={() => setSelectedFriend(null)}
              >
                Close
              </button>
              <ProfileView user={selectedFriend}/>
            </div>
          </div>
        )}
    </div>
  );
};

export default Friends;
