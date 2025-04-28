"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import type { SwaggerUIProps } from "swagger-ui-react";

export default function ApiDocs() {
  const [spec, setSpec] = useState<SwaggerUIProps["spec"]>(undefined);

  useEffect(() => {
    fetch("/api/docs")
      .then((response) => response.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          height: '32px',
          width: '25%',
          marginBottom: '16px'
        }}></div>
        <div style={{
          background: 'rgba(59, 130, 246, 0.05)',
          borderRadius: '8px',
          height: '384px'
        }}></div>
      </div>
    );
  }

  return <SwaggerUI spec={spec} />;
}
