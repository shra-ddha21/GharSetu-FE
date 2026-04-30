import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export function useBooking() {
  return useContext(BookingContext);
}

export function BookingProvider({ children }) {
  const [selectedProviders, setSelectedProviders] = useState(() => {
    const saved = localStorage.getItem('selectedProviders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [requirement, setRequirement] = useState(() => localStorage.getItem('booking_requirement') || '');
  const [preferredDate, setPreferredDate] = useState(() => localStorage.getItem('booking_date') || '');

  useEffect(() => {
    localStorage.setItem('selectedProviders', JSON.stringify(selectedProviders));
  }, [selectedProviders]);

  useEffect(() => {
    localStorage.setItem('booking_requirement', requirement);
  }, [requirement]);

  useEffect(() => {
    localStorage.setItem('booking_date', preferredDate);
  }, [preferredDate]);

  const toggleSelection = (id) => {
    setSelectedProviders((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= 5) {
        alert('You can select a maximum of 5 providers per request.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const clearSelection = () => {
    setSelectedProviders([]);
    setRequirement('');
    setPreferredDate('');
    localStorage.removeItem('selectedProviders');
    localStorage.removeItem('booking_requirement');
    localStorage.removeItem('booking_date');
  };

  const value = {
    selectedProviders,
    toggleSelection,
    clearSelection,
    requirement,
    setRequirement,
    preferredDate,
    setPreferredDate
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
