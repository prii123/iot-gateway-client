"use client";

import { Navbar } from '@/src/components/Navbar';
import { useState } from 'react';

export default function Publicaciones() {
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');

  const publishMessage = async () => {
    if (!topic || !message) return alert('⚠️ Ingresa un topic y un mensaje.');

    await fetch('http://localhost:3001/mqtt/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, message }),
    });

    setMessage('');
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <Navbar />
      
      <div className="w-full max-w-md bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-2">✉️ Enviar Mensaje</h2>
      <div className="flex">
        <input
          className="flex-1 bg-gray-700 text-white p-2 rounded-l"
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <div className="flex mt-2">
        <input
          className="flex-1 bg-gray-700 text-white p-2 rounded-l"
          type="text"
          placeholder="Mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="bg-green-500 px-4 py-2 rounded-r text-white" onClick={publishMessage}>
          Enviar
        </button>
      </div>
      </div>
      
    </div>
  );
}
