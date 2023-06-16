import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navigation = () => {
    const navigate = useNavigate();


    const handleRegister = () => {
        navigate('/register');
    }

    const handleLogin = () => {
        navigate('/login');
    }






  return (
    <div className='w-full h-[10vh] sticky top-0 z-50 px-10'>
        <div className='max-w h-full mx-auto flex items-center justify-between'>

            <div className='flex items-center gap-7'>
                <h1 className='text-2xl'><span className='text-yellow-600'>Mix</span><span className='font-thin'>Match</span></h1>

                <ul className='flex gap-7 '>
                    <li className='hover:text-yellow-600'> <a>Home</a></li>
                    <li className='hover:text-yellow-600'><a>Features</a></li>
                    <li className='hover:text-yellow-600'><a>Join</a></li>
                </ul>
            </div>

            <div >
                <ul className='flex gap-3 items-center'>
                    <li className='hover:text-yellow-600'><button onClick={() => handleLogin()}>Login</button></li>
                    <li> <button className='bg-yellow-600 w-[80px] h-[35px] rounded-full text-white text-sm' onClick={() => handleRegister()}> Register </button> </li>
                </ul>
            </div>

        </div>
    </div>
  )
}

export default Navigation