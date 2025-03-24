"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

// Create a separate component for the verification form that uses useSearchParams
function VerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "";

  // Change to array of single characters for segmented input
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      router.push("/auth/login");
    }
  }, [email, router]);

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    // Auto-focus to next input if value is entered
    if (value !== "" && index < verificationCode.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Navigate using arrow keys
    if (e.key === "ArrowRight" && index < verificationCode.length - 1) {
      inputRefs.current[index + 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "Backspace" && verificationCode[index] === "" && index > 0) {
      // Move to previous input when pressing backspace on an empty input
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    if (!/^\d+$/.test(paste)) return; // Only allow numbers

    const pastedChars = paste.split("").slice(0, verificationCode.length);
    const newVerificationCode = [...verificationCode];
    
    pastedChars.forEach((char, index) => {
      newVerificationCode[index] = char;
    });
    
    setVerificationCode(newVerificationCode);
    
    // Focus the input after the last pasted character or the last input
    const focusIndex = Math.min(pastedChars.length, verificationCode.length - 1);
    inputRefs.current[focusIndex].focus();
  };

  const resendVerificationCode = async () => {
    setResending(true);
    setError("");
    setResendSuccess(false);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verifcation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, userType: type }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification code");
      }
      
      setResendSuccess(true);
      // Clear verification code inputs
      setVerificationCode(["", "", "", "", "", ""]);
      // Focus on first input
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const code = verificationCode.join("");
    if (code.length !== verificationCode.length) {
      setError("Please enter the complete verification code");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code, userType: type }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Store the JWT token
      localStorage.setItem("authToken", data.token);
      if (data.userType == "candidate") {
        router.push("/candidate/profile");
      } else if (data.userType == "hr") {
        // Handle HR login
        if (data.subdomain) {
          window.location.href = `https://${data.subdomain}.${window.location.host}`;
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen text-xl bg-md-background">
      {/* Left pane - Image and brand content */}
      <div className="hidden md:flex md:w-1/2 bg-md-primary p-8 flex-col justify-between relative overflow-hidden">
        <div className="flex items-center gap-3 z-10">
          <div className="h-12 w-12 rounded-xl bg-md-on-primary flex items-center justify-center">
            <span className="text-md-primary text-2xl font-bold">A</span>
          </div>
          <h1 className="text-md-on-primary text-2xl font-bold">Aptinova</h1>
        </div>

        {/* Floating SVG shapes */}
        <div className="absolute inset-0 w-full h-full">
          {/* Shape 1 */}
          <div className="absolute top-1/4 left-1/4 animate-float-slow opacity-50 z-0">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 h-32 text-md-on-primary"
            >
              <path
                fill="currentColor"
                d="M48.8,-76.3C62.6,-68.5,72.5,-54.1,79.2,-38.6C85.9,-23.1,89.4,-6.4,85,8C80.5,22.4,68.2,34.5,56.5,46.3C44.9,58.1,33.8,69.5,19.2,75.6C4.6,81.7,-13.7,82.5,-30.2,77.6C-46.7,72.7,-61.4,62.2,-72.1,48C-82.8,33.9,-89.5,17,-88.9,0.3C-88.3,-16.3,-80.3,-32.7,-69.5,-45.9C-58.7,-59.1,-45,-69.2,-30.7,-76.3C-16.4,-83.5,-1.4,-87.7,12.9,-85.7C27.3,-83.7,35,-84.2,48.8,-76.3Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
          
          {/* Shape 2 */}
          <div className="absolute bottom-1/3 right-1/4 animate-float opacity-60 z-0">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 text-md-on-primary"
            >
              <path
                fill="currentColor"
                d="M45.3,-70.5C58.3,-61.5,68.1,-47.8,73.8,-32.6C79.4,-17.5,80.9,-0.9,77.7,14.4C74.4,29.7,66.6,43.7,55.4,54.8C44.2,65.9,29.6,74.2,14.2,76.8C-1.2,79.5,-17.5,76.5,-29.4,68.2C-41.3,59.8,-48.8,46.2,-55.7,32.5C-62.6,18.9,-68.9,5.3,-70.1,-9.7C-71.3,-24.7,-67.5,-41.2,-58,-54.7C-48.4,-68.2,-34.2,-78.8,-18.7,-80.9C-3.3,-83,15.3,-76.5,30.8,-70.6C46.3,-64.7,58.7,-59.3,45.3,-70.5Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
          
          {/* Shape 3 */}
          <div className="absolute top-1/2 right-1/3 animate-float-reverse opacity-40 z-0">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-40 h-40 text-md-on-primary"
            >
              <path
                fill="currentColor"
                d="M32.5,-50.5C43.9,-42.1,55.9,-35.5,63.5,-24.5C71.1,-13.5,74.2,1.8,72.5,17.3C70.8,32.7,64.4,48.2,52.9,58.6C41.3,69.1,24.7,74.4,8.3,73.9C-8.1,73.4,-24.1,67.1,-36.3,57.5C-48.6,47.8,-57,34.8,-59.5,21.3C-62,7.9,-58.6,-6,-54.1,-19.2C-49.7,-32.5,-44.1,-45.1,-34.8,-54.3C-25.5,-63.5,-12.7,-69.3,-0.5,-68.5C11.7,-67.7,23.5,-60.3,32.5,-50.5Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>

        <div className="text-center flex flex-col items-center z-10">
          <div className="mb-8 max-w-md">
            <h2 className="text-3xl font-bold text-md-on-primary mb-4">
              Verify Your Account
            </h2>
            <p className="text-md-on-primary opacity-80 text-lg">
              Almost there! Just one more step to access your account.
            </p>
          </div>
        </div>

        <div className="text-md-on-primary text-sm z-10">
          &copy; {new Date().getFullYear()}{" "}
          {`${process.env.NEXT_PUBLIC_APP_NAME}`} All rights reserved.
        </div>
      </div>

      {/* Right pane - Verification form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Small logo for mobile only */}
          <div className="flex md:hidden items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-md-primary flex items-center justify-center">
              <span className="text-md-on-primary text-xl font-bold">A</span>
            </div>
            <h1 className="text-md-on-surface text-xl font-bold">Aptinova</h1>
          </div>

          <div className="bg-md-surface-container p-8 rounded-3xl shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-md-on-surface">
              Verify Your Email
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-md-error-container text-md-on-error-container rounded-lg">
                {error}
              </div>
            )}

            <p className="mb-4 text-md-on-surface-variant">
              We've sent a verification code to <strong>{email}</strong>.
              Please enter it below:
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-md-on-surface-variant text-sm mb-2">
                  Verification Code
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      ref={(el) => (inputRefs.current[index] = el)}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-medium rounded-xl border border-md-outline focus:border-md-primary focus:outline-none bg-transparent text-md-on-surface"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <p className="mt-2 text-center text-sm text-md-on-surface-variant">
                  Didn't receive the code?{" "}
                  <button 
                    type="button" 
                    className="text-md-primary font-medium hover:underline disabled:opacity-50"
                    onClick={resendVerificationCode}
                    disabled={resending}
                  >
                    {resending ? "Sending..." : "Resend"}
                  </button>
                </p>
                {resendSuccess && (
                  <p className="mt-2 text-center text-sm text-green-600">
                    A new verification code has been sent to your email.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.some(digit => digit === "")}
                className="w-full mt-6 py-2 px-4 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-md-primary font-medium hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes float-reverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function Verify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationForm />
    </Suspense>
  );
}
