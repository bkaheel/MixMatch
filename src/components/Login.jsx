import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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
    <div>
        <div>
            <h1> Login </h1>
        </div>
        <div>
            <form onSubmit={handleSubmit}>
                <input type='email' placeholder='Email' />
                <input type='password' placeholder='Password' />
                <button type='submit'> Submit </button>
            </form>
        </div>
    </div>
  )
}

export default Login