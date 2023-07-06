import React, { useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase';
import SpotifyWebApi from 'spotify-web-api-js';
import profile from '../../assets/images/profile.png'


const Feed = () => {
  const [userTracks, setUserTracks] = useState([]);
  const [friendsTracks, setFriendsTracks] = useState([]);
  const { currentUser } = useContext(AuthenticationContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
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

    if (currentUser) {
      handleSearch();
    }
  }, [currentUser]);

  useEffect(() => {
    // Fetch user tracks
    const fetchUserTracks = async () => {
      if (user && user.spotifyToken) {
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(user.spotifyToken);

        try {
          const userRecentlyPlayed = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 10 });
          const tracksWithUser = userRecentlyPlayed.items.map((track) => ({
            ...track,
            userUid: currentUser.uid,
            userDisplayName: user.displayName,
            profilePhoto: user.photoURL,
            artwork: track.track.album.images[0].url,

          }));
          setUserTracks(tracksWithUser);
        } catch (err) {
          console.log(err);
        }
      }
    };

    if (user) {
      fetchUserTracks();
    }
  }, [user]);

  useEffect(() => {
    // Fetch friend tracks
    const fetchFriendsTracks = async () => {
      if (user && user.spotifyToken) {
        const q = query(collection(db, 'accounts'), where('uid', '!=', user.uid));

        try {
          const querySnapshot = await getDocs(q);
          const friends = [];
          const hold = user.friends;
          const arr = hold.map((friend) => friend.uid);

          querySnapshot.forEach((doc) => {
            const friend = doc.data();
            if (arr.includes(friend.uid)) {
              friends.push(friend);
            }
          });

          const spotifyApi = new SpotifyWebApi();

          const fetchFriendRecentlyPlayedTracks = async (friend) => {
            spotifyApi.setAccessToken(friend.spotifyToken);
            const friendRecentlyPlayed = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 10 });
            const tracksWithUser = friendRecentlyPlayed.items.map((track) => ({
              ...track,
              userUid: friend.uid,
              userDisplayName: friend.displayName,
              artwork: track.track.album.images[0].url,
            }));
            return {
              friendUid: friend.uid,
              tracks: tracksWithUser,
            };
          };

          const friendTracksPromises = friends.map((friend) => fetchFriendRecentlyPlayedTracks(friend));
          const friendTracksResults = await Promise.all(friendTracksPromises);
          setFriendsTracks(friendTracksResults);
        } catch (err) {
          console.log(err);
        }
      }
    };

    if (user) {
      fetchFriendsTracks();
    }
  }, [user]);

  // Sort tracks in descending order based on the listened_at timestamp
  const sortedTracks = [...userTracks, ...friendsTracks.flatMap((friend) => friend.tracks)].sort(
    (a, b) => new Date(b.played_at) - new Date(a.played_at)
  );

  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const listenedAt = new Date(timestamp);
    const timeDifference = now - listenedAt;
    const minutes = Math.floor(timeDifference / 1000 / 60);

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes === 1) {
      return '1 minute ago';
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
  };

  return (
    <div className=' gap-8'>
      <div className='flex justify-center'>
        <h1 className=' mt-8 px-3 py-3 border-2 rounded-3xl -mb-16 border-textLight font-thin text-center text-sm text-white '>See What Your Friends Are Listening To</h1>
      </div>
        <ul className=' flex flex-col items-center justify-center text-center '>
          {sortedTracks.map((track) => (
                <li className='' key={track.played_at}>
                  
                <div className='flex flex-col h-screen justify-center '>
                <div className=''>
                  {track.artwork && (
                  <img className='w-[450px] h-[450px] border-transparent rounded-2xl hover:shadow-2xl hover:shadow-black transition-all' src={track.artwork} alt='Album Artwork' />
                )}
                </div>

                <div className=' hover:font-bold hover:translate-y-3 transition-all mt-5'>
                  <div className=' text-3xl text-textLight'>{track.track.name} </div> 
                  <div className='text-xl  text-textYellow mb-5'>{track.track.artists[0].name}</div>
                    <div className='text-sm font-thin text-yellow-600 '>
                      <div className='flex flex-row items-center gap-4 justify-center '>
                        <img className='w-[30px] h-[30px] rounded-full' src={track.profilePhoto || profile}/>
                        <div className='text-lg text-textLight'>{track.userUid === currentUser.uid ? 'You' : track.userDisplayName}</div>
                      </div>
                      <div className='mt-3 text-textLight'>{getTimeDifference(track.played_at)}</div>
                  </div>
                </div>

              </div>
              
              
              </li>
          ))}
        </ul>
      </div>
  );
};

export default Feed;