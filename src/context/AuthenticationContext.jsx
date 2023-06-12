import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [uid, setUid] = useState();
  const [user, setUser] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [accessToken, setAccessToken] = useState();
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag to track initial load
  const [prevUser, setPrevUser] = useState();

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

  useEffect(() => {
    if (user && user.refreshToken && isInitialLoad) {
      console.log(user);
      const refreshTokenValue = user.refreshToken;
      console.log("REACHED REFRESH LOGIC");

      axios
        .post("http://localhost:5174/refresh", {
          refreshToken: refreshTokenValue,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          console.log("New Access Token:", res.data.accessToken);
        })
        .catch((err) => {
          console.log(err);
          console.log(accessToken);
        });
    }
  }, [user, isInitialLoad]);

  useEffect(() => {
    if (accessToken && user && isInitialLoad) {
      console.log(isInitialLoad);
      const updateFirestore = async () => {
        sessionStorage.setItem("MyAccessToken", accessToken);
        await updateDoc(doc(db, "accounts", user.uid), {
          spotifyToken: accessToken,
        });
        console.log("Updated Firestore with Access Token:", accessToken);
        
        // Refresh tokens for friends
        if (user.friends && user.friends.length > 0) {
          user.friends.forEach(async (friendUid) => {
            const friendDoc = doc(db, "accounts", friendUid);
            const friendDocSnapshot = await getDoc(friendDoc);
            if (friendDocSnapshot.exists()) {
              const friendData = friendDocSnapshot.data();
              if (friendData.refreshToken) {
                // Refresh friend's token
                const refreshToken = friendData.refreshToken;
                let accessToken = "";

                // Make the necessary API request to refresh the token for the friend
                axios
                .post("http://localhost:5174/refresh", {
                  refreshToken: refreshToken,
                })
                .then((res) => {
                  accessToken = res.data.accessToken;
                })
                .catch((err) => {
                  console.log(err);
                  console.log(accessToken);
                });





                // Update the friend's token in Firestore

                await updateDoc(doc(db, "accounts", friendData.uid), {
                  spotifyToken: accessToken,
                });
                // Handle errors appropriately
              }
            }
          });
        }
        setIsInitialLoad(true);
      };

      updateFirestore();
      const intervalId = setInterval(updateFirestore, 60 * 60 * 1000); // 1 hour in milliseconds
      return () => clearInterval(intervalId);
    }



  }, [accessToken, user, isInitialLoad]);


 

  return (
    <AuthenticationContext.Provider value={{ currentUser }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
