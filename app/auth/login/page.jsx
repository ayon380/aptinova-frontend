"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { startAuthentication } from "@simplewebauthn/browser";

export default function Login() {
  const router = useRouter();
  const [supportsPasskeys, setSupportsPasskeys] = useState(false);
  const [showOrgOptions, setShowOrgOptions] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "candidate",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  useEffect(() => {
    const checkPasskeySupport = async () => {
      try {
        // Check if the browser supports passkeys
        const available =
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setSupportsPasskeys(available);

        // If passkeys are supported, try to auto-trigger passkey login
        if (available) {
          triggerAutoPasskeyLogin();
        }
      } catch (error) {
        setSupportsPasskeys(false);
      }
    };
    checkPasskeySupport();
    
    // Check for userType in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userTypeParam = urlParams.get('userType');
    
    if (userTypeParam) {
      if (userTypeParam === 'hr' || userTypeParam === 'hrManager') {
        setShowOrgOptions(true);
        setFormData(prev => ({ ...prev, userType: userTypeParam }));
      } else if (userTypeParam === 'candidate') {
        setShowOrgOptions(false);
        setFormData(prev => ({ ...prev, userType: userTypeParam }));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hide org options when changing other fields
    if (name !== "userType" && showOrgOptions) {
      setShowOrgOptions(false);
    }
  };

  const handleUserTypeSelect = (type) => {
    if (type === "organization") {
      setShowOrgOptions(true);
    } else {
      setShowOrgOptions(false);
      setFormData((prev) => ({ ...prev, userType: type }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(
        "/auth/verify?email=" +
          encodeURIComponent(formData.email) +
          "&type=" +
          formData.userType
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerAutoPasskeyLogin = async () => {
    try {
      // Get authentication options with conditional mediation
      const optionsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/passkey/authenticate/options`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const res = await optionsRes.json();
      const options = res.options;
      const sessionId = res.sessionId;
      console.log(options);

      if (!optionsRes.ok) return; // Silently fail for auto-trigger

      try {
        // Start authentication with conditional mediation
        const asseResp = await startAuthentication({
          ...options,
          mediation: "conditional",
        });

        // Verify the credential
        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/passkey/authenticate/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asseResp,
              sessionId,
            }),
          }
        );

        const verifyResult = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(verifyResult.error);
        localStorage.setItem("authToken", verifyResult.token);

        // Handle successful login
        if (verifyResult.subdomain) {
          router.push(
            `https://${verifyResult.subdomain}.${window.location.host}`
          );
        } else {
          router.push("/home");
        }
      } catch (error) {
        // Silent fail for auto-trigger
        console.log("Auto passkey login failed", error);
      }
    } catch (err) {
      console.log("Error getting passkey options", err);
    }
  };

  const handlePasskeyLogin = async () => {
    if (!formData.email || !formData.userType) {
      setError("Please enter your email and select user type");
      return;
    }

    setPasskeyLoading(true);
    setError("");

    try {
      // Get authentication options
      const optionsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/passkey/authenticate/options`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            userType: formData.userType,
          }),
        }
      );

      const options = await optionsRes.json();
      if (!optionsRes.ok) throw new Error(options.error);

      // Get credential from browser
      console.log(options);

      let asseResp;
      try {
        // Pass the options to the authenticator and wait for a response
        asseResp = await startAuthentication({
          ...options,
          mediation: "conditional",
        });
      } catch (error) {
        // Some basic error handling
        window.alert("An error occurred during authentication.");
        throw error;
      }

      // Verify the credential
      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/passkey/authenticate/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            asseResp,
          }),
        }
      );

      const verifyResult = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyResult.error);
      localStorage.setItem("authToken", verifyResult.token);

      // Handle successful login
      if (verifyResult.subdomain) {
        router.push(
          `https://${verifyResult.subdomain}.${window.location.host}`
        );
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <div className="flex h-dvh text-xl bg-md-background">
      {/* Left pane - Image and brand content */}
      <div className="hidden md:flex md:w-1/2 bg-md-primary p-8 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-md-on-primary flex items-center justify-center">
            <span className="text-md-primary text-2xl font-bold">A</span>
          </div>
          <h1 className="text-md-on-primary text-2xl font-bold">Aptinova</h1>
        </div>

        <div className="text-center flex flex-col items-center">
          <div className="mb-8 max-w-md">
            <h2 className="text-3xl font-bold text-md-on-primary mb-4">
              Welcome Back
            </h2>
            <p className="text-md-on-primary  opacity-80 text-lg">
              Connect with the best opportunities tailored to your skills and
              experience
            </p>
          </div>
          <div className="w-64 h-64 relative mb-8">
            <div className="wavy-line absolute bottom-0 w-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-48 h-48 text-md-on-primary opacity-90"
              >
                <path
                  fill="currentColor"
                  d="M45.7,-64.2C58.9,-53.9,69.2,-39.6,75.6,-23.2C82,-6.8,84.6,11.8,78.9,27.2C73.3,42.6,59.4,54.7,44.1,63.5C28.8,72.3,12,77.8,-3.9,83C-19.7,88.2,-39.5,93,-55.8,85.3C-72,77.6,-84.7,57.5,-87,37.1C-89.3,16.8,-81.1,-3.7,-72.5,-21.5C-63.9,-39.2,-54.8,-54.1,-42,-64.4C-29.1,-74.8,-12.6,-80.6,2.3,-83.7C17.2,-86.8,32.4,-74.5,45.7,-64.2Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-md-on-primary  text-sm">
          &copy; {new Date().getFullYear()}{" "}
          {`${process.env.NEXT_PUBLIC_APP_NAME}`} All rights reserved.
        </div>
      </div>

      {/* Right pane - Login form */}
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
              Sign in
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-md-error-container text-md-on-error-container rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="username webauthn"
                  required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                />
                <label
                  htmlFor="email"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Email Address
                </label>
              </div>

              <div className="relative mt-5">
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                />
                <label
                  htmlFor="password"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Password
                </label>
              </div>

              <div className="flex justify-end mt-1">
                <Link
                  href="/auth/forgot-password"
                  className="text-md-primary text-sm hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="mt-5">
                <label className="block text-md-on-surface-variant mb-2">
                  User Type
                </label>
                <div className="relative">
                  {/* User Type Tabs */}
                  <div className="flex w-full rounded-full bg-md-surface-container-high mb-3 p-1 relative">
                    <button
                      type="button"
                      onClick={() => handleUserTypeSelect("candidate")}
                      className={`flex-1 relative py-2 rounded-full text-center transition-all duration-300 z-10 ${
                        !showOrgOptions ? "text-md-on-primary" : "text-md-on-surface"
                      }`}
                    >
                      <span className="relative z-10">Candidate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOrgOptions(true)}
                      className={`flex-1 relative py-2 rounded-full text-center transition-all duration-300 z-10 ${
                        showOrgOptions ? "text-md-on-primary" : "text-md-on-surface"
                      }`}
                    >
                      <span className="relative z-10">Organization</span>
                    </button>
                    
                    {/* Slider background */}
                    <div 
                      className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-md-primary transition-all duration-300 ease-in-out ${
                        showOrgOptions ? "left-[calc(50%+2px)]" : "left-1"
                      }`}
                    />
                  </div>
                  
                  {/* Content Container with Sliding Animation */}
                  <div className="relative overflow-hidden rounded-2xl h-[110px]">
                    {/* Candidate Option */}
                    <div 
                      className={`absolute top-0 w-full h-full transition-all duration-300 ease-in-out ${
                        showOrgOptions ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
                      }`}
                    >
                      <div className="p-4 rounded-2xl bg-md-primary-container h-full flex items-center">
                        <div className="flex items-center">
                          <svg
                            className="w-6 h-6 mr-3"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                          <div>
                            <p className="font-medium text-md-on-primary-container">Candidate</p>
                            <p className="text-sm text-md-on-primary-container/80">Looking for opportunities</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Organization Options */}
                    <div 
                      className={`absolute top-0 w-full h-full transition-all duration-300 ease-in-out ${
                        showOrgOptions ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, userType: "hr" }))}
                          className={`p-3 rounded-2xl flex items-center transition-all duration-300 ${
                            formData.userType === "hr"
                              ? "bg-md-primary-container text-md-on-primary-container"
                              : "bg-md-surface-container-high text-md-on-surface"
                          }`}
                        >
                          <svg
                            className="w-5 h-5 mr-2 flex-shrink-0"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                            <circle cx="9" cy="13" r="2" />
                            <path d="M19 17.13v-2.13c0-1.25-.77-2.34-2-2.8l-2 2-2-2c-.63.23-1.12.67-1.45 1.21 1.4.72 2.45 2.12 2.45 3.72v1.87h5v-1.87z" />
                          </svg>
                          <span className="font-medium text-sm">HR</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, userType: "hrManager" }))}
                          className={`p-3 rounded-2xl flex items-center transition-all duration-300 ${
                            formData.userType === "hrManager"
                              ? "bg-md-primary-container text-md-on-primary-container"
                              : "bg-md-surface-container-high text-md-on-surface"
                          }`}
                        >
                          <svg
                            className="w-5 h-5 mr-2 flex-shrink-0"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16.5 12c1.38 0 2.5-1.12 2.5-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.5c0-.85.33-2.34 2.37-3.49C10.48 13.06 9.75 13 9 13z" />
                          </svg>
                          <span className="font-medium text-sm">HR Manager</span>
                        </button>
                      </div>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowOrgOptions(false);
                            setFormData(prev => ({ ...prev, userType: "candidate" }));
                          }}
                          className="text-md-primary text-xs flex items-center hover:underline"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                          </svg>
                          Back to Candidate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <input
                  type="hidden"
                  name="userType"
                  value={formData.userType}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-2 px-4 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? "Logging in..." : "Sign in with Password"}
              </button>

              {/* {supportsPasskeys && (
                <button
                  type="button"
                  onClick={handlePasskeyLogin}
                  disabled={passkeyLoading}
                  className="w-full mt-3 py-2 px-4 rounded-3xl bg-md-secondary-container text-md-on-secondary-container hover:bg-md-secondary hover:text-md-on-secondary disabled:opacity-50 transition-colors duration-200"
                >
                  {passkeyLoading
                    ? "Authenticating..."
                    : "Sign in with Passkey"}
                </button>
              )} */}
            </form>

            <div className="mt-6 text-center">
              <div className="opacity-85 text-md-on-surface-variant">
                Don't have an account?{" "}
              </div>
              <Link
                href="/auth/signup"
                className="text-md-primary font-medium hover:underline"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-md-outline-variant"></div>
              <div className="px-4 absolute bg-md-background text-md-on-surface-variant text-sm">
                Or continue with
              </div>
            </div>

            <div className="mt-6 flex w-full justify-center space-x-4">
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google?userType=${formData.userType}&action=login`}
                className="flex items-center justify-center py-2 px-8 bg-md-surface-container rounded-3xl hover:bg-md-surface-container-high transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path
                      fill="#4285F4"
                      d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    />
                  </g>
                </svg>
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/microsoft?userType=${formData.userType}&action=login`}
                className="flex items-center justify-center py-2 px-8 bg-md-surface-container rounded-3xl hover:bg-md-surface-container-high transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 23 23"
                >
                  <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/linkedin?userType=${formData.userType}&action=login`}
                className="flex items-center justify-center py-2 px-8 bg-md-surface-container rounded-3xl hover:bg-md-surface-container-high transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#0A66C2"
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.223 0h.002z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
