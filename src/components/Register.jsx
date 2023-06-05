import React from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../Firebase.js'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        // This function stores new users in the Firebase. On the next page, I want to prompt users to authenticate their spotify account then update the
        // spotifyToken with that new data. This logic will be handled later. For now, this should create a new user and sign them in.
        e.preventDefault(); 


        // Pulling data from the form 
        const displayName = e.target[0].value;
        const userName = e.target[1].value;
        const email = e.target[2].value;
        const password = e.target[3].value;
      
        try {
            // Adding new user to authentication database
          const response = await createUserWithEmailAndPassword(auth, email, password);


            // Adding new user to "accounts" collection 
          await setDoc(doc(db, "accounts", response.user.uid), {
            uid: response.user.uid, 
            displayName,
            userName, 
            email, 
            friends: [],
            spotifyToken: null,
            refreshToken: null, 
            friendRequests: [],
            expiresIn: null
          });
      
        } catch (err) {
            console.log(err.message);
        }

        // After creating the new account, we go to the Spotify login page
        navigate("/spotifylogin");

    }


  return (
    <div>
        <div>
            <h1>Sign Up </h1>
        </div>
        <div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Display Name' />
                <input type='text' placeholder='User Name' />
                <input type='email' placeholder='Email' />
                <input type='password' placeholder='Password' />
                <button type='submit'> Submit </button>
            </form>
        </div>
    </div>
  )
}

export default Register