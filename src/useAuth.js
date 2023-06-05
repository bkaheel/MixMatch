import React from 'react'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { FetchFromCollection } from './components/FetchFromCollection'

export const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  useEffect(() => {
    axios
      .post("http://localhost:5174/login", {
        code,
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
      })
      .catch((err) => {
        console.log(err)
        window.location = '/spotifylogin';
      })

  }, [code])

  localStorage.setItem("RefreshCheck", refreshToken);
  localStorage.setItem("Expiring", expiresIn);





  return accessToken;

}
