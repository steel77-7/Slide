import FileComponent from '@/components/fileComponent';
import React from 'react';

export default function Files() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Files</h1>
      <div className="flex-1 flex   bg-zinc-100 shadow-2xl rounded-lg overflow-hidden">
        <div className="w-full max-w-4xl p-4">
          <FileComponent />
        </div>
      </div>
    </div>
  );
}
