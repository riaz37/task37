export type Hospital = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export type Service = {
  id: string;
  hospitalId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
};

export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
};

export type Booking = {
  id: string;
  hospitalId: string;
  serviceId: string;
  userId: string;
  timeSlot: TimeSlot;
  status: 'pending' | 'confirmed' | 'cancelled';
};