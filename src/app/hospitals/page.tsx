"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Hospital, Service, TimeSlot } from '@/types/hospital';
import HospitalList from './components/HospitalList';
import ServiceSelection from './components/ServiceSelection';
import BookingForm from '@/app/hospitals/components/BookingForm';

export default function HospitalsPage() {
  const router = useRouter();
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingError, setBookingError] = useState<string>('');
  const [bookingStep, setBookingStep] = useState<number>(1);

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setSelectedService(null);
    setBookingStep(2);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingStep(3);
  };

  const handleBookingSubmit = async (timeSlot: TimeSlot) => {
    try {
      if (!selectedHospital || !selectedService) {
        throw new Error('Please select a hospital and service');
      }

      const response = await fetch('/api/appointments', {  // Changed from /api/bookings
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hospitalId: selectedHospital.id,
          serviceId: selectedService.id,
          timeSlot,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      // Reset form
      setSelectedHospital(null);
      setSelectedService(null);
      setBookingStep(1);
      
      // Redirect to success page with appointment date
      router.push(`/booking-success?date=${encodeURIComponent(timeSlot.startTime)}`);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((bookingStep - 1) / 2) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {[
                { step: 1, label: 'Select Hospital' },
                { step: 2, label: 'Choose Service' },
                { step: 3, label: 'Book Appointment' },
              ].map(({ step, label }) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full
                      border-2 transition-all duration-300 mb-2
                      ${bookingStep === step
                        ? 'border-primary bg-primary text-white'
                        : bookingStep > step
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 bg-white text-gray-400'
                      }
                    `}
                  >
                    {bookingStep > step ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{step}</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    bookingStep >= step ? 'text-foreground' : 'text-muted'
                  }`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Step 1: Hospital Selection */}
            <div className={bookingStep === 1 ? 'block' : 'hidden'}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-foreground/10 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Select a Hospital</h2>
                  <p className="text-muted mb-6">Choose from our network of trusted healthcare facilities</p>
                  <HospitalList
                    selectedHospital={selectedHospital}
                    onHospitalSelect={handleHospitalSelect}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Service Selection */}
            {bookingStep === 2 && selectedHospital && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-foreground/10 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Choose a Service</h2>
                  <p className="text-muted mb-6">Select the medical service you need</p>
                  <ServiceSelection
                    hospitalId={selectedHospital.id}
                    selectedService={selectedService}
                    onServiceSelect={handleServiceSelect}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Booking Form */}
            {bookingStep === 3 && selectedHospital && selectedService && (
              <BookingForm
                hospitalId={selectedHospital.id}
                serviceId={selectedService.id}
                onSubmit={handleBookingSubmit}
                error={bookingError}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {bookingStep > 1 && (
              <button
                onClick={() => setBookingStep(bookingStep - 1)}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous Step
              </button>
            )}
            {bookingStep < 3 && selectedHospital && (bookingStep === 1 || selectedService) && (
              <button
                onClick={() => setBookingStep(bookingStep + 1)}
                className="ml-auto inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                Next Step
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
