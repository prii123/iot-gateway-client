'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 flex justify-center space-x-6">
    <Link href="/" className="text-white hover:text-gray-400">🏠 Inicio</Link>
    <Link href="/suscripciones" className="text-white hover:text-gray-400">🔗 Suscripciones</Link>
    <Link href="/publicaciones" className="text-white hover:text-gray-400">✉️ Publicaciones</Link>
    <Link href="/topics" className="text-white hover:text-gray-400"> Topics</Link>
    <Link href="/config" className="text-white hover:text-gray-400"> Configuracion</Link>
  </nav>
  );
} 