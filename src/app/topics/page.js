"use client";

import { Navbar } from "@/src/components/Navbar";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { RadioReceiver } from "lucide-react"; // 📡 Icono de sensor


const SOCKET_URL = "http://localhost:3002"; // Ajusta con la URL de tu backend NestJS

export default function Home() {
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("🔗 Conectado al servidor WebSocket");
    });

    socket.on("mqtt_message", (data) => {
      // console.log("📩 Nuevo mensaje recibido:", data);
      setMessages((prev) => ({
        ...prev,
        [data.topic]: { 
          message: data.lastMessage, 
          updatedAt: data.updatedAt  // ✅ Guardar updatedAt
        }, // Sobrescribe el mensaje del topic en lugar de crear una nueva fila
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
    <Navbar />

    <div className="w-full bg-gray-900 p-6 rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-semibold mb-6 flex items-center justify-center gap-2">
        <RadioReceiver size={28} className="text-blue-400" /> 📡 MQTT en Tiempo Real
      </h1>

      <div className="text-3xl font-semibold mb-6 flex items-center justify-center gap-2">
      <div className="w-full max-w-6xl">
        <h2 className="text-xl font-semibold mb-4">📨 Mensajes Recibidos</h2>

        {Object.keys(messages).length === 0 ? (
          <p className="text-gray-400 text-center">No hay mensajes recibidos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {Object.entries(messages).map(([topic, data]) => (
              <div key={topic} className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700 text-center">
                <p className="text-sm text-gray-400">📌 <b>{topic}</b></p>
                <p className="text-white text-lg font-medium">{data.message}</p>
                <p className="text-gray-500 text-xs mt-2">🕒 {new Date(data.updatedAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      
    </div>
  </div>
  );
}


