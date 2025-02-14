"use client";

import { Navbar } from '@/src/components/Navbar';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // URL del backend NestJS

export default function Suscripciones() {
  const [topic, setTopic] = useState('');
  const [subscribedTopic, setSubscribedTopic] = useState('');
  const [messages, setMessages] = useState([]);

  // Escuchar mensajes MQTT
  useEffect(() => {
    const handleMessage = (data) => {
      let messageContent;

      if (data.message instanceof ArrayBuffer) {
        const decoder = new TextDecoder('utf-8');
        messageContent = decoder.decode(data.message);
      } else {
        messageContent = data.message;
      }

      // Solo agregar mensajes del tópico suscrito
      if (data.topic === subscribedTopic) {
        setMessages((prev) => [...prev, { topic: data.topic, message: messageContent }]);
      }
    };

    socket.on('mqtt_message', handleMessage);

    return () => {
      socket.off('mqtt_message', handleMessage);
    };
  }, [subscribedTopic]); // Dependencia: subscribedTopic

  // Suscribirse a un tópico
  const subscribeTopic = async () => {
    if (!topic) return alert('⚠️ Ingresa un topic para suscribirte.');

    // Suscribirse en el backend
    await fetch('http://localhost:3001/mqtt/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    // Suscribirse en el frontend (Socket.IO)
    socket.emit('subscribe', topic);
    setSubscribedTopic(topic);
    setMessages([]); // Limpiar mensajes anteriores
  };

  // Desuscribirse de un tópico
  const unsubscribeTopic = async () => {
    if (!subscribedTopic) return;

    // Desuscribirse en el backend
    await fetch('http://localhost:3001/mqtt/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: subscribedTopic }),
    });

    // Desuscribirse en el frontend (Socket.IO)
    socket.emit('unsubscribe', subscribedTopic);
    setSubscribedTopic('');
    setMessages([]); // Limpiar mensajes
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-md bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">🔗 Suscribirse a un Topic</h2>
        <div className="flex">
          <input
            className="flex-1 bg-gray-700 text-white p-2 rounded-l"
            type="text"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            className="bg-blue-500 px-4 py-2 rounded-r text-white"
            onClick={subscribeTopic}
          >
            Suscribir
          </button>
        </div>
      </div>

      {subscribedTopic && (
        <div className="w-full max-w-md bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">📌 Tópico Suscrito</h2>
          <p className="text-white">
            Actualmente suscrito a: <b>{subscribedTopic}</b>
          </p>
          <button
            className="bg-red-500 px-4 py-2 mt-2 rounded text-white"
            onClick={unsubscribeTopic}
          >
            Desuscribir
          </button>
        </div>
      )}

      <div className="w-full max-w-md bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">📨 Mensajes Recibidos</h2>
        <div className="max-h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400">No hay mensajes recibidos.</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="border-b border-gray-700 py-2">
                <p className="text-sm text-gray-400">📌 <b>{msg.topic}</b></p>
                <p className="text-white">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

