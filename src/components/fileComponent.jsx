import React from 'react';

export default function FileComponent({ file }) {
  console.log("file", file);
  return (
    <div className="flex justify-between items-center p-4 m-2 bg-white rounded-md shadow-md hover:bg-gray-200">
      <input type="checkbox" className="mr-4" />
      <p className="flex-1 text-gray-700">{file.name}</p>
      <p className="text-gray-500">
        {file.lastModifiedDate.getDate()}/{file.lastModifiedDate.getMonth() + 1}/{file.lastModifiedDate.getFullYear()}
      </p>
      <button className="ml-4 p-2 bg-gray-300 rounded-full hover:bg-gray-400">
        <span className="relative bottom-1">...</span>
      </button>
    </div>
  );
}