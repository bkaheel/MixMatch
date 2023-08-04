// refresh.js

import SpotifyWebApi from 'spotify-web-api-node';
import { getDocs, updateDoc, doc } from 'firebase/firestore';

import { db } from '../src/Firebase';

export default async function handler(req, res) {

  try {

    await refreshAllTokens();
    
    console.log('Tokens refreshed successfully');

  } catch (error) {

    console.error('Error refreshing tokens:', error);

  }

  setTimeout(handler, 3600000); // call again in 1 hour

  return res.status(200).json({msg: 'Success'});

}


async function refreshAllTokens() {

  const snapshot = await getDocs(collection(db, "accounts"));

  snapshot.forEach(async (userDoc) => {

    const user = userDoc.data();
    const refreshToken = user.refreshToken;

    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:5173/callback",
        clientId: "31a74c4a34d245d8bcc83e7bed21b650",
        clientSecret: "9d292ba379844b4a8dc69ccfa60996aa",
        accessToken,
    });

    const data = await spotifyApi.refreshAccessToken();

    await updateDoc(doc(db, "accounts", user.uid), {
      accessToken: data.body.access_token 
    });

  });

}