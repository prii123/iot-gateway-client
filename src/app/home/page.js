"use client";

import { useState, useEffect } from 'react';

export default function LastMessages() {
  const [messages, setMessages] = useState([]);

  // Obtener los últimos mensajes publicados
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch('http://localhost:3001/mqtt/last-messages');
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">📨 Últimos Mensajes Publicados</h2>
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
        {messages.length === 0 ? (
          <p className="text-gray-400">No hay mensajes publicados.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-4">
              <p className="text-white">📌 Tópico: {msg.topic}</p>
              <p className="text-gray-400">IP: {msg.ipAddress}</p>
              <p className="text-gray-400">Mensaje: {msg.lastMessage}</p>
              <p className="text-gray-400">Última actualización: {new Date(msg.updatedAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}