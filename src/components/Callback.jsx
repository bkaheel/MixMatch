import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth'
import {
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthenticationContext } from '../context/AuthenticationContext';
import { async } from '@firebase/util';




const Callback = () => {

  const { currentUser } = useContext(AuthenticationContext);


  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const code = new URLSearchParams(window.location.search).get('code');
  const accessToken = useAuth(code);
  sessionStorage.setItem("MyAccessToken", accessToken);


  if(accessToken) {
    (async () => {
      try {
        localStorage.setItem("ytirf", accessToken);
        const washingtonRef = doc(db, "accounts", currentUser.uid);
        await updateDoc(washingtonRef, {
          spotifyToken: accessToken,
          refreshToken: localStorage.getItem("RefreshCheck"),
          expiresIn: localStorage.getItem("Expiring")
        });
        setLoading(false);
        navigate('/app/settings');
      } catch (error) {
        console.log(error);
      }
    })();
  }

  return (
    <div>
      {

          loading ? <div> Loading... </div> : <div> </div>
        
      }
    </div>
  );
};

export default Callback;
