import React, { useEffect, useState, useContext } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import { collection, query, where, getDocs, setDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../Firebase';

const TopSongs = () => {
  const accessToken = sessionStorage.getItem("MyAccessToken");
  const spotifyApi = new SpotifyWebApi();

  const [topSongs, setTopSongs] = useState([]);
  const [user, setUser] = useState({});
  const { currentUser } = useContext(AuthenticationContext);


  const handleSearch = async () => {
    const q = query(collection(db, 'accounts'), where('uid', '==', currentUser.uid));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    handleSearch();
  }, [currentUser.uid]);
  
  useEffect(() => {
    if (user.spotifyToken) {
      spotifyApi.setAccessToken(user.spotifyToken);
      spotifyApi
        .getMyTopTracks({ limit: 10 })
        .then(function (data) {
          console.log(data);
          let topTracks = data.items;
          console.log(topTracks);
          setTopSongs(topTracks);
        })
        .catch(function (err) {
          console.log("Something went wrong!", err);
        });
    }
  }, [user.spotifyToken]);
  

  return (
    <div>
      <h2>Top Songs</h2>
      <ul>
        
        {topSongs.map((track) => (
          <li key={track.id}>
            <img className='w-[150px] h-[150px]' src={track.album.images[0].url} alt={track.name} />

            {track.name} - {track.artists[0].name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSongs;
