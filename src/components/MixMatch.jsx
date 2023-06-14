// Temporary Design of Actual app w/ Display name and logout button

import React from 'react'
import { useContext } from "react"
import { AuthenticationContext } from "../context/AuthenticationContext"
import Friends from './Friends'
import { Outlet } from 'react-router-dom'
import Navigation from './app/Navigation'


const MixMatch = () => {


  return (
    <div className='flex'>
      <div className=''>
        <Navigation />
      </div>
      <div className='mt-5'>
        <Outlet />
      </div>
    </div>
  )
}

export default MixMatch