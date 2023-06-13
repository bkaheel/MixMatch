import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-js";


export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [uid, setUid] = useState();
  const [user, setUser] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [accessToken, setAccessToken] = useState();
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag to track initial load
  const [prevUser, setPrevUser] = useState();

  const refresh = async (refreshToken, uid) => {

    axios
        .post("http://localhost:5174/refresh", {
          refreshToken: refreshToken,
        })
        .then(async (res) => {
          console.log(res);

          await updateDoc(doc(db, "accounts", uid), {
            spotifyToken: res.data.accessToken,
          });
        })
        .catch((err) => {
          console.log(err);
          console.log(accessToken);
        });


    
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user !== currentUser) {
        setIsInitialLoad(true);
      } else {
        setIsInitialLoad(false);
      }
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  }, [user, currentUser]);

  useEffect(() => {
    if (currentUser) {
      setUid(currentUser.uid);
    }
  }, [currentUser]);

  useEffect(() => {
    if (uid) {
      const handleSearch = async () => {
        const q = query(collection(db, "accounts"), where("uid", "==", uid));

        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUser(doc.data());
            console.log(doc.data());
          });
        } catch (err) {
          setErr(true);
        }
      };

      handleSearch();
    }
  }, [uid]);

  useEffect( () => {
    console.log("outside logic");

    const logic = async () => {

      console.log("inside logic");
      refresh(user.refreshToken, user.uid);

      // for friends 

      const q = query(collection(db, 'accounts'), where('uid', '!=', user.uid));
    
      try {
        const querySnapshot = await getDocs(q);
        const friends = [];
        const hold = user.friends;
        const arr = hold.map((friend) => friend.uid);
        console.log("arr");
        console.log(arr);

  
        querySnapshot.forEach((doc) => {
          const friend = doc.data();
          if (arr.includes(friend.uid)) {
            refresh(friend.refreshToken, friend.uid);
          }
        });


      } catch (err) {
        console.log(err);
      }


  }

        let intervalId = null;

        if (user && isInitialLoad) {
          console.log("inside if logic");
          logic();
          intervalId = setInterval(logic, 60 * 60 * 1000); // Run logic every hour
        }

        return () => {
          if (intervalId) {
            clearInterval(intervalId); // Clean up the interval on component unmount
          }
        };


  }, [user, isInitialLoad]);

  return (
    <AuthenticationContext.Provider value={{ currentUser }}>
      {children}
    </AuthenticationContext.Provider>
  );
};