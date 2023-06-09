// Allows users to log out 
// [Future Update] change spotify auth

import React from 'react'
import { auth } from "../firebase"
import { signOut } from 'firebase/auth'
import SpotifyLogin from './SpotifyLogin'

const Settings = () => {
    const handleSubmit = () => {
        signOut(auth).then(() => {
            console.log("Signed out");
        }).catch((error) => {
            console.log("something went wrong.");
        });
        }
    
  return (
    <div>
        <h1>
            Settings
        </h1>
        <div>
            <h3>Connect Your Spotify Account</h3>
            <SpotifyLogin />
        </div>
        <div>
            <button onClick={handleSubmit}> Log Out </button>
        </div>
    </div>
  )
}

export default Settings