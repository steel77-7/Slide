import React, { useState } from 'react';

export default function UploadComponent({ setUploadPress }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);

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
    setUploadPress(false)
  };

  const handleUpload = () => {
    // Handle the file upload logic here
    console.log('Files to upload:', files);
    setFiles([]);
   
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
        <div
          className={`w-full p-4 border-2 border-dashed rounded-lg mb-4 ${
            dragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
          }`}
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
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
            <ul className="list-disc pl-5">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
