// Going to https://mixmatch.com/ will bring users to this landing page. When a user is already logged in, clicking log in will take them to the app. (What to do with register button in this case??) 

import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate();
    
    const handleRegister = () => {
        navigate("/register");
    }

    const handleLogin = () => {
        navigate("/login");
    }


  return (
    <div>
        <div>
            <h1>Welcome to MixMatch </h1>
        </div>

        <div>
            <ul>
                <li>
                    <p> New to MixMatch? </p>
                    <button onClick={handleRegister}> Register </button>
                </li>
                <li>
                    <p> Already have an account? </p>
                    <button onClick={handleLogin}> Login </button>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default LandingPage