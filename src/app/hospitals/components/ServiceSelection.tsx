"use client";

import { useEffect, useState } from "react";
import { Service } from "@/types/hospital";

type Props = {
  hospitalId: string;
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
};

export default function ServiceSelection({
  hospitalId,
  selectedService,
  onServiceSelect,
}: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/hospitals/${hospitalId}/services`);
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError(
          `Failed to load services: ${error instanceof Error ? error.message : String(error)}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [hospitalId]);

  if (loading) return <div>Loading services...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
      {services.map((service) => (
        <div
          key={service.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedService?.id === service.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
          onClick={() => onServiceSelect(service)}
        >
          <h3 className="font-medium">{service.name}</h3>
          <p className="text-sm text-gray-600">{service.description}</p>
          <div className="mt-2 flex justify-between text-sm">
            <span>Duration: {service.duration} minutes</span>
            <span>Price: ${service.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
