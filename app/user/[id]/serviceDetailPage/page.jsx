'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useServiceStore } from '../../../store/useServiceStore';
import { useBookingStore } from '../../../store/useBookingStore';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { fetchServiceById } = useServiceStore();
  const { bookService, loading: bookingLoading, error: bookingError } = useBookingStore();

  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!id) return;

    fetchServiceById(id)
      .then((data) => {
        setService(data);
        setError(null);
      })
      .catch(() => {
        setError('Failed to fetch service details.');
      });
  }, [id, fetchServiceById]);

  const handleBook = async () => {
    if (!bookingDate) {
      alert('Please select a booking date.');
      return;
    }

    try {
      await bookService(service.id, bookingDate, notes);
      setSuccessMsg('Booking successful! The service owner will be notified.');
      setBookingDate('');
      setNotes('');
    } catch (err) {
      alert(`Booking failed: ${err.message}`);
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!service) return <p>Loading service details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
      <p className="mb-2">Location: {service.location}</p>
      <p className="mb-6 font-semibold">${service.price}</p>

      <h2 className="text-2xl mb-3">Book This Service</h2>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

      <label className="block mb-4">
        Booking Date:
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="block mb-4">
        Notes (optional):
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests or info"
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <button
        onClick={handleBook}
        disabled={bookingLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {bookingLoading ? 'Booking...' : 'Confirm Booking'}
      </button>

      {bookingError && <p className="text-red-600 mt-2">{bookingError}</p>}
    </div>
  );
}
