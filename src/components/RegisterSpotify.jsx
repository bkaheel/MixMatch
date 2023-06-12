import React from 'react'


const RegisterSpotify = () => {

  const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=31a74c4a34d245d8bcc83e7bed21b650&response_type=code&redirect_uri=http://localhost:5173/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-top-read%20user-read-recently-played%20user-modify-playback-state"

  return (
    <div>
      <div>
        <div>
          {
            // Going to Spotify
          }
          <a href={AUTH_URL}> Connect </a>
        </div>
      </div>
    </div>
  )
}

export default RegisterSpotify