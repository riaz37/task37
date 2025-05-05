"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import type { SwaggerUIProps } from "swagger-ui-react";

export default function ApiDocs() {
  const [spec, setSpec] = useState<SwaggerUIProps["spec"]>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((response) => response.json())
      .then((data) => setSpec(data));
  }, []);

  const fetchToken = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/token");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch token");
      }

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
      } else {
        throw new Error("No token returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Token fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!spec) {
    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "8px",
            height: "32px",
            width: "25%",
            marginBottom: "16px",
          }}
        ></div>
        <div
          style={{
            background: "rgba(59, 130, 246, 0.05)",
            borderRadius: "8px",
            height: "384px",
          }}
        ></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={fetchToken}
            disabled={isLoading}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Loading..." : "Get Auth Token"}
          </button>

          {token && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "#10b981", marginRight: "8px" }}>✓</span>
              <span>Token retrieved successfully</span>
            </div>
          )}

          {error && <div style={{ color: "#ef4444" }}>Error: {error}</div>}
        </div>

        {token && (
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "12px",
              borderRadius: "4px",
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            <p style={{ marginBottom: "8px", fontWeight: "bold" }}>
              How to use the token:
            </p>
            <ol style={{ paddingLeft: "24px", margin: 0 }}>
              <li>Click the &quot;Authorize&quot; button at the top of the page</li>
              <li>
                In the &quot;BearerAuth&quot; section, enter: <code>Bearer {token}</code>
              </li>
              <li>Click &quot;Authorize&quot; and close the dialog</li>
              <li>Now your API requests will include authentication</li>
            </ol>
          </div>
        )}
      </div>

      <SwaggerUI spec={spec} docExpansion="list" />
    </div>
  );
}
