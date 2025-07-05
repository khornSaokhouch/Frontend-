
"use client";

import React from "react";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 text-center">
            Welcome, Admin!
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            Here is a quick overview of the system.
          </p>
        </header>
      </main>
    </div>
  );
}
