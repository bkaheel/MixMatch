import React from 'react';
import { Fade } from 'react-reveal';


const MatchView = ({ matches, onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center mt-auto bg-black justify-center bg-opacity-70 z-50 overflow-y-scroll'>
      <div className='text-white bg-black rounded-3xl mt-auto w-[500px] focus:scale-50'>
      <div>
          <h1 className='mt-4 font-thin text-2xl'>Match View</h1>
        </div>
        <button className=' hover:scale-110 transition-all duration-200 bg-slate-500 rounded-full px-4 mt-2 mb-7 py-2 text text-center'
          onClick={onClose}
        >
          X
        </button>
        
          <div >
            <ul >
            {matches.map((match, index) => (
              <Fade top cascade distance="50%"><li className='flex mb-7' key={index} >
                {match.artwork && (
                  <img className=" ml-8 w-1/4  rounded-full" src={match.artwork} alt="Album Artwork" />
                )}
                <span className='ml-3 flex flex-col text justify-center'>{match.name}</span>
              </li></Fade>
            ))}
            </ul>
          </div>
        </div>
      </div>
   
  );
};

export default MatchView;
