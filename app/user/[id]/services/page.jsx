'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useServiceStore } from '../../../store/useServiceStore';

export default function ServiceFilterList() {
  const { serviceId } = useParams(); // Make sure this is used only if inside dynamic route

  const {
    services,
    categories,
    loading,
    error,
    fetchCategories,
    fetchServices,
  } = useServiceStore();

  const [filters, setFilters] = useState({
    name: '',
    category_id: '',
    location: '',
    price_min: '',
    price_max: '',
  });

  // Debounce helper
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetch = useCallback(
    debounce((newFilters) => {
      fetchServices(newFilters);
    }, 500),
    [fetchServices]
  );

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchServices({});
  }, [fetchCategories, fetchServices]);

  // Watch filter changes
  useEffect(() => {
    const filterPayload = {
      name: filters.name,
      location: filters.location,
      category_id: filters.category_id,
    };

    const min = parseFloat(filters.price_min);
    const max = parseFloat(filters.price_max);
    if (!isNaN(min) && !isNaN(max)) {
      filterPayload.price_between = `${min},${max}`;
    }

    debouncedFetch(filterPayload);
  }, [filters, debouncedFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Browse Services
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Search by name"
          className="border p-2 rounded col-span-2"
        />

        <select
          name="category_id"
          value={filters.category_id}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 rounded"
        />

        <div className="flex space-x-2">
          <input
            type="number"
            name="price_min"
            value={filters.price_min}
            onChange={handleChange}
            placeholder="Min Price"
            className="border p-2 rounded w-full"
            min={0}
          />
          <input
            type="number"
            name="price_max"
            value={filters.price_max}
            onChange={handleChange}
            placeholder="Max Price"
            className="border p-2 rounded w-full"
            min={0}
          />
        </div>
      </div>

      {/* Loading and Errors */}
      {loading && <p className="text-center">Loading services...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Service List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-1">{service.name}</h3>
            <p className="text-gray-500 text-sm mb-1">
              Category: {service.category?.name || 'N/A'}
            </p>
            <p className="text-gray-600 text-sm">Location: {service.location}</p>
            <p className="text-blue-600 font-semibold">${service.price}</p>

            <Link
              href={`/user/${service.id}/serviceDetailPage`}
              className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded text-center"
            >
              Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
