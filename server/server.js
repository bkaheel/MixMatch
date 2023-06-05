import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
import bodyParser from 'body-parser';
import refresh from './refresh.js'


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post("/refresh", (req, res) => {
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
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  })


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


app.listen(5174);


const runRefresh = async () => {
  try {
    await refresh();
    runRefresh(); // Call the function again for continuous execution
  } catch (error) {
    console.log('An error occurred:', error);
    // Handle the error or stop the continuous execution as needed
  }
};

// Start the continuous execution
runRefresh();