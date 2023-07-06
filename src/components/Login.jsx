import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        // Pulling data from the form 
        const email = e.target[0].value;
        const password = e.target[1].value;
      
        try {
            await signInWithEmailAndPassword(auth, email, password);
      
        } catch (err) {
            console.log(err.message);
        }

        // After creating the new account, we go to the Spotify login page
        navigate("/app");

    }


    return (
        <div className="bg-gradient-to-br from-textDark to-secondaryBackground via-yellow-600 from-3% via-20% to-60%">
        <div className=" h-screen flex flex-col justify-center">
            <div className="text-center">
                <h1 className=' text-white mb-5 text-3xl font-light'> Login to see what your friends are up to </h1>
            </div>
            <div className="  text-center">
                <form className='justify-center' onSubmit={handleSubmit}>
                    <div className="">
                        <p className=' text-white mb-2 font-thin'>Email</p>
                    </div>
                    <div>
                    <input className='border-2 rounded-md border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500 invalid:border-red-500 invalid:border-2' type='email' placeholder='Email' />
                    </div>
                    <div className="mt-7">
                        <p className=' text-white mb-2 font-thin'>Password</p>
                    </div>
                    <div>
                        <input className='border rounded-md border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 invalid:border-red-500 invalid:border-2' type='password' placeholder='Password' />
                    </div>
                    <button className=' hover:scale-110 hover:bg-white hover:text-yellow-500 hover:border-yellow-500 transition-all bg-yellow-600 px-7 py-2 border-2 rounded-full mt-9 text-white' type='submit'> Submit </button>
                </form>
            </div>

            
        </div>
        </div>
      )
}

export default Login
