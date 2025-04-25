'use client';

import { useEffect, useState } from 'react';
import { TimeSlot } from '@/types/hospital';
import { format } from 'date-fns';

type Props = {
  hospitalId: string;
  serviceId: string;
  onSubmit: (timeSlot: TimeSlot) => void;
  error?: string;
};

export default function BookingForm({
  hospitalId,
  serviceId,
  onSubmit,
  error,
}: Props) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/hospitals/${hospitalId}/services/${serviceId}/time-slots?date=${selectedDate}`
        );
        if (!response.ok) throw new Error('Failed to fetch time slots');
        const data = await response.json();
        setTimeSlots(data);
        setSelectedSlot(null);
      } catch (error) {
        setFetchError(`Failed to load available time slots: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [hospitalId, serviceId, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    onSubmit(selectedSlot);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-muted">Loading available time slots...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-red-600">{fetchError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-foreground/10 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Schedule Your Appointment</h2>
          
          {/* Date Selection */}
          <div className="mb-8">
            <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
              Select Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.length === 0 ? (
                <div className="col-span-full bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-muted">
                    No available time slots for the selected date
                  </p>
                </div>
              ) : (
                timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => slot.available && setSelectedSlot(slot)}
                    className={`
                      relative p-4 rounded-lg border transition-all
                      ${selectedSlot?.id === slot.id
                        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary'
                        : slot.available
                        ? 'border-gray-200 hover:border-primary hover:bg-primary/5'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      }
                    `}
                  >
                    <time className="font-medium">
                      {format(new Date(slot.startTime), 'h:mm a')}
                    </time>
                    {selectedSlot?.id === slot.id && (
                      <span className="absolute top-0 right-0 -mt-2 -mr-2 px-2 py-1 text-xs font-medium text-white bg-primary rounded-full">
                        Selected
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-600">{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedSlot}
            className={`
              w-full py-3 px-4 rounded-lg text-sm font-medium transition-all
              ${selectedSlot
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {selectedSlot ? (
              <span className="flex items-center justify-center gap-2">
                Confirm Booking for {format(new Date(selectedSlot.startTime), 'h:mm a')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            ) : (
              'Select a time slot to continue'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
