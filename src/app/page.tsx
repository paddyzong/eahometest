'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: file,
    });

    if (res.ok) {
      setStatus('Upload successful');
    } else {
      setStatus('Upload failed');
    }
  };

  return (
    <main className="p-4">
      <h1>Upload Fixture CSV</h1>
      <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
        Choose CSV
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>
      {file && <span className="ml-2">{file.name}</span>}      <button onClick={uploadFile} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded cursor-pointer">
        Upload
      </button>
      <p>{status}</p>
    </main>
  );
}
