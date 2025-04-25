'use client';

import { useEffect, useState } from 'react';
import { Hospital } from '@/types/hospital';

type Props = {
  selectedHospital: Hospital | null;
  onHospitalSelect: (hospital: Hospital) => void;
};

export default function HospitalList({ selectedHospital, onHospitalSelect }: Props) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch('/api/hospitals');
        if (!response.ok) throw new Error('Failed to fetch hospitals');
        const data = await response.json();
        setHospitals(data);
      } catch (err) {
        setError('Failed to load hospitals');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  if (loading) return <div>Loading hospitals...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Select a Hospital</h2>
      {hospitals.map((hospital) => (
        <div
          key={hospital.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedHospital?.id === hospital.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => onHospitalSelect(hospital)}
        >
          <h3 className="font-medium">{hospital.name}</h3>
          <p className="text-sm text-gray-600">{hospital.address}</p>
          <p className="text-sm text-gray-600">{hospital.phone}</p>
        </div>
      ))}
    </div>
  );
}