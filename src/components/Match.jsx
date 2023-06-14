import React, { useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { collection, query, where, getDocs, setDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import SpotifyWebApi from 'spotify-web-api-js';
import MatchView from './MatchView';

const Match = () => {
  const [friends, setFriends] = useState([]);
  const { currentUser } = useContext(AuthenticationContext);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const spotifyApi = new SpotifyWebApi();
  const [array, setArray] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [matchSongs, setMatchSongs] = useState({});

  // Get current user uid
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.uid);
    }
  }, [currentUser]);

  // Fetch current user from users collection
  useEffect(() => {
    const handleSearch = async () => {
      const q = query(collection(db, 'accounts'), where('uid', '==', username));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (username !== '') {
      handleSearch();
    }
  }, [username]);

  // Fetch current user's friends list and check for match songs
  useEffect(() => {
    const fetchFriendsAndMatchSongs = async () => {
      if (user && user.friends.length !== 0) {
        const friends = user.friends.map((friend) => friend);
        setFriends(friends);

        const fetchMatchSongs = async (friendUid) => {
          try {
            const matchDocRef = doc(db, 'matches', username, 'friends', friendUid);
            const matchDocSnapshot = await getDoc(matchDocRef);

            if (matchDocSnapshot.exists()) {
              const matchData = matchDocSnapshot.data();
              setMatchSongs((prevMatchSongs) => ({
                ...prevMatchSongs,
                [friendUid]: matchData.songs || [],
              }));
            } else {
              setMatchSongs((prevMatchSongs) => ({
                ...prevMatchSongs,
                [friendUid]: [],
              }));
            }
          } catch (err) {
            console.log(err);
          }
        };

        friends.forEach((friend) => {
          fetchMatchSongs(friend.uid);
        });
      }
    };

    fetchFriendsAndMatchSongs();
  }, [user, username]);

  const createMatch = async (friend) => {
    try {
      // Create user matches
      const matchDocRef = doc(db, 'matches', username, 'friends', friend.uid);
      const matchDocSnapshot = await getDoc(matchDocRef);

      // Get songs from match
      const friendAccessToken = friend.spotifyToken;
      const userAccessToken = user.spotifyToken;

      const getFriendTracks = async () => {
        await spotifyApi.setAccessToken(friendAccessToken);
        const friendTracks = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 2 });
        return friendTracks.items.map((track) => track.track.id);
      };

      const getUserTracks = async () => {
        await spotifyApi.setAccessToken(userAccessToken);
        const userTracks = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 2 });
        return userTracks.items.map((track) => track.track.id);
      };

      const [friendTrackIDs, userTrackIDs] = await Promise.all([getFriendTracks(), getUserTracks()]);

      const combinedTrackIDs = [...friendTrackIDs, ...userTrackIDs];

      console.log(combinedTrackIDs);
      setArray(combinedTrackIDs);

      const recommendations = await spotifyApi.getRecommendations({
        seed_tracks: combinedTrackIDs,
      });

      console.log(recommendations.tracks);
      const tracs = recommendations.tracks;
      const trackInfo = tracs.map((track) => ({
        name: track.name,
        artwork: track.album.images[0].url, // Assuming the first image in the array represents the artwork
      }));

      if (matchDocSnapshot.exists()) {
        await updateDoc(matchDocRef, {
          songs: trackInfo,
        });
      } else {
        await setDoc(matchDocRef, {
          // Create a new match document
          songs: trackInfo,
        });
      }

      setTracks(trackInfo);

      setMatchSongs((prevMatchSongs) => ({
        ...prevMatchSongs,
        [friend.uid]: trackInfo,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const [isMatchViewOpen, setIsMatchViewOpen] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState([]);

  const openMatchView = (matches) => {
    setSelectedMatches(matches);
    setIsMatchViewOpen(true);
  };

  const closeMatchView = () => {
    setIsMatchViewOpen(false);
  };

  return (
    <div>
      <div className='bg-slate-200 rounded-lg w-[500px] h-screen'>
        <h3 className='font-thin pb-10'>Your Friends</h3>
        <ul className=''>
          {friends.map((friend, index) => (
            <li className='outline outline-5 rounded-lg mb-5' key={index}>
              <span>{friend.displayName}</span>

              <h1>@{friend.userName}</h1>
              <button onClick={() => createMatch(friend)}><span className='text-sm text-slate-600 underline'>Get New Matches</span></button>
              {matchSongs[friend.uid] && (
                <ul>
                  <li>
                    <button className='mb-2 ml-2 mt-2 px-2 outline outline-2 w-[auto] h-[30px] text-center rounded-full hover:bg-yellow-600 hover:-translate-y-2' onClick={() => openMatchView(matchSongs[friend.uid])}>View Song Recs</button>
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className='p-5'>
          {isMatchViewOpen && <MatchView matches={selectedMatches} onClose={closeMatchView} />}
      </div>

    </div>
  );
};

export default Match;
