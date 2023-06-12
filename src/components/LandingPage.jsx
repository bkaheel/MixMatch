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
    <div className='bg-slate-500 h-screen flex place-content-center'>
        <div className='mt-10 flex flex-col text-center gap-12'>
            <h1 className='mb-10 text-6xl font-bold text-yellow-600 '>Welcome to MixMatch</h1>
            <div>
            <ul>
                <li>
                    <p className='mb-4 text-3xl font-thin'> New to MixMatch? </p>
                    <button className='mb-8 outline outline-2 w-[100px] h-[30px] rounded-full hover:bg-yellow-600 hover:-translate-y-2' onClick={handleRegister}> Register </button>
                </li>
                <li>
                    <p className='mb-4 text-3xl font-thin'> Already have an account? </p>
                    <button className='mb-8 outline outline-2 w-[100px] h-[30px] rounded-full hover:bg-yellow-600 hover:-translate-y-2' onClick={handleLogin}> Login </button>
                </li>
            </ul>
        </div>

        </div>
    


    </div>
  )
}

export default LandingPage