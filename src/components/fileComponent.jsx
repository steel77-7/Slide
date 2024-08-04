import React from 'react';

export default function FileComponent({ file }) {
  console.log("file", file);
  return (
    <div className="flex justify-between items-center p-4 m-2 bg-white rounded-md shadow-md hover:bg-gray-50 transition-colors duration-300">
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{file.name}</p>
        <p className="text-gray-500 text-sm">
          {file.lastModifiedDate.getDate()}/{file.lastModifiedDate.getMonth() + 1}/{file.lastModifiedDate.getFullYear()}
        </p>
      </div>
    </div>
  );
}
