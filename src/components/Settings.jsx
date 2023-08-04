// Allows users to log out 
// [Future Update] change spotify auth

import React from 'react'
import { auth } from "../Firebase"
import { signOut } from 'firebase/auth'

const Settings = () => {

  const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=31a74c4a34d245d8bcc83e7bed21b650&response_type=code&redirect_uri=https://mix-match-zvzf.vercel.app/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-top-read%20user-read-recently-played%20user-modify-playback-state"
    const handleSubmit = () => {
        signOut(auth).then(() => {
            console.log("Signed out");
        }).catch((error) => {
            console.log("something went wrong.");
        });
        }
    
  return (
    <div className='px-5 py-5 flex flex-col'>
        <h1 className='text-4xl font-bold text-textYellow'>
            Settings
        </h1>
        <div className=''>
        <div className='bg-textYellow py-3 px-8 rounded-full text-textDark flex justify-center mt-10'>
          {
            // Going to Spotify
          }
          <a className='' href={AUTH_URL}> Connect to Spotify </a>
        </div>
        </div>
        <div className='bg-textYellow py-3 px-8 rounded-full text-textDark flex justify-center mt-10'>
            <button onClick={handleSubmit}> Log Out </button>
        </div>
    </div>
  )
}

export default Settings