import Navbar from '../../components/Navbar';
import './globals.css';

export default function App({ Component, pageProps }) {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
