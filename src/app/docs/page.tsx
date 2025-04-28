'use client';

import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(
  () => import('swagger-ui-react').then((mod) => mod.default),
  { ssr: false }
);

export default function ApiDocs() {
  return (
    <div className="container mx-auto p-4">
      <SwaggerUI url="/api/docs" />
    </div>
  );
}