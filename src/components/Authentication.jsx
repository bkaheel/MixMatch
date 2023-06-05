import React from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword  } from 'firebase/auth'
import { auth, db } from '../Firebase.js'
import { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import SpotifyWebApi from 'spotify-web-api-js';


const Authentication = () => {

  const spotifyApi = new SpotifyWebApi();
  const [user, setUser] = useState({});


    const [err, setErr] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => { 
      const hash = window.location.hash;
      let token = window.localStorage.getItem("token");

      if (hash && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
          window.location.hash = "";
          window.localStorage.setItem("token", token);
      }

      setToken(token)
    }, []);

function genRandonString(length) {
   var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
   var charLength = chars.length;
   var result = '';
   for ( var i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
   }
   return result;
}

    const handleLogin = () => {
      console.log("button clicked");
      const clientId = '31a74c4a34d245d8bcc83e7bed21b650';
      const redirectUri = 'http://localhost:5173/'; // This should be a valid redirect URI registered in your Spotify Developer Dashboard
      
      // Set the authentication parameters
      const scopes = ['user-read-private', 'user-read-email']; // Add any additional required scopes
      const state = genRandonString(16); // Helper function to generate a random state value
  
      // Store the state value in localStorage
      localStorage.setItem('spotify_auth_state', state);
  
      // Redirect the user to the Spotify Accounts Service
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&response_type=token&state=${encodeURIComponent(state)}`;
    };


    



    const handleSubmit = async (event) => {
        event.preventDefault();
      
        const displayName = event.target[0].value;
        const userName = event.target[1].value;
        const email = event.target[2].value;
        const password = event.target[3].value;
      
        try {
          const response = await createUserWithEmailAndPassword(auth, email, password);
      
          await setDoc(doc(db, "accounts", response.user.uid), {
            uid: response.user.uid, 
            displayName,
            userName, 
            email, 
            friends: [],
            spotifyAccount: token  
          });
      
        } catch (err) {
          setErr(true);
        }
      }

    const handleSignin = async (event) => {
      event.preventDefault();



      const email = event.target[0].value;
      const password = event.target[1].value;

      try {

        const response = await signInWithEmailAndPassword(auth, email, password);
        const searchQuery = collectionRef.where('uid', '==', response.user.uid);

        setUser(searchQuery);
        console.log(searchQuery.uid);
        
      } catch (err) {
        console.log(err.message);
      }
    }

    const handleLogout = async () => {
      try {
        await auth().signOut();
        // Handle successful logout or navigate to a new page
      } catch (error) {
        // Handle logout error
      }
    };
      



  return (
    <div>
    <div>
      <h1>Sign Up </h1>
        <form onSubmit={handleSubmit}>
            <input type='text' placeholder='Display Name'/>
            <input type='text' placeholder='Username'/>
            <input type='email' placeholder='email'/>
            <input type='password' placeholder='Password'/>
            <button type='submit'> Sign Up </button>
            {err && <span> something aint work cuh </span>}
        </form>
        <button onClick={handleLogin}> Spotify </button>

    </div>
    <div>
      <h1> Log In </h1>
      <form onSubmit={handleSignin}>
      <input type='email' placeholder='email'/>
            <input type='password' placeholder='Password'/>
            <button type='submit'> Log In </button>
      </form>
    </div>
    </div>
  )
}

export default Authentication

// I need to pass the token to the user for the collection accounts how?
// authenticate with spotify and get a token how?