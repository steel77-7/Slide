import React, { useState } from 'react';
import FileComponent from './fileComponent';

export default function UploadComponent({ setUploadPress, files, setFiles }) {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleCancel = () => {
    setFiles([]);
    setUploadPress(false);
  };

  const handleUpload = () => {
    console.log('Files to upload:', files);
    setFiles([]);
  };

  return (
    <div className=" inset-0 flex items-center justify-center bg-gray-800 bg-transparent">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 md:mx-0 ">
        <div
          className={`w-full p-4 border-2 border-dashed rounded-lg ${
            dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } transition-colors duration-300`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            className="hidden"
            id="fileInput"
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <span className="text-gray-500">
              {dragging ? 'Drop files here...' : 'Drag and drop files here or click to upload'}
            </span>
            <span className="mt-2 text-blue-500">Browse files</span>
          </label>
        </div>
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
            <ul className="list-disc pl-5">
              {files.map((file, index) => (
                <FileComponent key={index} file={file} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
