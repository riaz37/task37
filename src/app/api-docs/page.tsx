"use client";

import { useEffect, useState } from "react";
import SwaggerUI from 'swagger-ui-react';
import type { SwaggerUIProps } from 'swagger-ui-react';
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocs() {
  const [spec, setSpec] = useState<SwaggerUIProps['spec']>(undefined);

  useEffect(() => {
    fetch("/api/docs")
      .then((response) => response.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-primary/10 rounded-lg w-1/4 mb-4"></div>
          <div className="h-96 bg-primary/5 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">API Documentation</h1>
          <p className="text-muted">
            Explore and integrate with our healthcare booking API
          </p>
        </div>
        <div className="border border-foreground/10 rounded-xl overflow-hidden shadow-lg swagger-wrapper">
          <SwaggerUI spec={spec} />
        </div>
      </div>
    </div>
  );
}
