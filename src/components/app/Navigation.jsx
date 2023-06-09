// Navigation options: Profile, Feed, Settings, Friends

import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const Navigation = () => {
    const navigate = useNavigate();
  return (
    <div>   
        <span>MixMatch</span>

        <a onClick={() => navigate("/app")}> Feed </a> 
        <a onClick={() => navigate("/app/friends")}> Friends </a> 
        <a onClick={() => navigate("/app/profile")}> Profile </a> 
        <a onClick={() => navigate("/app/settings")}> Settings </a> 

     </div>
  )
}

export default Navigation