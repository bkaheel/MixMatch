import React, { useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { collection, query, where, getDocs, setDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import SpotifyWebApi from 'spotify-web-api-js';
import MatchView from './MatchView';
import Fade from 'react-reveal/Fade';
import profile from '../assets/images/profile.png'

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


useEffect(() => {
  const fetchFriendsAndMatchSongs = async () => {
    if (user && user.friends.length !== 0) {
      const friendss = user.friends.map(async (friend) => {
        try {
          const friendDocRef = doc(db, 'accounts', friend.uid);
          const friendDocSnapshot = await getDoc(friendDocRef);
  
          if (friendDocSnapshot.exists()) {
            const friendData = friendDocSnapshot.data();
            return friendData;
          }
        } catch (err) {
          console.log(err);
        }
      });

      const fetchedFriends = await Promise.all(friendss);
      setFriends(fetchedFriends);

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

      fetchedFriends.forEach((friend) => {
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
      const spotifyUser = new SpotifyWebApi();
      const spotifyFriend = new SpotifyWebApi();


      // Get songs from match
      const friendAccessToken = friend.spotifyToken;
      const userAccessToken = user.spotifyToken;


      const getFriendTracks = async () => {
        spotifyFriend.setAccessToken(friend.spotifyToken);
        const friendTracks = await spotifyFriend.getMyRecentlyPlayedTracks({ limit: 2 });
        return friendTracks.items.map((track) => track.track.id);
      };

      const getUserTracks = async () => {
        spotifyUser.setAccessToken(user.spotifyToken);
        const userTracks = await spotifyUser.getMyRecentlyPlayedTracks({ limit: 2 });
        return userTracks.items.map((track) => track.track.id);
      };

      const [friendTrackIDs, userTrackIDs] = await Promise.all([getFriendTracks(), getUserTracks()]);


      const combinedTrackIDs = [...friendTrackIDs, ...userTrackIDs];

      setArray(combinedTrackIDs);

      const recommendations = await spotifyApi.getRecommendations({
        seed_tracks: combinedTrackIDs,
      });

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
    <div className=' flex items-center text-center justify-center mx-52 my-5 rounded-2xl'>
      <div className=' w-2/5 rounded-lg h-screen'>
      <Fade top delay="150">
      <h3 className=' text-2xl text-white font-thin text-center mt-8 mb-14 border-2 border-textLight rounded-full py-4 '><span className='text-textYellow font-normal'>Match </span> with you Friends</h3></Fade> 
      <Fade cascade delay="500">
        <ul className='text-hoverColor space-y-9 '>
          {friends.map((friend, index) => (
            
            <li className=' pt-5 ' key={index}>
              <Fade top cascade delay="1500">
              <span className='text-hoverColor text-xl'>{friend.displayName}</span>

              <h1 className='mb-2 text-white font-light'>@{friend.userName}</h1>

              <div className='justify-center flex'><img className='w-[100px] h-[100px] rounded-lg' src={friend.photoURL || profile} /></div>
              </Fade>
              {matchSongs[friend.uid] && (
                //<Roll left cascade delay="700">
                <ul className='py-2'>
                  <li>
                  <button className=' hover:border-hoverColor hover:text-textDark mb-1 ml-2 mt-2 px-3 py-2 outline outline-2 w-[auto]  text-center rounded-full bg-textYellow text-white hover:-translate-y-3 transition-all duration-700' onClick={() => openMatchView(matchSongs[friend.uid])}>View Song Recs</button>
                  </li>
                </ul>//</Roll>
              )}
              <button className='mb-4 hover:scale-125 hover:font-light   transition-all font-thin' onClick={() => createMatch(friend)}><span className='text-sm text-white underline'>Get New Matches</span></button>
              
            </li>
            
          ))}
          
        </ul>
        </Fade>
      </div>
      <div className='p-5'>
          {isMatchViewOpen && <MatchView matches={selectedMatches} onClose={closeMatchView} />}
      </div>

    </div>
  );
};

export default Match;