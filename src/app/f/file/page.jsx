"use client";

import FileComponent from '@/components/fileComponent';
import UploadComponent from '@/components/uploadComponent';
import { generateToken } from '@/misc/tokenGernerator';
import React, { useState, useEffect, useRef } from 'react';
import getSocket from '@/misc/getSocket';

export default function Files() {
  const [uploadPress, setUploadPress] = useState(false);

  const connectionStringRef = useRef(generateToken(15));
  let socket = getSocket();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRecieveRequest({connectionString}) {
      if(connectionString===connectionStringRef){
        socket.emit('establish-rtcConnection',{})
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("recieve-request", onRecieveRequest);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("recieve-request", onRecieveRequest);
    };
  }, [socket]);

  // Key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      console.log("User's connection string:", e.target.value);
      
    }
  };
  const handleSendReqest=async ()=>{
    socket.emit("connection-request",{connectionString:connectionStringRef});

  }

  return (
    <>
      {uploadPress && <UploadComponent setUploadPress={setUploadPress} />}
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Files</h1>
          <Upload setUploadPress={setUploadPress} uploadPress={uploadPress} />
        </div>
        <p className="text-blue-500">Your connection string: {connectionStringRef.current}</p>
        <p>
          Type user's connection string here: 
          <input 
            type="text" 
            placeholder="Type here..." 
            className="outline-none bg-transparent border-b-2 border-slate-600 px-2" 
            onKeyPress={handleKeyPress} 
          /> 
        </p>
        <div className="flex-1 flex bg-zinc-100 shadow-2xl rounded-lg overflow-hidden">
          <div className="w-full flex-1 max-w-4xl p-4">
            <FileComponent />
            <FileComponent />
            <FileComponent />
            <FileComponent />
            <FileComponent />
          </div>
        </div>
      </div>
    </>
  );
}

const Upload = ({ uploadPress, setUploadPress }) => {
  const handleClick = () => {
    setUploadPress(!uploadPress);
  };

  return (
    <button 
      className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500" 
      onClick={handleClick}
    >
      Upload
    </button>
  );
};
