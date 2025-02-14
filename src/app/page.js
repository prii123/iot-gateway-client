"use client";
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Navbar } from '../components/Navbar';
import './globals.css';

const socket = io('http://localhost:3001'); // URL del backend NestJS

export default function MqttClient() {
  const [messages, setMessages] = useState([]);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [subscribedTopic, setSubscribedTopic] = useState('');

  const [subscribedTopics, setSubscribedTopics] = useState([]);

  useEffect(() => {
    socket.on('mqtt_message', (data) => {
      let messageContent;
  
      if (data.message instanceof ArrayBuffer) {
        // Convertir ArrayBuffer a String
        const decoder = new TextDecoder('utf-8');
        messageContent = decoder.decode(data.message);
      } else {
        messageContent = data.message;
      }
  
      console.log('📩 Mensaje recibido:', { topic: data.topic, message: messageContent });
  
      setMessages((prev) => [...prev, { topic: data.topic, message: messageContent }]);
    });
  
    return () => {
      socket.off('mqtt_message');
    };
  }, []);


  const fetchSubscribedTopics = async () => {
    const response = await fetch('http://localhost:3001/mqtt/topics');
    const data = await response.json();
    console.log(data)
    setSubscribedTopics(data.topics);
  };  


  const subscribeTopic = async () => {
    if (!topic) return alert('⚠️ Ingresa un topic para suscribirte.');

    await fetch('http://localhost:3001/mqtt/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    setSubscribedTopic(topic);
  };

  const publishMessage = async () => {
    if (!subscribedTopic || !message) return alert('⚠️ Ingresa un topic y un mensaje.');

    await fetch('http://localhost:3001/mqtt/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: subscribedTopic, message }),
    });

    setMessage('');
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">

      <Navbar />

      {/* Sección de suscripción */}
      <div className="w-full max-w-md bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">🔗 Suscribirse a un Topic</h2>
        <div className="flex">
          <input
            className="flex-1 bg-gray-700 text-white border border-gray-600 p-2 rounded-l"
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
        {subscribedTopic && <p className="text-sm mt-2">📌 Suscrito a: <b>{subscribedTopic}</b></p>}
      </div>

      {/* Sección de publicación */}
      {subscribedTopic && (
        <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">✉️ Enviar Mensaje</h2>
          <div className="flex">
            <input
              className="flex-1 bg-gray-700 text-white border border-gray-600 p-2 rounded-l"
              type="text"
              placeholder="Mensaje"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="bg-green-500 px-4 py-2 rounded-r text-white"
              onClick={publishMessage}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* Sección de mensajes recibidos */}
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
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

      <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
        <button
          className="bg-yellow-500 px-4 py-2 rounded-lg mb-4"
          onClick={fetchSubscribedTopics}
        >
          🔍 Ver Topics Suscritos
        </button>

        <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">📋 Topics Suscritos</h2>
          {subscribedTopics.length === 0 ? (
            <p className="text-gray-400">No hay topics suscritos.</p>
          ) : (
            subscribedTopics.map((topic, index) => (
              <p key={index} className="text-white">📌 {topic}</p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}