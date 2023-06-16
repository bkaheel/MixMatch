// Navigation options: Profile, Feed, Settings, Friends

import React, {useState} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {CgFeed} from 'react-icons/cg'
import {FaUserFriends} from 'react-icons/fa'
import {BsFillFilePersonFill} from 'react-icons/bs'
import {BsLink45Deg} from 'react-icons/bs'
import {IoIosSettings} from 'react-icons/io'

const Navigation = () => {
    const navigate = useNavigate();

    const [feed, setFeed] = useState(true);
    const [friends, setFriends] = useState(false);
    const [profile, setProfile] = useState(false);
    const [match, setMatch] = useState(false);
    const [settings, setSettings] = useState(false);

    const handleFeed = () => {
      setFeed(true);
      setFriends(false);
      setProfile(false);
      setMatch(false);
      setSettings(false);

      navigate('/app');
    }

    const handleFriends = () => {
      setFeed(false);
      setFriends(true);
      setProfile(false);
      setMatch(false);
      setSettings(false);

      navigate('/app/friends');
    }

    const handleProfile = () => {
      setFeed(false);
      setFriends(false);
      setProfile(true);
      setMatch(false);
      setSettings(false);

      navigate('/app/profile');
    }

    const handleMatch = () => {
      setFeed(false);
      setFriends(false);
      setProfile(false);
      setMatch(true);
      setSettings(false);

      navigate('/app/match');
    }

    const handleSettings = () => {
      setFeed(false);
      setFriends(false);
      setProfile(false);
      setMatch(false);
      setSettings(true);

      navigate('/app/settings');
    }



  return (
    <div className='flex flex-col'>   
        <div className='flex flex-col ml-5 mt-16 font-bold gap-10'>

        <a 
        className={`${feed
          ? 'flex items-center justify-center bg-yellow-600 rounded-full w-[50px] h-[50px] text-white cursor-pointer'
          : 'flex items-center justify-center rounded-full w-[50px] h-[50px] hover:text-yellow-600 cursor-pointer' }`}
        onClick={() => handleFeed()}> <CgFeed className='text-3xl text-center'/> </a> 
        <a
        className={`${friends
          ? 'flex items-center justify-center bg-yellow-600 rounded-full w-[50px] h-[50px] text-white cursor-pointer'
          : 'flex items-center justify-center rounded-full w-[50px] h-[50px] hover:text-yellow-600 cursor-pointer' }`} 
        onClick={() => handleFriends()}> <FaUserFriends className='text-3xl text-center'/> </a> 
        <a 
        className={`${profile
          ? 'flex items-center justify-center bg-yellow-600 rounded-full w-[50px] h-[50px] text-white cursor-pointer'
          : 'flex items-center justify-center rounded-full w-[50px] h-[50px] hover:text-yellow-600 cursor-pointer' }`}
        onClick={() => handleProfile()}> <BsFillFilePersonFill className='text-3xl text-center'/> </a>
        <a 
                className={`${match
                  ? 'flex items-center justify-center bg-yellow-600 rounded-full w-[50px] h-[50px] text-white cursor-pointer'
                  : 'flex items-center justify-center rounded-full w-[50px] h-[50px] hover:text-yellow-600 cursor-pointer' }`}
        
        onClick={() => handleMatch()}> <BsLink45Deg className='text-3xl text-center'/> </a> 
        </div>
        <div className='flex ml-5 items-end mt-[300px] font-bold'>
        <a
                className={`${settings
                  ? 'flex items-center justify-center bg-yellow-600 rounded-full w-[50px] h-[50px] text-white cursor-pointer'
                  : 'flex items-center justify-center rounded-full w-[50px] h-[50px] hover:text-yellow-600 cursor-pointer' }`}
        
        onClick={() => handleSettings()}> <IoIosSettings className='text-3xl text-center'/> </a>
        </div>

     </div>
  )
}

export default Navigation