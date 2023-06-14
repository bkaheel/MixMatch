import React from 'react';

const MatchView = ({ matches, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-slate-500 max-w-md w-full max-h-80vh ">
        <button
          className="absolute top-2 right-2 bg-transparent border-none text-xl cursor-pointer"
          onClick={onClose}
        >
          X
        </button>
        <h1 className="text-2xl mb-4">Match View</h1>
        <ul className=" p-0 m-0">
          {matches.map((match, index) => (
            <li key={index} className="flex items-center space-x-2 mb-2">
              {match.artwork && (
                <img className="w-16 h-16" src={match.artwork} alt="Album Artwork" />
              )}
              <span>{match.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MatchView;
