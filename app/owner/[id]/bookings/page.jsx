"use client";
import React, { useEffect, useState } from "react";
import { useBookingStore } from "../../../store/useBookingStore";
import { useParams } from "next/navigation";
import {
  CalendarIcon,
  TagIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export default function UserBookings() {
  const param = useParams();
  const {
    bookings,
    getBookingsByUserId,
    loading,
    error,
    updateBookingStatus,
  } = useBookingStore();

  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  // State to store formatted created dates to avoid SSR/client mismatch
  const [formattedDates, setFormattedDates] = useState({});

  useEffect(() => {
    if (param.id) {
      getBookingsByUserId(param.id);
    }
  }, [param.id, getBookingsByUserId]);

  // Format dates only on client after bookings load
  useEffect(() => {
    const dates = {};
    bookings.forEach((b) => {
      dates[b.id] = new Date(b.created_at).toLocaleDateString();
    });
    setFormattedDates(dates);
  }, [bookings]);

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-red-100 text-red-800",
    complete: "bg-green-100 text-green-800",
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleStatusChange = async (bookingId, status) => {
    try {
      setUpdatingBookingId(bookingId);
      await updateBookingStatus(bookingId, status);
      if (param.id) getBookingsByUserId(param.id);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500">Loading bookings...</div>
    );
  if (error)
    return (
      <div className="p-4 text-center text-red-500">Error: {error}</div>
    );

  return (
    <div className="p-4">
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">No bookings found.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead className="bg-gray-100 text-left text-sm text-gray-600">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4 flex items-center gap-1">
                  <TagIcon className="h-4 w-4" />
                  Service
                </th>
                <th className="py-3 px-4">
                  <CalendarIcon className="h-4 w-4 inline" /> Booking Date
                </th>
                <th className="py-3 px-4">
                  <ClockIcon className="h-4 w-4 inline" /> Created
                </th>
                <th className="py-3 px-4">
                  <CheckCircleIcon className="h-4 w-4 inline" /> User
                </th>
                <th className="py-3 px-4">
                  <XCircleIcon className="h-4 w-4 inline" /> Notes
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 font-semibold">#{booking.id}</td>
                  <td className="py-2 px-4">{booking.service?.name || "N/A"}</td>
                  <td className="py-2 px-4">{booking.booking_date || "N/A"}</td>
                  <td className="py-2 px-4">{formattedDates[booking.id] || "N/A"}</td>
                  <td className="py-2 px-4">{booking.user?.name || "N/A"}</td>
                  <td className="py-2 px-4">{booking.notes || "-"}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        statusColor[booking.status] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {capitalize(booking.status)}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center space-x-2">
  {booking.status === "pending" ? (
    <>
      <button
        onClick={() => handleStatusChange(booking.id, "accepted")}
        disabled={updatingBookingId === booking.id}
        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
      >
        Accept
      </button>
      <button
        onClick={() => handleStatusChange(booking.id, "rejected")}
        disabled={updatingBookingId === booking.id}
        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
      >
        Reject
      </button>
    </>
  ) : (
    <span className="text-gray-400 text-xs italic">No actions</span>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
