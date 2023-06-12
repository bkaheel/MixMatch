import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const TopSongs = () => {
  const accessToken = sessionStorage.getItem("MyAccessToken");
  const spotifyApi = new SpotifyWebApi();

  const [topSongs, setTopSongs] = useState([]);

  useEffect(() => {
    console.log(accessToken);
    spotifyApi.setAccessToken(accessToken);

    spotifyApi
      .getMyTopTracks({ limit: 10 }) // Specify the limit to get only the top 10 tracks
      .then(function (data) {
        console.log(data);
        let topTracks = data.items;
        console.log(topTracks);
        setTopSongs(topTracks);
      })
      .catch(function (err) {
        console.log("Something went wrong!", err);
      });
  }, [accessToken]);

  return (
    <div>
      <h2>Top Songs</h2>
      <ul>
        {topSongs.map((track) => (
          <li key={track.id}>
            {track.name} - {track.artists[0].name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSongs;
