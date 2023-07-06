import React from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from '../Firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const userName = e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;
    const file = e.target[4].files[0] || null; 

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await setDoc(doc(db, 'accounts', response.user.uid), {
        uid: response.user.uid,
        displayName,
        photoURL: downloadURL,
        userName,
        email,
        friends: [],
        spotifyToken: null,
        refreshToken: null,
        friendRequests: [],
        expiresIn: null,
      });

      navigate('/spotifyregister');
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-textDark to-secondaryBackground via-yellow-600 from-3% via-20% to-60% h-screen">
      <div>
        <h1>Sign Up</h1>
      </div>
      <div className='flex flex-col'>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Display Name" />
          <input type="text" placeholder="User Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <p> Select profile photo: </p>
          <input type="file" id="file"/>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>



    
  );
};

export default Register;
