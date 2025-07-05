'use client';

import Link from 'next/link';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <nav className="bg-white border-b shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">
        <Link href="/">ServiceBooker</Link>
      </div>

      <div className="space-x-4 hidden md:flex">
        <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        {user && (
          <Link href={`/user/${user.id}/services`} className="text-gray-700 hover:text-blue-600">
            Services
          </Link>
        )}
        <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>

        {!user ? (
          <>
            <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link
              href="/register"
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        ) : (
          <span className="text-gray-600">Hello, {user.name}</span>
        )}
      </div>
    </nav>
  );
}
