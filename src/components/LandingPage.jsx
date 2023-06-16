// Going to https://mixmatch.com/ will bring users to this landing page. When a user is already logged in, clicking log in will take them to the app. (What to do with register button in this case??) 

import React from 'react'
import { useNavigate } from 'react-router-dom'
import Features from './landing/Features';
import Hero from './landing/Hero';
import Navigation from './landing/Navigation';

const LandingPage = () => {
    const navigate = useNavigate();
    
    const handleRegister = () => {
        navigate("/register");
    }

    const handleLogin = () => {
        navigate("/login");
    }


  return (
    <div className='flex flex-col'>
        <Navigation/>
        <Hero />
        <Features />


    </div>
  )
}

export default LandingPage