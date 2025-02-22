// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const message = searchParams.get("message");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      if (!token) {
        setError(message || " Token not found");
        return;
      }

      try {
        // Store the token
        localStorage.setItem("authToken", token);

        // Verify the token by fetching user data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Invalid authentication token");
        }

        // Token is valid, redirect to dashboard
        router.push("/dashboard");
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("authToken");
      }
    };

    handleCallback();
  }, [token, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Completing authentication...
        </h2>
      </div>
    </div>
  );
}
