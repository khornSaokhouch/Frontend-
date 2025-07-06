"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import NotificationsPanel from "../../components/NotificationsPanel"; // adjust path
import { useParams } from "next/navigation"; // Use next/navigation for params

export default function OwnerLayout({ children }) {
  const { id } = useParams(); // Assuming you have a way to get the owner ID from params
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("#notification-button")
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center relative">
        <div className="text-xl font-bold">
          <Link href="/owner/dashboard">Owner Panel</Link>
        </div>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link href={`/owner/${id}/bookings`} className="hover:underline">
              Bookings
            </Link>
          </li>
          <li className="relative">
            {/* Notification Button */}
            <button
              id="notification-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:underline focus:outline-none relative"
            >
              Notifications
              {/* Optionally add a small badge if there are unread */}
              {/* <span className="ml-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center text-white absolute -top-2 -right-3">
                3
              </span> */}
            </button>

            {/* Dropdown Panel */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-96 z-50"
                style={{ minWidth: "320px" }}
              >
                <NotificationsPanel />
              </div>
            )}
          </li>
         
          <li>
          <Link href={`/login`} className="hover:underline">Logout</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center text-gray-600 py-4 mt-auto">
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </footer>
    </div>
  );
}
