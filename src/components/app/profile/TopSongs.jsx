import React, { useEffect, useState, useContext } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import { collection, query, where, getDocs, setDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../Firebase';

const TopSongs = () => {
  const accessToken = sessionStorage.getItem("MyAccessToken");
  const spotifyApi = new SpotifyWebApi();

  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
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

  useEffect(() => {
    if (user.spotifyToken) {
      spotifyApi
        .getMyTopArtists({limit: 15})
        .then(function (data) {
          console.log(data);
          let topArtists = data.items;
          console.log(topArtists);
          setTopArtists(topArtists);
        })
        .catch(function (err) {
          console.log("Something went wrong!", err);
        });
    }

  }, [user.spotifyToken]);
  

  return (
    <div className="flex flex-row gap-12">
        <div className="pl-10  items-left">
          <h2 className="text-yellow-600 font-thin">Your Most Listened to Tracks</h2>
          <div className="">
    
            {topSongs.map((track) => ( 
              <div key={track.id} className="mt-4 rounded-xl outline outline-yellow-600 outline-5 w-[450px] ">
                <div className="flex flex-row ml-5 py-2">
                  <img className="w-[100px] h-[100px] border-4 border-yellow-600 rounded-full" src={track.album.images[0].url} alt={track.name} />
                  <span className="ml-5 mr-5">
                    <p className=""><span className="font-bold">{track.name}</span> </p>
                    <span className="">{track.artists[0].name}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-row">
          <h2 className="font-thin text-yellow-600 text-center">Your Favorite Artists </h2>

                <div className="grid grid-cols-3">
    
            {topArtists.map((artist) => ( 
              <div key={artist.id} className="">
                <div className="flex flex-col ml-5 py-2 items-center">
                  <img className="w-[200px] h-[200px] border-4 border-yellow-600 rounded-full" src={artist.images[0].url} alt={artist.name} />
                  <span className="ml-5 mr-5">
                    <p className=""><span className="font-bold">{artist.name}</span> </p>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
    </div>
      );
};

export default TopSongs;
