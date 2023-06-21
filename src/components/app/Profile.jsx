import React from 'react'
import UserInfo from './profile/UserInfo'
import TopSongs from './profile/TopSongs'

const Profile = () => {

  return (
    <div className='px-5 py-10 flex flex-col gap-10'>
        <UserInfo />
        <div className='mt-10'>
          <TopSongs />
        </div>
     </div>
  )
}

export default Profile