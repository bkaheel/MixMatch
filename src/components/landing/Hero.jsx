import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate();


    const handleRegister = () => {
        navigate('/register');
    }

    const handleLogin = () => {
        navigate('/login');
    }


  return (
    <div className='flex flex-col px-10 py-[150px] gap-[50px] h-screen'>
        <div className=' mt-12 w-1/2'>
            <h1 className='text-3xl font-bold'>Bringing You Closer With Music.</h1>
            <p className='mt-3 text-lg'>MixMatch lets you connect with your friends to share your music. See what your friends are listening to, view what tracks are hot, and get a taste of your combined music tastes. </p>
        </div>

        <div className='flex flex-col gap-4 items-left w-1/2'>
            <div className='flex flex-row gap-5'>
                <button className='bg-yellow-600 rounded-full w-[140px] h-[45px] text-white' onClick={() => handleLogin()}> Login </button>
                <button className='bg-yellow-600 rounded-full w-[140px] h-[45px] text-white' onClick={() => handleRegister()}> Register </button>
            </div>
        </div>
    </div>
  )
}

export default Hero