import React, { useEffect, useState, useContext } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import { collection, query, where, getDocs, setDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../Firebase';

const TopSongs = () => {
  const spotifyApi = new SpotifyWebApi();

  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [user, setUser] = useState({});
  const { currentUser } = useContext(AuthenticationContext);
  const [token, setToken] = useState(null);


  const handleSearch = async () => {
    const q = query(collection(db, 'accounts'), where('uid', '==', currentUser.uid));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        setToken(doc.data().spotifyToken);
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
    <div>
      {
        token 
        ?
        <div className="flex flex-row gap-12 justify-around">

            <div className=" ">
              <h1 className="text-center text-2xl font-bold mt-5 text-textYellow italic">Your Top Tracks</h1>
              <div className="mt-10 mb-10 ">
        
                {topSongs.map((track) => ( 
                  <div key={track.id} className="mb-5 bg-background rounded-full py-3 pr-5 hover:-translate-y-3">
                    <div className="flex flex-row ml-5 ">
                      <img className="w-[100px] h-[100px] border-4 border-textDark rounded-full" src={track.album.images[0].url} alt={track.name} />
                      <span className="ml-5 mr-5">
                        <p className=""><span className="font-bold text-textDark">{track.name}</span> </p>
                        <span className="text-textLight">{track.artists[0].name}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    
    
            <div className="">
              <h1 className="text-center text-2xl font-bold mt-5 text-textYellow italic">Top Artists</h1>
                    <div className="grid grid-cols-3 mt-10 mb-10 gap-5">
                {topArtists.map((artist) => ( 
                  <div key={artist.id} className="bg-background rounded-full px-3 py-5 hover:-translate-y-3">
                    <div className="flex flex-col mb-5 items-center justify-around">
                      <img className="w-[150px] h-[150px] border-4 border-textDark rounded-full" src={artist.images[0].url} alt={artist.name} />
                      <span className="">
                        <p className=""><span className="font-bold text-textDark">{artist.name}</span> </p>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
    
            </div>
        </div>
        : 
        <div>
          <p1>Connect Your Spotify Account to See Your Top Tracks and Artists</p1>
        </div>

      }
    </div>


      );
};

export default TopSongs;
