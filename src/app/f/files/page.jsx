"use client";

import FileComponent from '@/components/fileComponent';
import UploadComponent from '@/components/uploadComponent';
import React, { useState } from 'react';


export default function Files() {
    const [uploadPress, setUploadPress] = useState(false)
    
  return (
    <>
    {uploadPress && <UploadComponent setUploadPress={setUploadPress} />}
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Files</h1>
        <Upload setUploadPress={setUploadPress} uploadPress={uploadPress}/>
      </div>
      <p>Your connection string:</p>
      <p>Connected with user:</p>
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

const Upload = ({uploadPress, setUploadPress}) => {
    const hanldeClick =()=>{
        setUploadPress(!uploadPress)
    }
  return (
    <button className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"  onClick={hanldeClick}>
      Upload
    </button>
  );
}
