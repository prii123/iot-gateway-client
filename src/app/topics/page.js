  
"use client";

import { Navbar } from '@/src/components/Navbar';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // URL del backend NestJS

export default function TopicList() {
  const [topics, setTopics] = useState([]); // Especifica el tipo de datos
  const [subscriberCounts, setSubscriberCounts] = useState({}); // Almacena el número de suscriptores por tópico

  // Obtener la lista de tópicos al cargar el componente
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch('http://localhost:3001/mqtt/topics');
        const data = await res.json();
        setTopics(data.topics || []); // Asegúrate de que data.topics sea un array
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  // Escuchar el número de suscriptores
  useEffect(() => {
    // Escuchar el estado inicial de los suscriptores
    socket.on('initial_subscriber_counts', (initialCounts) => {
      setSubscriberCounts(initialCounts);
    });

    // Escuchar actualizaciones en tiempo real
    socket.on('subscriber_count', ({ topic, count }) => {
      setSubscriberCounts((prev) => ({
        ...prev,
        [topic]: count,
      }));
    });

    // Limpiar listeners al desmontar el componente
    return () => {
      socket.off('initial_subscriber_counts');
      socket.off('subscriber_count');
    };
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-md bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
        <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">📋 Topics Suscritos</h2>
          {topics.length === 0 ? (
            <p className="text-gray-400">No hay topics suscritos.</p>
          ) : (
            topics.map((topic, index) => (
              <div key={index} className="flex justify-between items-center">
                <p className="text-white">📌 {topic}</p>
                <p className="text-gray-400">
                  {subscriberCounts[topic] || 0} suscriptores
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}