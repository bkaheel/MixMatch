import React, { useEffect, useState, useContext } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import profile from '../../../assets/images/profile.png';

const ProfileView = ({ user }) => {


  return (
    <div className="flex flex-col items-center justify-center overflow-y-auto h-screen bg-black bg-opacity-50">
      <div className="flex flex-row gap-2 items-center max-h-screen">
        <div className="w-[80px] h-[80px] overflow-hidden rounded-full border-4 border-textYellow">
          <img src={user.photoURL || profile} alt="Profile" />
          <input className="hidden" type="file" id="file" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-textYellow">{user.displayName}</h1>
          <h3 className="text-lg text-textLight">@{user.userName}</h3>
        </div>
      </div>

    </div>
  );
};

export default ProfileView;
