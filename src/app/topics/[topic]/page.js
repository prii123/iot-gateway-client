"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ Usar useParams()
import { io } from "socket.io-client";
import { ArrowLeftCircle } from "lucide-react"; 
import Link from "next/link";
import { API_ENDPOINTS } from '@/src/util/config';


export default function TopicPage() {
  const router = useRouter();
  const { topic } = useParams(); // ✅ Obtener el parámetro topic correctamente
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const socket = io(API_ENDPOINTS.SOCKET_URL);

    socket.on("connect", () => {
      // console.log(`🔗 Suscrito al topic: ${topic}`);
    });

    socket.on("mqtt_message", (data) => {
      if (data.topic === topic) {
        setMessage({
          message: data.lastMessage,
          updatedAt: data.updatedAt,
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [topic]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <Link href="/topics" className="absolute top-4 left-4 text-blue-400 hover:text-blue-300">
        <ArrowLeftCircle size={32} />
      </Link>

      <div className="w-full max-w-xl bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-semibold mb-6">📡 Topic: {topic}</h1>

        {message ? (
          <div className="bg-gray-700 p-5 rounded-lg shadow-lg border border-gray-600">
            <p className="text-lg font-medium">{message.message}</p>
            <p className="text-gray-500 text-xs mt-2">🕒 {new Date(message.updatedAt).toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-gray-400">Esperando mensajes...</p>
        )}
      </div>
    </div>
  );
}
