"use client";
import { useState, useEffect } from 'react';
import { Navbar } from '@/src/components/Navbar';
import { API_ENDPOINTS } from '@/src/util/config';
// import './globals.css';

export default function WifiConfig() {
  const [wifi, setWifi] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWifiConfig();
  }, []);

  const fetchWifiConfig = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WIFI_CONFIG);
      const data = await response.json();
      if (data.length > 0) {
        setWifi(data[0].wifi);
        setPass(data[0].pass);
      }
    } catch (error) {
      console.error('Error al obtener la configuración:', error);
    }
  };

  const saveWifiConfig = async () => {
    if (!wifi || !pass) return alert('⚠️ Ingresa un SSID y una contraseña.');
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(API_ENDPOINTS.WIFI_CONFIG, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wifi, pass }),
      });
      const result = await response.json();
      setMessage(result.message || '✅ Configuración guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar:', error);
      setMessage('❌ Error al guardar la configuración.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-md bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📡 Configuración de WiFi</h2>
        <div className="mb-4">
          <label className="block text-sm mb-1">🔗 SSID</label>
          <input
            className="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded"
            type="text"
            placeholder="Nombre de la red WiFi"
            value={wifi}
            onChange={(e) => setWifi(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">🔒 Contraseña</label>
          <input
            className="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded"
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600"
          onClick={saveWifiConfig}
          disabled={loading}
        >
          {loading ? 'Guardando...' : '💾 Guardar Configuración'}
        </button>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </div>
      </div>
      
    </div>
  );
}
