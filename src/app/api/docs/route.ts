import { NextResponse } from 'next/server';
import { createSwaggerSpec } from 'next-swagger-doc';

const spec = createSwaggerSpec({
  apiFolder: 'src/app/api',
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MedBook API Documentation',
      version: '1.0.0',
    },
  },
});

export async function GET() {
  return NextResponse.json(spec);
}
