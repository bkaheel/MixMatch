import React from 'react';
import { useContext } from 'react';
import { AuthenticationContext } from '../context/AuthenticationContext';
import Friends from './Friends';
import { Outlet } from 'react-router-dom';
import Navigation from './app/Navigation';

const MixMatch = () => {
  return (
    <div className='flex h-screen bg-background'>
      <div className='fixed'>
        <Navigation />
      </div>
      <div className='ml-20 mr-3 w-full py-6'>
        <div className='bg-secondaryBackground h-full overflow-auto rounded-3xl'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MixMatch;
