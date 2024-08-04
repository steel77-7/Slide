"use client";
import React from "react";

export default function RecievePopupComponent({
  user,
  profilePicture,
  handleReject,
  handleEstablishConnection,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60">
      <div className="flex flex-col items-center w-80 bg-white rounded-lg p-6 shadow-xl border border-gray-300">
        <div className="flex items-center justify-center mb-4">
          <img
            src={profilePicture}
            alt={`${user}'s profile`}
            className="w-20 h-20 rounded-full border-4 border-blue-500"
          />
        </div>
        <h1 className="text-2xl text-blue-600 font-semibold mb-2">Connect</h1>
        <p className="text-center text-gray-800 mb-6">
          <span className="font-medium">{user}</span> wants to connect with you.
        </p>
        <div className="flex gap-4">
          <button
            className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
            onClick={handleEstablishConnection}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
