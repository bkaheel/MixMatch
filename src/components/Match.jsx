import React, { useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { collection, query, where, getDocs, setDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import SpotifyWebApi from 'spotify-web-api-js';

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
      const trackNames = tracs.map((track) => track.name);

      if (matchDocSnapshot.exists()) {
        await updateDoc(matchDocRef, {
          songs: trackNames,
        });
      } else {
        await setDoc(matchDocRef, {
          // Create a new match document
          songs: trackNames,
        });
      }

      setMatchSongs((prevMatchSongs) => ({
        ...prevMatchSongs,
        [friend.uid]: trackNames,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Match</h1>
      <h3>Choose a friend to match with and get recommendations based on your combined music taste</h3>
      <div>
        <h3>Select a friend</h3>
        <ul>
          {friends.map((friend, index) => (
            <li key={index}>
              <span>{friend.displayName}</span>
              <button onClick={() => createMatch(friend)}>+</button>
              {matchSongs[friend.uid] && (
                <ul>
                  {matchSongs[friend.uid].map((song, songIndex) => (
                    <li key={songIndex}>{song}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Match;
