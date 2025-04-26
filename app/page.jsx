"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const SUBSCRIPTION_PLANS = {
  CANDIDATE: {
    FREE: {
      name: "Candidate Free",
      amount: 0,
      period: "monthly",
      interval: 1,
      features: [
        "Limited Profile Access",
        "Up to 3 tests per month",
        "Basic Support",
      ],
    },
    PRO: {
      name: "Candidate Pro",
      amount: 999,
      period: "monthly",
      interval: 1,
      features: [
        "Full Profile Access",
        "Unlimited tests",
        "Priority Matching",
        "Priority Support",
      ],
    },
  },
  HR_MANAGER: {
    FREE: {
      name: "HR Free",
      amount: 0,
      period: "monthly",
      interval: 1,
      features: ["Basic ATS", "Up to 3 job posts", "Limited Candidate Search"],
    },
    STARTUP: {
      name: "HR Startup",
      amount: 9999,
      period: "monthly",
      interval: 1,
      features: [
        "Advanced ATS",
        "Up to 10 job posts",
        "Full AI Analysis",
        "Email Support",
      ],
    },
    ENTERPRISE: {
      name: "HR Enterprise",
      amount: 99999,
      period: "monthly",
      interval: 1,
      features: [
        "Advanced ATS",
        "Unlimited job posts",
        "Full AI Analysis",
        "24/7 Support",
        "Custom Branding",
      ],
    },
    CUSTOM: {
      name: "HR Custom",
      period: "monthly",
      interval: 1,
      features: [
        "Custom Features",
        "Custom Support Level",
        "White Labeling",
        "API Access",
      ],
    },
  },
};

// Features showcased on the landing page
const features = [
  {
    title: "AI-Powered Assessments",
    description:
      "Accurately evaluate candidate skills and potential with our advanced AI testing engine.",
    icon: "brain-circuit",
  },
  {
    title: "Bias-Free Hiring",
    description:
      "Eliminate unconscious bias with objective evaluation metrics that focus on skills and ability.",
    icon: "balance-scale",
  },
  {
    title: "Faster Time-to-Hire",
    description:
      "Reduce your hiring timeline by up to 70% with automated screening and intelligent matching.",
    icon: "clock-fast",
  },
  {
    title: "Smart Candidate Matching",
    description:
      "Our AI identifies the perfect candidates for your open positions based on skills, experience, and culture fit.",
    icon: "puzzle-match",
  },
  {
    title: "Data-Driven Insights",
    description:
      "Gain valuable insights into your hiring process with comprehensive analytics and reporting.",
    icon: "chart-insights",
  },
  {
    title: "Seamless Integration",
    description:
      "Easily integrate with your existing HR systems to create a unified recruitment workflow.",
    icon: "connect-systems",
  },
];

// Testimonials showcased on the landing page
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "HR Director",
    company: "TechGlobal Inc.",
    quote:
      "Aptinova has revolutionized our hiring process. We've reduced time-to-hire by 65% while significantly improving the quality of our hires.",
    image: "/images/testimonial1.jpg",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    company: "Hired via Aptinova",
    quote:
      "The assessment process was refreshingly relevant to the actual job. I felt evaluated on my real skills rather than arbitrary metrics.",
    image: "/images/testimonial2.jpg",
  },
  {
    name: "Priya Sharma",
    role: "Talent Acquisition Lead",
    company: "FutureWorks Solutions",
    quote:
      "The AI-driven insights have helped us identify top talent we would have missed using traditional screening methods.",
    image: "/images/testimonial3.jpg",
  },
];

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    hiring: 0,
    matching: 0,
    costs: 0,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const earthRef = useRef(null);
  // const router = useRouter();
  useEffect(() => {
    setIsLoaded(true);

    // Initialize Earth animation
    initEarthAnimation();

    // Animate stats on scroll
    const handleScroll = () => {
      const statsSection = document.getElementById("stats-section");
      if (
        statsSection &&
        window.scrollY > statsSection.offsetTop - window.innerHeight * 0.8
      ) {
        animateStats();
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to initialize 3D Earth animation
  const initEarthAnimation = () => {
    if (typeof window !== "undefined") {
      const earthContainer = earthRef.current;
      if (earthContainer) {
        // Add initialization for Earth animation
        // This is a placeholder for the animation setup
        console.log("Earth animation initialized");
      }
    }
  };

  // Function to animate stat counters
  const animateStats = () => {
    const duration = 2000; // ms
    const steps = 50;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        hiring: Math.floor(progress * 70),
        matching: Math.floor(progress * 85),
        costs: Math.floor(progress * 50),
      });

      if (currentStep === steps) {
        clearInterval(interval);
      }
    }, stepTime);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !mobileMenuOpen ? "hidden" : "auto";
  };

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  // Function to scroll to section and close menu
  const scrollToSection = (sectionId) => {
    closeMobileMenu();
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Adjust for header height
        behavior: "smooth",
      });
    }
  };

  // Function to render the appropriate icon for each feature
  const renderFeatureIcon = (iconName) => {
    switch (iconName) {
      case "brain-circuit":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a5 5 0 0 1 5 5c0 1.5-.5 2.5-2 3.5s-2 2-2 4h-2c0-2-.5-3-2-4s-2-2-2-3.5a5 5 0 0 1 5-5z" />
            <path d="M8 18h8" />
            <path d="M12 18v4" />
            <circle cx="7" cy="9" r="1" />
            <circle cx="17" cy="9" r="1" />
          </svg>
        );
      case "balance-scale":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v3" />
            <path d="M5 7h14" />
            <path d="M5 7l3 9" />
            <path d="M19 7l-3 9" />
            <path d="M8 16a2 2 0 0 0 4 0" />
            <path d="M16 16a2 2 0 0 0 4 0" />
          </svg>
        );
      case "clock-fast":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
            <path d="M19 3l1 1" />
            <path d="M21 6h-1" />
          </svg>
        );
      case "puzzle-match":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 9l-2 3h4l-2 3" />
            <path d="M5 9l2 3H3l2 3" />
            <path d="M10 4l2 3 2-3" />
            <path d="M10 20l2-3 2 3" />
          </svg>
        );
      case "chart-insights":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3v18h18" />
            <path d="M8 15l3-3 2 2 4-4" />
            <circle cx="19" cy="5" r="2" />
          </svg>
        );
      case "connect-systems":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="8" y="14" width="6" height="6" rx="1" />
            <path d="M8 7h6" />
            <path d="M11 7v7" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-md-background overflow-hidden">
      {/* Navbar with working mobile responsiveness */}
      <nav className="bg-md-surface/90 backdrop-blur-md px-4 sm:px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-md-primary flex items-center justify-center relative overflow-hidden group">
              <span className="text-md-on-primary text-xl font-bold relative z-10">
                A
              </span>
              <div className="absolute inset-0 bg-gradient-to-tr from-md-primary via-md-primary to-md-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <span className="text-md-on-surface text-xl font-bold">
              Aptinova
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-full text-md-on-surface focus:outline-none focus:ring-2 focus:ring-md-primary relative"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <a
              href="#features"
              onClick={() => scrollToSection("features")}
              className="text-md-on-surface hover:text-md-primary transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-md-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#how-it-works"
              onClick={() => scrollToSection("how-it-works")}
              className="text-md-on-surface hover:text-md-primary transition-colors relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-md-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#pricing"
              onClick={() => scrollToSection("pricing")}
              className="text-md-on-surface hover:text-md-primary transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-md-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#testimonials"
              onClick={() => scrollToSection("testimonials")}
              className="text-md-on-surface hover:text-md-primary transition-colors relative group"
            >
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-md-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <div className="hidden md:flex space-x-4 items-center">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-full text-md-primary hover:bg-md-surface-variant transition-colors relative overflow-hidden group"
            >
              <span className="relative z-10">Log In</span>
              <span className="absolute inset-0 bg-md-surface-variant scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors relative overflow-hidden group"
            >
              <span className="relative z-10">Sign Up</span>
              <span className="absolute inset-0 bg-md-primary-container scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-md-background/95 backdrop-blur-md z-40 transition-transform duration-300 md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="container mx-auto px-4 py-8 h-full flex flex-col">
            <div className="flex justify-end mb-8">
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-full text-md-on-surface hover:bg-md-surface-variant transition-colors relative"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col space-y-6 text-center mt-8">
              <a
                href="#features"
                onClick={() => scrollToSection("features")}
                className="text-md-on-surface text-2xl font-medium py-2 border-b border-md-outline-variant hover:text-md-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => scrollToSection("how-it-works")}
                className="text-md-on-surface text-2xl font-medium py-2 border-b border-md-outline-variant hover:text-md-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={() => scrollToSection("pricing")}
                className="text-md-on-surface text-2xl font-medium py-2 border-b border-md-outline-variant hover:text-md-primary transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                onClick={() => scrollToSection("testimonials")}
                className="text-md-on-surface text-2xl font-medium py-2 border-b border-md-outline-variant hover:text-md-primary transition-colors"
              >
                Testimonials
              </a>
            </div>

            <div className="mt-auto mb-10 flex flex-col space-y-4">
              <Link
                href="/auth/login"
                onClick={closeMobileMenu}
                className="w-full px-6 py-3 rounded-full border-2 border-md-outline text-md-on-surface hover:bg-md-surface-variant transition-colors text-center text-lg font-medium"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                onClick={closeMobileMenu}
                className="w-full px-6 py-3 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-center text-lg font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Earth Animation */}
      <section
        className={`relative bg-gradient-to-r from-md-primary-container to-md-tertiary-container overflow-hidden transition-opacity duration-1000 min-h-[90vh] flex items-center ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced animated background elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-md-primary opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 -left-20 w-40 h-40 rounded-full bg-md-primary opacity-20 animate-float"></div>
          <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-md-tertiary opacity-20 animate-float-delay"></div>

          {/* Additional floating elements with more variety */}
          <div className="absolute top-1/4 right-1/3 w-16 h-16 rounded-full bg-md-secondary opacity-10 animate-float-slow"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-md-tertiary opacity-10 animate-spin-slow"></div>

          {/* New geometric shapes for more uniqueness */}
          <div className="absolute top-10 left-1/4 w-20 h-20 opacity-10 animate-float-slow-alt">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z"
                fill="currentColor"
                className="text-md-secondary"
              />
            </svg>
          </div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 opacity-15 animate-spin-reverse-slow">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 20C0 8.95 8.95 0 20 0H80C91.05 0 100 8.95 100 20V80C100 91.05 91.05 100 80 100H20C8.95 100 0 91.05 0 80V20Z"
                fill="currentColor"
                className="text-md-primary"
              />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-md-on-surface mb-6 leading-tight transition-transform duration-1000 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                Hire Smarter with{" "}
                <span className="text-md-primary relative inline-block">
                  <span className="animate-text-glow">AI-Powered</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-2 text-md-primary/30"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,5 C20,0 50,10 80,5 L100,5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="animate-draw-line"
                    />
                  </svg>
                </span>{" "}
                Recruitment
              </h1>
              <p
                className={`text-xl text-md-on-surface-variant mb-8 transition-transform delay-300 duration-1000 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                Find the perfect candidates faster and eliminate bias with our
                AI-driven hiring platform that connects talent worldwide for
                humanity&#39;s development.
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-4 transition-transform delay-500 duration-1000 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <Link
                  href="/auth/signup?role=HRManager"
                  className="px-8 py-3 rounded-full bg-md-primary text-md-on-primary text-center hover:bg-md-primary-container hover:text-md-on-primary-container transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 text-lg font-medium relative overflow-hidden group"
                >
                  <span className="relative z-10">I&#39;m Hiring</span>
                  <span className="absolute inset-0 bg-md-primary-container scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
                <Link
                  href="/auth/signup?role=candidate"
                  className="px-8 py-3 rounded-full bg-md-tertiary text-md-on-tertiary text-center hover:bg-md-tertiary-container hover:text-md-on-tertiary-container transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 text-lg font-medium relative overflow-hidden group"
                >
                  <span className="relative z-10">I&#39;m Job Seeking</span>
                  <span className="absolute inset-0 bg-md-tertiary-container scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              </div>
            </div>
            <div
              className={`md:w-1/2 relative transition-transform delay-700 duration-1000 ${
                isLoaded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              {/* 3D Earth Animation */}
              <div
                ref={earthRef}
                className="relative w-full h-96 rounded-3xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-md-surface-variant to-md-surface rounded-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  {/* 3D Earth Globe Animation */}
                  <div className="globe-container w-full h-full relative">
                    {/* Earth Base */}
                    <div className="earth-sphere absolute w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="earth relative w-full h-full rounded-full animate-spin-slow">
                        {/* Earth surface texture */}
                        <div className="absolute inset-0 rounded-full overflow-hidden earth-texture"></div>
                      </div>

                      {/* Glow effect around earth */}
                      <div className="absolute inset-0 rounded-full glow-effect"></div>

                      {/* Connection Lines and Nodes */}
                      <div className="connection-lines absolute inset-0">
                        {/* Connection nodes */}
                        <div className="node node-1 absolute w-3 h-3 rounded-full bg-md-tertiary animate-pulse-slow"></div>
                        <div className="node node-2 absolute w-3 h-3 rounded-full bg-md-primary animate-pulse-slow"></div>
                        <div className="node node-3 absolute w-3 h-3 rounded-full bg-md-secondary animate-pulse-slow"></div>
                        <div className="node node-4 absolute w-3 h-3 rounded-full bg-md-error animate-pulse-slow"></div>
                        <div className="node node-5 absolute w-3 h-3 rounded-full bg-md-tertiary animate-pulse-slow"></div>

                        {/* Connection arcs */}
                        <div className="connection-arc arc-1 absolute"></div>
                        <div className="connection-arc arc-2 absolute"></div>
                        <div className="connection-arc arc-3 absolute"></div>
                      </div>

                      {/* Orbiting elements */}
                      <div className="orbit orbit-1 absolute inset-0 animate-spin-slow">
                        <div className="satellite w-5 h-5 absolute -top-1 left-1/2 transform -translate-x-1/2">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                              fill="var(--md-primary)"
                            />
                            <path
                              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                              fill="var(--md-primary)"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Floating profile cards */}
                      <div className="absolute profile-card card-1 w-12 h-16 bg-md-surface-container-high rounded-lg shadow-lg animate-float-orbit">
                        <div className="w-6 h-6 rounded-full bg-md-primary mx-auto mt-2"></div>
                        <div className="w-8 h-1 bg-md-primary/50 mx-auto mt-2 rounded-full"></div>
                        <div className="w-6 h-1 bg-md-primary/50 mx-auto mt-1 rounded-full"></div>
                      </div>

                      <div className="absolute profile-card card-2 w-12 h-16 bg-md-surface-container-high rounded-lg shadow-lg animate-float-orbit-reverse">
                        <div className="w-6 h-6 rounded-full bg-md-tertiary mx-auto mt-2"></div>
                        <div className="w-8 h-1 bg-md-tertiary/50 mx-auto mt-2 rounded-full"></div>
                        <div className="w-6 h-1 bg-md-tertiary/50 mx-auto mt-1 rounded-full"></div>
                      </div>

                      {/* Company logos orbiting */}
                      <div className="absolute company-logo logo-1 w-10 h-10 rounded-full bg-md-surface shadow-lg flex items-center justify-center animate-float-orbit-slow">
                        <div className="w-6 h-6 text-md-primary">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M21 13.25c0-.47-.34-.85-.8-.85h-2.4c-.46 0-.8.38-.8.85v7.9c0 .47.34.85.8.85h2.4c.46 0 .8-.38.8-.85v-7.9zm-6.4 0c0-.47-.34-.85-.8-.85h-2.4c-.46 0-.8.38-.8.85v7.9c0 .47.34.85.8.85h2.4c.46 0 .8-.38.8-.85v-7.9zm-6.4 0c0-.47-.34-.85-.8-.85h-2.4c-.46 0-.8.38-.8.85v7.9c0 .47.34.85.8.85h2.4c.46 0 .8-.38.8-.85v-7.9zM21 4.75c0-.47-.34-.85-.8-.85h-2.4c-.46 0-.8.38-.8.85v7.9c0 .47.34.85.8.85h2.4c.46 0 .8-.38.8-.85v-7.9zm-6.4 0c0-.47-.34-.85-.8-.85h-2.4c-.46 0-.8.38-.8.85v7.9c0 .47.34.85.8.85h2.4c.46 0 .8-.38.8-.85v-7.9zm-6.4 0c0-.47-.34-.85-.8-.85h-2.4c-.46 0-.8.38-.8.85v7.9c0 .47.34.85.8.85h2.4c.46 0 .8-.38.8-.85v-7.9z" />
                          </svg>
                        </div>
                      </div>

                      <div className="absolute company-logo logo-2 w-10 h-10 rounded-full bg-md-surface shadow-lg flex items-center justify-center animate-float-orbit-slow-alt">
                        <div className="w-6 h-6 text-md-tertiary">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Data flow animations */}
                    <div className="data-flow-container absolute inset-0">
                      <div className="data-particle p-1 absolute bg-md-primary rounded-full animate-data-flow"></div>
                      <div className="data-particle p-2 absolute bg-md-tertiary rounded-full animate-data-flow-alt"></div>
                      <div className="data-particle p-3 absolute bg-md-secondary rounded-full animate-data-flow-slow"></div>
                    </div>
                  </div>
                </div>

                {/* Animated particles overlay */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="animate-particle particle-1"></div>
                  <div className="animate-particle particle-2"></div>
                  <div className="animate-particle particle-3"></div>
                  <div className="animate-particle particle-4"></div>
                  <div className="animate-particle particle-5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Enhanced Counter Animation */}
      <section id="stats-section" className="py-12 bg-md-surface">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-md-surface-container rounded-3xl shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="text-4xl font-bold text-md-primary mb-2 relative">
                {animatedStats.hiring}%
                <span className="absolute -top-2 -right-2 text-xs text-md-tertiary bg-md-tertiary/10 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  Amazing!
                </span>
              </div>
              <div className="text-xl text-md-on-surface">
                Faster Hiring Process
              </div>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-md-surface-container rounded-3xl shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="text-4xl font-bold text-md-primary mb-2 relative">
                {animatedStats.matching}%
                <span className="absolute -top-2 -right-2 text-xs text-md-tertiary bg-md-tertiary/10 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  Incredible!
                </span>
              </div>
              <div className="text-xl text-md-on-surface">
                Better Candidate Matching
              </div>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-md-surface-container rounded-3xl shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="text-4xl font-bold text-md-primary mb-2 relative">
                {animatedStats.costs}%
                <span className="absolute -top-2 -right-2 text-xs text-md-tertiary bg-md-tertiary/10 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  Cost-effective!
                </span>
              </div>
              <div className="text-xl text-md-on-surface">
                Reduction in Hiring Costs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Hover Effects */}
      <section id="features" className="py-16 md:py-24 bg-md-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-md-on-surface mb-4 relative inline-block">
              Features
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-md-primary rounded-full"></div>
            </h2>
            <p className="text-xl text-md-on-surface-variant max-w-3xl mx-auto mt-6">
              Our AI-powered platform transforms the hiring process with
              innovative features designed to save time, reduce bias, and
              identify the best talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-md-surface-container rounded-3xl transition-all duration-300 hover:shadow-lg hover:-translate-y-2 group relative overflow-hidden"
              >
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-md-primary/5 rounded-full -translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>

                <div className="rounded-2xl bg-md-primary-container p-4 inline-block mb-4 group-hover:bg-md-primary group-hover:rotate-6 transition-all duration-300 relative z-10">
                  {renderFeatureIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-semibold text-md-on-surface mb-2 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-md-on-surface-variant relative z-10">
                  {feature.description}
                </p>

                {/* Hidden "Learn more" link that appears on hover */}
                <div className="mt-4 h-0 overflow-hidden opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300">
                  <a
                    href="#"
                    className="text-md-primary inline-flex items-center"
                  >
                    Learn more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-16 md:py-24 bg-md-surface overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-md-on-surface mb-4 relative inline-block">
              How It Works
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-md-primary rounded-full"></div>
            </h2>
            <p className="text-xl text-md-on-surface-variant max-w-3xl mx-auto mt-6">
              Our platform simplifies the hiring process for both recruiters and
              job seekers.
            </p>
          </div>

          {/* Decorative connecting lines */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-md-outline-variant/20 hidden lg:block"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
            {/* For Recruiters */}
            <div className="p-8 bg-md-surface-container rounded-3xl shadow-sm relative z-10 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
              <h3 className="text-2xl font-semibold text-md-primary mb-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                For Recruiters
              </h3>
              <ul className="space-y-6">
                <li className="flex">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-primary-container text-md-on-primary-container font-bold mr-4 relative">
                    1
                    <div className="absolute inset-0 rounded-full bg-md-primary/20 animate-ping-slow opacity-0 group-hover:opacity-100"></div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Create Job Listings
                    </h4>
                    <p className="text-md-on-surface-variant">
                      Post detailed job descriptions with required skills and
                      experience.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-primary-container text-md-on-primary-container font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Define Assessment Criteria
                    </h4>
                    <p className="text-md-on-surface-variant">
                      Set up custom assessments or use our AI to generate
                      relevant tests.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-primary-container text-md-on-primary-container font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Review AI-Ranked Candidates
                    </h4>
                    <p className="text-md-on-surface-variant">
                      Get a prioritized list of candidates based on their
                      performance and fit.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-primary-container text-md-on-primary-container font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Interview and Hire
                    </h4>
                    <p className="text-md-on-surface-variant">
                      Schedule interviews with top candidates and make informed
                      hiring decisions.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/auth/signup?role=HRManager"
                  className="px-8 py-3 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors inline-block relative overflow-hidden group"
                >
                  <span className="relative z-10">Start Hiring</span>
                  <span className="absolute inset-0 bg-md-primary-container scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              </div>
            </div>

            {/* For Candidates */}
            <div className="p-8 bg-md-surface-container rounded-3xl shadow-sm relative z-10 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
              <h3 className="text-2xl font-semibold text-md-tertiary mb-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                For Job Seekers
              </h3>
              <ul className="space-y-6">
                <li className="flex">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-tertiary-container text-md-on-tertiary-container font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Create Your Profile
                    </h4>
                    <p className="text-md-on-surface-variant">
                      Build a comprehensive profile highlighting your skills and
                      experience.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-tertiary-container text-md-on-tertiary-container font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Take AI Skills Assessments
                    </h4>
                    <p className="text-md-on-surface-variant">
                      Demonstrate your abilities through relevant skill
                      assessments.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-tertiary-container text-md-on-tertiary-container font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Get Matched to Opportunities
                    </h4>
                    <p className="text-md-on-surface-variant">
                      Our AI matches you with jobs that align with your skills
                      and preferences.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-tertiary-container text-md-on-tertiary-container font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Interview and Get Hired
                    </h4>
                    <p className="text-md-on-surface-variant">
                      Connect with employers and showcase your real potential.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/auth/signup?role=candidate"
                  className="px-8 py-3 rounded-full bg-md-tertiary text-md-on-tertiary hover:bg-md-tertiary-container hover:text-md-on-tertiary-container transition-colors inline-block relative overflow-hidden group"
                >
                  <span className="relative z-10">Find Jobs</span>
                  <span className="absolute inset-0 bg-md-tertiary-container scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-md-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-md-on-surface mb-4">
              Pricing Plans
            </h2>
            <p className="text-xl text-md-on-surface-variant max-w-3xl mx-auto">
              Choose the plan that works best for you or your organization. All
              plans include our core AI-powered features.
            </p>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-md-on-surface mb-8 text-center">
              For Job Seekers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="p-8 bg-md-surface-container rounded-3xl border-2 border-md-outline-variant transition-transform hover:border-md-outline">
                <h4 className="text-2xl font-semibold text-md-on-surface mb-2">
                  Free
                </h4>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-md-on-surface">
                    ₹0
                  </span>
                  <span className="text-md-on-surface-variant ml-2">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {SUBSCRIPTION_PLANS.CANDIDATE.FREE.features.map(
                    (feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-md-primary mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>
                <Link
                  href="/auth/signup?role=candidate&plan=free"
                  className="w-full block text-center px-6 py-3 rounded-full border-2 border-md-outline text-md-on-surface hover:bg-md-surface-variant transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="p-8 bg-md-primary-container rounded-3xl border-2 border-md-primary relative">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <div className="bg-md-tertiary text-md-on-tertiary text-xs font-semibold px-4 py-1 rounded-full">
                    RECOMMENDED
                  </div>
                </div>
                <h4 className="text-2xl font-semibold text-md-on-primary-container mb-2">
                  Pro
                </h4>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-md-on-primary-container">
                    ₹{SUBSCRIPTION_PLANS.CANDIDATE.PRO.amount}
                  </span>
                  <span className="text-md-on-primary-container opacity-70 ml-2">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {SUBSCRIPTION_PLANS.CANDIDATE.PRO.features.map(
                    (feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-md-primary mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>
                <Link
                  href="/auth/signup?role=candidate&plan=pro"
                  className="w-full block text-center px-6 py-3 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                >
                  Get Pro
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-md-on-surface mb-8 text-center">
              For Employers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Free Plan */}
              <div className="p-6 bg-md-surface-container rounded-3xl border-2 border-md-outline-variant transition-transform hover:border-md-outline">
                <h4 className="text-xl font-semibold text-md-on-surface mb-2">
                  Free
                </h4>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-md-on-surface">
                    ₹0
                  </span>
                  <span className="text-md-on-surface-variant ml-2">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  {SUBSCRIPTION_PLANS.HR_MANAGER.FREE.features.map(
                    (feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-md-primary mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>
                <Link
                  href="/auth/signup?role=HRManager&plan=free"
                  className="w-full block text-center px-4 py-2 rounded-full border-2 border-md-outline text-md-on-surface hover:bg-md-surface-variant transition-colors text-sm"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Startup Plan */}
              <div className="p-6 bg-md-surface-container rounded-3xl border-2 border-md-outline-variant transition-transform hover:border-md-outline">
                <h4 className="text-xl font-semibold text-md-on-surface mb-2">
                  Startup
                </h4>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-md-on-surface">
                    ₹{SUBSCRIPTION_PLANS.HR_MANAGER.STARTUP.amount}
                  </span>
                  <span className="text-md-on-surface-variant ml-2">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  {SUBSCRIPTION_PLANS.HR_MANAGER.STARTUP.features.map(
                    (feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-md-primary mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>
                <Link
                  href="/auth/signup?role=HRManager&plan=startup"
                  className="w-full block text-center px-4 py-2 rounded-full border-2 border-md-outline text-md-on-surface hover:bg-md-surface-variant transition-colors text-sm"
                >
                  Choose Startup
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="p-6 bg-md-primary-container rounded-3xl border-2 border-md-primary relative">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <div className="bg-md-tertiary text-md-on-tertiary text-xs font-semibold px-4 py-1 rounded-full">
                    POPULAR
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-md-on-primary-container mb-2">
                  Enterprise
                </h4>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-md-on-primary-container">
                    ₹{SUBSCRIPTION_PLANS.HR_MANAGER.ENTERPRISE.amount}
                  </span>
                  <span className="text-md-on-primary-container opacity-70 ml-2">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  {SUBSCRIPTION_PLANS.HR_MANAGER.ENTERPRISE.features.map(
                    (feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-md-primary mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>
                <Link
                  href="/auth/signup?role=HRManager&plan=enterprise"
                  className="w-full block text-center px-4 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-sm"
                >
                  Choose Enterprise
                </Link>
              </div>

              {/* Custom Plan */}
              <div className="p-6 bg-md-surface-container rounded-3xl border-2 border-md-outline-variant transition-transform hover:border-md-outline">
                <h4 className="text-xl font-semibold text-md-on-surface mb-2">
                  Custom
                </h4>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-md-on-surface">
                    Custom
                  </span>
                  <span className="text-md-on-surface-variant ml-2">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  {SUBSCRIPTION_PLANS.HR_MANAGER.CUSTOM.features.map(
                    (feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-md-primary mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>
                <Link
                  href="/contact-sales"
                  className="w-full block text-center px-4 py-2 rounded-full border-2 border-md-outline text-md-on-surface hover:bg-md-surface-variant transition-colors text-sm"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-md-surface">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-md-on-surface mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-md-on-surface-variant max-w-3xl mx-auto">
              Hear from the people who have transformed their hiring process and
              career journey with Aptinova.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-md-surface-container rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-md-primary shadow-md">
                    <Image
                      src={`/images/testimonial-${index + 1}.jpg`}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-md-on-surface font-medium">
                      {testimonial.name}
                    </h4>
                    <p className="text-md-on-surface-variant text-sm">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
                <blockquote className="text-md-on-surface-variant italic relative">
                  <span className="text-3xl text-md-primary opacity-20 absolute -top-2 -left-1">
                    &#34;
                  </span>
                  {testimonial.quote}
                  <span className="text-3xl text-md-primary opacity-20 absolute -bottom-5 right-0">
                    &#34;
                  </span>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-md-primary-container">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-md-on-primary-container mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl text-md-on-primary-container opacity-80 max-w-3xl mx-auto mb-8">
            Join thousands of companies and candidates who are using Aptinova to
            connect talent with opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?role=HRManager"
              className="px-8 py-3 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-lg font-medium"
            >
              Sign Up as Employer
            </Link>
            <Link
              href="/auth/signup?role=candidate"
              className="px-8 py-3 rounded-full bg-md-tertiary text-md-on-tertiary hover:bg-md-tertiary-container hover:text-md-on-tertiary-container transition-colors text-lg font-medium"
            >
              Sign Up as Job Seeker
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-md-surface-container py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-md-primary flex items-center justify-center">
                  <span className="text-md-on-primary text-xl font-bold">
                    A
                  </span>
                </div>
                <span className="text-md-on-surface text-xl font-bold">
                  Aptinova
                </span>
              </div>
              <p className="text-md-on-surface-variant">
                AI-powered hiring platform that simplifies recruitment and finds
                the best candidates in less time.
              </p>
            </div>

            <div>
              <h4 className="text-md-on-surface font-semibold mb-4">
                Platform
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-md-on-surface font-semibold mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <Link
                    href="/help-centre"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    Help Center
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="#"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    API Documentation
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/privacy"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-md-on-surface font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <a
                  className="text-md-on-surface-variant"
                  href="mailto:aptinovacare@gmail.com"
                >
                  aptinovacare@gmail.com
                </a>
                <a
                  className="text-md-on-surface-variant"
                  href="tel:+91-8100211809"
                >
                  +91 8100211809
                </a>
                <li className="text-md-on-surface-variant">
                  Kolkata - 700081, NSCBI, IND
                </li>
              </ul>
              <div className="flex space-x-4 mt-4">
                {/* <a
                  href="https://www.linkedin.com/company/aptinova"
                  className="text-md-on-surface-variant hover:text-md-primary transition-colors duration-300 transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </a> */}
                <a
                  href="https://www.linkedin.com/in/ayon380/"
                  className="text-md-on-surface-variant hover:text-md-primary transition-colors duration-300 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                  </svg>
                </a>
                <a
                  href="https://github.com/ayon380/aptinova-frontend"
                  target="_blank"
                  className="text-md-on-surface-variant hover:text-md-primary transition-colors duration-300 transform hover:scale-110"
                  aria-label="GitHub"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/ayon380/"
                   target="_blank"
                  className="text-md-on-surface-variant hover:text-md-primary transition-colors duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-md-outline-variant pt-8 text-center">
            <p className="text-md-on-surface-variant">
              &copy; {new Date().getFullYear()} Aptinova. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Add CSS for advanced animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes float-delay {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes float-slow {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes float-slow-alt {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) translateX(-10px) rotate(10deg);
          }
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes text-glow {
          0% {
            text-shadow: 0 0 0 rgba(103, 80, 164, 0);
          }
          50% {
            text-shadow: 0 0 10px rgba(103, 80, 164, 0.5);
          }
          100% {
            text-shadow: 0 0 0 rgba(103, 80, 164, 0);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes ping-slow-delay {
          0%,
          25% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes draw-line {
          0% {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
        }

        @keyframes dash {
          to {
            stroke-dashoffset: 20;
          }
        }

        @keyframes dash-reverse {
          to {
            stroke-dashoffset: -20;
          }
        }

        @keyframes dash-delay {
          0%,
          30% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 20;
          }
        }

        @keyframes dash-reverse-delay {
          0%,
          30% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -20;
          }
        }

        @keyframes float-left-right {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-30px);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes float-right-left {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(30px);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes float-top-bottom {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(30px);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes float-bottom-top {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes fade-in-out {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }

        @keyframes pulse-slow {
          0% {
            transform: scale(0.95);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(0.95);
          }
        }

        @keyframes particle-movement {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y));
            opacity: 0;
          }
        }

        /* Earth animations */
        @keyframes float-orbit {
          0% {
            transform: translate(70px, 20px) scale(0.8);
          }
          25% {
            transform: translate(40px, 60px) scale(1);
          }
          50% {
            transform: translate(-40px, 40px) scale(0.9);
          }
          75% {
            transform: translate(-70px, -20px) scale(1);
          }
          100% {
            transform: translate(70px, 20px) scale(0.8);
          }
        }

        @keyframes float-orbit-reverse {
          0% {
            transform: translate(-70px, -20px) scale(0.8);
          }
          25% {
            transform: translate(40px, -60px) scale(1);
          }
          50% {
            transform: translate(70px, 20px) scale(0.9);
          }
          75% {
            transform: translate(-40px, 40px) scale(1);
          }
          100% {
            transform: translate(-70px, -20px) scale(0.8);
          }
        }

        @keyframes float-orbit-slow {
          0% {
            transform: translate(80px, 30px) scale(0.8);
          }
          33% {
            transform: translate(-20px, 70px) scale(1);
          }
          66% {
            transform: translate(-80px, -30px) scale(0.9);
          }
          100% {
            transform: translate(80px, 30px) scale(0.8);
          }
        }

        @keyframes float-orbit-slow-alt {
          0% {
            transform: translate(-60px, 60px) scale(0.8);
          }
          33% {
            transform: translate(70px, 20px) scale(1);
          }
          66% {
            transform: translate(10px, -80px) scale(0.9);
          }
          100% {
            transform: translate(-60px, 60px) scale(0.8);
          }
        }

        @keyframes data-flow {
          0% {
            transform: translate(-100px, -50px) scale(0);
            opacity: 0;
          }
          20% {
            transform: translate(-50px, -25px) scale(1);
            opacity: 1;
          }
          80% {
            transform: translate(50px, 25px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(100px, 50px) scale(0);
            opacity: 0;
          }
        }

        @keyframes data-flow-alt {
          0% {
            transform: translate(100px, -70px) scale(0);
            opacity: 0;
          }
          20% {
            transform: translate(50px, -35px) scale(1);
            opacity: 1;
          }
          80% {
            transform: translate(-50px, 35px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-100px, 70px) scale(0);
            opacity: 0;
          }
        }

        @keyframes data-flow-slow {
          0% {
            transform: translate(-80px, 80px) scale(0);
            opacity: 0;
          }
          20% {
            transform: translate(-40px, 40px) scale(1);
            opacity: 1;
          }
          80% {
            transform: translate(40px, -40px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(80px, -80px) scale(0);
            opacity: 0;
          }
        }

        /* Earth styling */
        .earth-sphere {
          perspective: 1000px;
        }

        .earth {
          background: linear-gradient(
            30deg,
            var(--md-tertiary-container) 0%,
            var(--md-primary-container) 50%,
            var(--md-secondary-container) 100%
          );
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.2);
        }

        .earth-texture {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.15)' fill-rule='evenodd'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }

        .glow-effect {
          box-shadow: 0 0 60px 10px rgba(103, 80, 164, 0.3);
          opacity: 0.7;
          animation: pulse-slow 6s ease-in-out infinite;
        }

        /* Node positioning */
        .node-1 {
          top: 30%;
          left: 20%;
          transform: translate(-50%, -50%);
        }

        .node-2 {
          top: 70%;
          left: 30%;
          transform: translate(-50%, -50%);
        }

        .node-3 {
          top: 40%;
          right: 20%;
          transform: translate(50%, -50%);
        }

        .node-4 {
          top: 60%;
          right: 30%;
          transform: translate(50%, -50%);
        }

        .node-5 {
          top: 20%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Profile card positioning */
        .card-1 {
          top: -10%;
          left: 60%;
          transform-origin: center;
          animation-duration: 20s;
        }

        .card-2 {
          bottom: 10%;
          right: 60%;
          transform-origin: center;
          animation-duration: 18s;
        }

        /* Company logo positioning */
        .logo-1 {
          top: 70%;
          left: 20%;
          animation-duration: 25s;
        }

        .logo-2 {
          top: 30%;
          right: 10%;
          animation-duration: 22s;
        }

        /* Connection arcs */
        .connection-arc {
          border: 1px dashed var(--md-primary);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }

        .arc-1 {
          top: 30%;
          left: 40%;
          transform: rotate(30deg);
          width: 100px;
          height: 100px;
          border-color: var(--md-primary);
          animation: spin-slow 20s linear infinite;
        }

        .arc-2 {
          bottom: 40%;
          right: 30%;
          transform: rotate(-20deg);
          width: 80px;
          height: 80px;
          border-color: var(--md-tertiary);
          animation: spin-reverse-slow 25s linear infinite;
        }

        .arc-3 {
          top: 50%;
          left: 50%;
          transform: rotate(60deg) translate(-50%, -50%);
          width: 120px;
          height: 120px;
          border-color: var(--md-secondary);
          animation: spin-slow 30s linear infinite;
        }

        /* Data particles */
        .data-particle {
          opacity: 0;
        }

        .p-1 {
          animation: data-flow 4s ease-in-out infinite;
          animation-delay: 0s;
          width: 4px;
          height: 4px;
        }

        .p-2 {
          animation: data-flow-alt 5s ease-in-out infinite;
          animation-delay: 1s;
          width: 3px;
          height: 3px;
        }

        .p-3 {
          animation: data-flow-slow 6s ease-in-out infinite;
          animation-delay: 2s;
          width: 5px;
          height: 5px;
        }

        /* Particles */
        .animate-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--md-primary);
          opacity: 0;
          animation: particle-movement 5s linear infinite;
        }

        .particle-1 {
          top: 20%;
          left: 30%;
          --end-x: 50px;
          --end-y: -30px;
          animation-duration: 7s;
          background-color: var(--md-primary);
        }

        .particle-2 {
          top: 70%;
          left: 40%;
          --end-x: -40px;
          --end-y: -60px;
          animation-duration: 9s;
          animation-delay: 1s;
          background-color: var(--md-tertiary);
        }

        .particle-3 {
          top: 40%;
          left: 60%;
          --end-x: 60px;
          --end-y: 40px;
          animation-duration: 8s;
          animation-delay: 2s;
          background-color: var(--md-secondary);
        }

        .particle-4 {
          top: 80%;
          left: 80%;
          --end-x: -30px;
          --end-y: -50px;
          animation-duration: 10s;
          animation-delay: 3s;
          background-color: var(--md-error);
        }

        .particle-5 {
          top: 30%;
          left: 10%;
          --end-x: 40px;
          --end-y: 60px;
          animation-duration: 11s;
          animation-delay: 4s;
          background-color: var(--md-primary);
        }

        /* Animation classes */
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 7s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-slow-alt {
          animation: float-slow-alt 9s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }

        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 20s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-draw-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-line 1.5s ease-in-out forwards 0.5s;
        }

        .animate-float-orbit {
          animation: float-orbit 20s ease-in-out infinite;
        }

        .animate-float-orbit-reverse {
          animation: float-orbit-reverse 20s ease-in-out infinite;
        }

        .animate-float-orbit-slow {
          animation: float-orbit-slow 25s ease-in-out infinite;
        }

        .animate-float-orbit-slow-alt {
          animation: float-orbit-slow-alt 25s ease-in-out infinite;
        }

        /* Responsive design improvements */
        @media (max-width: 640px) {
          .container {
            padding-left: 16px;
            padding-right: 16px;
          }

          .earth-sphere {
            width: 200px;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}
