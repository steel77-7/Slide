"use client";
import React from "react";

export default function RecievePopupComponent({ user, profilePicture,setReject }) {
    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="flex flex-col items-center h-auto w-96 bg-white rounded-md p-6 shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <img
            src={profilePicture}
            alt={`${user}'s profile`}
            className="w-24 h-24 rounded-full border-2 border-blue-500"
          />
        </div>
        <h1 className="text-3xl text-blue-500 font-bold mb-2">Connect</h1>
        <p className="text-center text-gray-700 mb-4">
          <span className="font-semibold">{user}</span> wants to connect with you.
        </p>
        <div className="flex gap-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors" onClick={()=>setReject(prev=> {return !prev})}>
            Reject
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
