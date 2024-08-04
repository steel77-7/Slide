"use client";
import React from "react";

export default function RecievePopupComponent({
  user,
  handleReject,
  handleEstablishConnection,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60">
      <div className="flex flex-col items-center w-full max-w-md bg-white rounded-lg p-6 shadow-2xl border border-gray-300">
        <h1 className="text-2xl text-blue-600 font-semibold mb-4">Connect</h1>
        <div className="flex flex-col items-center justify-center mb-4">
          <p className="text-lg text-gray-800 font-medium">
            User with connection string wants to connect to you: 
          </p>
          <p className="font-semibold">{user}</p>
        </div>
        {/* <p className="text-center text-gray-700 mb-6">
          <span className="font-medium">{user}</span> wants to connect with you.
        </p> */}
        <div className="flex gap-4">
          <button
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleEstablishConnection}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
