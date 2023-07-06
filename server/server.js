import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db } from '../src/Firebase.js';
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";



const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:5173/callback",
        clientId: "31a74c4a34d245d8bcc83e7bed21b650",
        clientSecret: "9d292ba379844b4a8dc69ccfa60996aa",
      refreshToken,
    })
  
    spotifyApi
      .refreshAccessToken()
      .then(data => {
        res.json({
          accessToken: data.body.access_token,
          expiresIn: data.body.expiresIn,
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  })

  app.post("/profile", (req, res) => {
    const accessToken = req.body.accessToken
      const spotifyApi = new SpotifyWebApi({
          redirectUri: "http://localhost:5173/callback",
          clientId: "31a74c4a34d245d8bcc83e7bed21b650",
          clientSecret: "9d292ba379844b4a8dc69ccfa60996aa",
          accessToken,
      })
    
      spotifyApi
        .getMyTopTracks()
        .then(data => {
          res.json({
            raw: data
          })
        })
        .catch(err => {
          console.log(err)
          res.sendStatus(400)
        })
    })

  app.post("/top-songs", (req, res) => {
    const accessToken = req.body.accessToken;
    
    const spotifyApi = new SpotifyWebApi({
      redirectUri: "http://localhost:5173/callback",
      clientId: "31a74c4a34d245d8bcc83e7bed21b650",
      clientSecret: "9d292ba379844b4a8dc69ccfa60996aa",
      accessToken,
    });
    
    spotifyApi.getMyTopTracks()
      .then(data => {
        const songs = data.items.map(item => ({
          name: item.name,
          artists: item.artists.map(artist => artist.name).join(", "),
        }));
  
        res.json({
          songs,
        });
      })
      .catch(err => {
        console.log("HEEE");
        console.log(err);
        res.sendStatus(400);
      });
  });
  

app.post("/login", (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
      redirectUri: "http://localhost:5173/callback",
      clientId: "31a74c4a34d245d8bcc83e7bed21b650",
      clientSecret: "9d292ba379844b4a8dc69ccfa60996aa",
    })
    spotifyApi.authorizationCodeGrant(code).then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
        console.log(err)
      res.sendStatus(400)
    })
})

const refreshUserTokens = async () => {
  // Loops through users in database and refreshes all access tokens

  const usersRef = query(collection(db, "accounts"));
  const snapshot = await getDocs(usersRef);

  snapshot.forEach(async (u) => {
    const user = u.data();
    const refreshToken = user.refreshToken;
    console.log(refreshToken);
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:5173/callback",
        clientId: "31a74c4a34d245d8bcc83e7bed21b650",
        clientSecret: "9d292ba379844b4a8dc69ccfa60996aa",
        refreshToken,
    })

    try {
      if(refreshToken) {
        spotifyApi
          .refreshAccessToken()
          .then(data => {
            updateDoc(doc(db, "accounts", user.uid), {
              spotifyToken: data.body.access_token,
            });
          })
          .catch(err => {
            console.log(err)
        })
      }

    } catch (err) {
      console.log(err);
    }
  });
};

setInterval(refreshUserTokens, 60 * 45 * 1000); 


app.listen(5174);