// refresh.js

const { default: SpotifyWebApi } = require('spotify-web-api-node'); 
const { collection, getDocs, updateDoc, doc } = require('firebase/firestore');
const { db } = require('../src/Firebase');

export default async (req, res) => {

  const usersRef = collection(db, "accounts");
  
  const snapshot = await getDocs(usersRef);

  snapshot.forEach(async (userDoc) => {

    const user = userDoc.data();
    const refreshToken = user.refreshToken;

    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:5173/callback",
        clientId: "31a74c4a34d245d8bcc83e7bed21b650",
        clientSecret: "9d292ba379844b4a8dc69ccfa60996aa",
        refreshToken,
    });

    const data = await spotifyApi.refreshAccessToken();
    
    await updateDoc(doc(db, "accounts", user.uid), {
      accessToken: data.body.access_token 
    });

  });

  res.status(200).json({ message: 'Tokens refreshed!' });

};