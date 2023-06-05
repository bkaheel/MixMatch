// Temporary Design of Actual app w/ Display name and logout button

import React from 'react'
import { useState, useEffect } from 'react'
import { useContext } from "react"
import { AuthenticationContext } from "../context/AuthenticationContext"
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore"
import { db, auth } from "../firebase"
import { signOut } from 'firebase/auth'
import Friends from './Friends'


const MixMatch = () => {
  const { currentUser } = useContext(AuthenticationContext);


  // Handles Logout
  const handleSubmit = () => {
    signOut(auth).then(() => {
      console.log("Signed out");
    }).catch((error) => {
      console.log("something went wrong.");
    });
  }



  return (
    <div>
      MixMatch
      <div>

      </div>
      <div>
        <button onClick={handleSubmit}> Log Out </button>
      </div>
      <div>
         <Friends />
      </div>
    </div>
  )
}

export default MixMatch