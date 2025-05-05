'use client';

import { useState } from 'react';

export default function ImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
    e.target.value = '';
    setNotification({ type: null, message: '' });
  };

  const onUploadClick = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setNotification({ type: null, message: '' });
    const form = new FormData();
    form.append('file', selectedFile);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: selectedFile });
      if (!res.ok) throw new Error(await res.text());

      setSelectedFile(null);
      setNotification({
        type: 'success',
        message: 'File uploaded successfully! You can now search for fixtures.'
      });
    } catch (err) {
      console.error('Upload failed:', err);
      setNotification({
        type: 'error',
        message: 'Upload failed. Please check your file format and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Import Fixtures Data</h2>
      {notification.type && (
        <div className={`mb-4 p-3 rounded-md ${notification.type === 'success'
          ? 'bg-green-100 border border-green-400 text-green-700'
          : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
          <p className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {notification.message}
          </p>
        </div>
      )}
      <div className="flex flex-col items-start space-y-2">
        <label className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded cursor-pointer transition">
          Choose CSV
          <input type="file" accept=".csv" onChange={onFileChange} className="hidden" />
        </label>

        {selectedFile && !isLoading && (
          <p className="text-gray-700">Selected: {selectedFile.name}</p>
        )}

        <button
          onClick={onUploadClick}
          disabled={!selectedFile || isLoading}
          className={`py-2 px-4 rounded text-white ${!selectedFile || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {isLoading ? 'Uploading…' : 'Upload'}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ol className="list-decimal ml-5 space-y-2 text-gray-700">
          <li>Click &quot;Select CSV File&quot; and choose your fixtures.csv file</li>
          <li>Wait for the data to be processed</li>
          <li>Once loaded, navigate to the &quot;Search Fixtures&quot; tab to find and view fixtures</li>
        </ol>
      </div>
    </section>
  );
}
