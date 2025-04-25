import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MedBook API Documentation',
        version: '1.0.0',
        description: 'API documentation for the MedBook Healthcare Booking System',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          Hospital: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              address: { type: 'string' },
              phone: { type: 'string' },
            },
            example: {
              id: "clh2x0f4b0001qw3j1234567",
              name: "General Hospital",
              address: "123 Main Street",
              phone: "555-0123"
            }
          },
          Service: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              duration: { type: 'integer' },
              price: { type: 'number' },
              hospitalId: { type: 'string' },
            },
            example: {
              id: "clh2x0f4b0002qw3j1234567",
              name: "General Check-up",
              description: "Complete physical examination",
              duration: 30,
              price: 100,
              hospitalId: "clh2x0f4b0001qw3j1234567"
            }
          },
          TimeSlot: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              startTime: { type: 'string', format: 'date-time' },
              endTime: { type: 'string', format: 'date-time' },
              available: { type: 'boolean' },
            },
            example: {
              id: "clh2x0f4b0003qw3j1234567",
              startTime: "2024-01-20T09:00:00Z",
              endTime: "2024-01-20T09:30:00Z",
              available: true
            }
          },
          Booking: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              hospitalId: { type: 'string' },
              serviceId: { type: 'string' },
              timeSlotId: { type: 'string' },
              status: { type: 'string', enum: ['confirmed', 'cancelled'] },
              createdAt: { type: 'string', format: 'date-time' },
            },
            example: {
              id: "clh2x0f4b0004qw3j1234567",
              userId: "clh2x0f4b0000qw3j1234567",
              hospitalId: "clh2x0f4b0001qw3j1234567",
              serviceId: "clh2x0f4b0002qw3j1234567",
              timeSlotId: "clh2x0f4b0003qw3j1234567",
              status: "confirmed",
              createdAt: "2024-01-20T10:30:00Z"
            }
          },
        },
      },
    },
  });
  return spec;
};
