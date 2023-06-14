// Navigation options: Profile, Feed, Settings, Friends

import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const Navigation = () => {
    const navigate = useNavigate();
  return (
    <div className='flex flex-col gap-5 bg-slate-500 h-screen rounded-lg ml-5 mr-5 mt-5  w-[200px] sticky top-0'>   
        <div className='flex flex-col ml-5 mt-5 font-bold'>
        <span className='text-3xl font-thin mb-[20px]'>MixMatch</span>

        <a className='mb-8 outline outline-2 w-[100px] h-[30px] text-center rounded-full hover:bg-yellow-600 hover:-translate-y-2' onClick={() => navigate("/app")}> Feed </a> 
        <a className='mb-8 outline outline-2 w-[100px] h-[30px] text-center rounded-full hover:bg-yellow-600 hover:-translate-y-2'onClick={() => navigate("/app/friends")}> Friends </a> 
        <a className='mb-8 outline outline-2 w-[100px] h-[30px] text-center rounded-full hover:bg-yellow-600 hover:-translate-y-2'onClick={() => navigate("/app/profile")}> Profile </a> 
        <a className='mb-8 outline outline-2 w-[100px] h-[30px] text-center rounded-full hover:bg-yellow-600 hover:-translate-y-2'onClick={() => navigate("/app/settings")}> Settings </a>
        <a className='mb-8 outline outline-2 w-[100px] h-[30px] text-center rounded-full hover:bg-yellow-600 hover:-translate-y-2'onClick={() => navigate("/app/match")}> Match </a>  
        </div>

     </div>
  )
}

export default Navigation