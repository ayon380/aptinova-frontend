"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, SidebarClose } from "lucide-react";

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("team");

  useEffect(() => {
    setIsLoaded(true);

    // Add scroll animation trigger
    const handleScroll = () => {
      const scrollElements = document.querySelectorAll(".animate-on-scroll");

      scrollElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("animate-visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once on load
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    // Toggle body scroll lock class
    if (newState) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  };

  // Close mobile menu when clicking a link or the close button
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  // Team members data
  const teamMembers = [
    {
      name: "Ayon Sarkar",
      role: "Lead Developer",
      responsibilities: "System Design, Frontend, Database, Backend",
      imageSrc: "/images/team/ayon.jpg", // Placeholder - update with actual path
      github: "https://github.com/ayon380",
      linkedin: "https://www.linkedin.com/in/ayon380/",
      email: "mailto:ayonsarkar6@gmail.com",
    },
    {
      name: "Tanishk Yadav",
      role: "AI Head",
      responsibilities: "Implementation, Research",
      imageSrc: "/images/team/tanishk.jpg", // Placeholder - update with actual path
      github: "https://github.com/tanishkyadav",
      linkedin: "https://www.linkedin.com/in/tanishkyadav/",
      email: "mailto:tanishk@example.com",
    },
    {
      name: "Sanjana Maini",
      role: "Project Manager",
      responsibilities: "Documentation, Management, Backend",
      imageSrc: "/images/team/sanjana.jpg", // Placeholder - update with actual path
      github: "https://github.com/sanjanamaini",
      linkedin: "https://www.linkedin.com/in/sanjanamaini/",
      email: "mailto:sanjana@example.com",
    },
  ];

  // Technologies data categorized by type
  const technologies = {
    frontend: [
      {
        name: "Next.js (v15+)",
        description: "Frontend framework for React with SSR, routing",
      },
      {
        name: "React (v19+)",
        description: "UI Library for component-based development",
      },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      { name: "Zustand", description: "State management library" },
      { name: "Framer Motion", description: "Animation library for React" },
      { name: "Recharts", description: "Data visualization library" },
      { name: "Monaco Editor", description: "Code editor for assessments" },
      { name: "@hello-pangea/dnd", description: "Drag and drop functionality" },
      { name: "face-api.js", description: "Face detection for proctoring" },
      {
        name: "@tensorflow/tfjs",
        description: "Machine learning for browser-based applications",
      },
    ],
    backend: [
      { name: "Node.js (v18)", description: "JavaScript runtime environment" },
      { name: "Express.js", description: "Web application framework" },
      {
        name: "PostgreSQL",
        description: "Relational database management system",
      },
      { name: "Sequelize", description: "ORM for database operations" },
      { name: "Passport.js", description: "Authentication middleware" },
      {
        name: "JSON Web Token",
        description: "Secure token-based authentication",
      },
      { name: "bcrypt", description: "Password hashing" },
      { name: "Nodemailer", description: "Email functionality" },
      { name: "Google Gemini API", description: "AI-powered functionality" },
      { name: "Google Calendar API", description: "Calendar integration" },
    ],
    services: [
      { name: "Cloudinary", description: "Cloud-based media management" },
      { name: "Razorpay SDK", description: "Payment processing" },
      { name: "Vercel", description: "Deployment platform" },
      { name: "Google OAuth", description: "Authentication service" },
      { name: "Microsoft OAuth", description: "Authentication service" },
      { name: "LinkedIn OAuth", description: "Authentication service" },
    ],
    development: [
      { name: "Git", description: "Version control" },
      { name: "npm", description: "Package manager" },
      { name: "VS Code", description: "Code editor" },
      { name: "ESLint", description: "Code linting" },
      { name: "Prettier", description: "Code formatting" },
      { name: "Nodemon", description: "Development process manager" },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-md-background overflow-x-hidden">
      {/* Navbar with working mobile responsiveness */}
      <nav className="bg-md-surface/90 backdrop-blur-md px-4 sm:px-6 py-4 fixed top-0 left-0 right-0 w-full z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="h-10 w-10 rounded-xl bg-md-primary flex items-center justify-center relative overflow-hidden group"
            >
              <span className="text-md-on-primary text-xl font-bold relative z-10">
                A
              </span>
              <div className="absolute inset-0 bg-gradient-to-tr from-md-primary via-md-primary to-md-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
            <Link href="/" className="text-md-on-surface text-xl font-bold">
              Aptinova
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/#features"
              className="text-md-on-surface hover:text-md-primary transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-md-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#how-it-works"
              className="text-md-on-surface hover:text-md-primary transition-colors relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-md-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#pricing"
              className="text-md-on-surface hover:text-md-primary transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-md-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#testimonials"
              className="text-md-on-surface hover:text-md-primary transition-colors relative group"
            >
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-md-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="text-md-primary font-medium transition-colors relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-md-primary"></span>
            </Link>
            <Link
              href="/downloads"
              className="text-md-on-surface hover:text-md-primary transition-colors relative group"
            >
              Downloads
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-md-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
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

          {/* Mobile menu button - properly positioned */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-md-surface-variant transition-colors"
            aria-label="Open menu"
          >
            <Menu className="text-md-on-surface" />
          </button>
        </div>
      </nav>

      {/* Add spacing to account for fixed navbar */}
      <div className="pt-16"></div>

      {/* Mobile Menu Overlay with improved animations */}
      <div
        className={`fixed inset-0 bg-md-scrim/60 z-50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      >
        <div
          className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-md-surface-bright shadow-2xl transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 flex justify-between items-center border-b border-md-outline-variant">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-md-primary flex items-center justify-center">
                <span className="text-md-on-primary text-lg font-bold">A</span>
              </div>
              <span className="text-md-on-surface font-medium">Aptinova</span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-md-surface-variant transition-colors"
              aria-label="Close menu"
            >
              <SidebarClose className="text-md-on-surface" />
            </button>
          </div>

          <div className="p-4 flex flex-col space-y-2">
            <Link
              href="/#features"
              onClick={closeMobileMenu}
              className="text-md-on-surface w-full text-left px-4 py-3 rounded-lg hover:bg-md-surface-variant active:bg-md-surface-variant/80 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={closeMobileMenu}
              className="text-md-on-surface w-full text-left px-4 py-3 rounded-lg hover:bg-md-surface-variant active:bg-md-surface-variant/80 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              onClick={closeMobileMenu}
              className="text-md-on-surface w-full text-left px-4 py-3 rounded-lg hover:bg-md-surface-variant active:bg-md-surface-variant/80 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#testimonials"
              onClick={closeMobileMenu}
              className="text-md-on-surface w-full text-left px-4 py-3 rounded-lg hover:bg-md-surface-variant active:bg-md-surface-variant/80 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="text-md-primary w-full text-left px-4 py-3 rounded-lg bg-md-primary-container/20 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/downloads"
              onClick={closeMobileMenu}
              className="text-md-on-surface w-full text-left px-4 py-3 rounded-lg hover:bg-md-surface-variant active:bg-md-surface-variant/80 transition-colors"
            >
              Downloads
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-md-outline-variant">
            <div className="flex flex-col space-y-3">
              <Link
                href="/auth/login"
                onClick={closeMobileMenu}
                className="w-full px-4 py-3 rounded-3xl border border-md-outline text-md-primary text-center font-medium hover:bg-md-primary-container/10 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                onClick={closeMobileMenu}
                className="w-full px-4 py-3 rounded-3xl bg-md-primary text-md-on-primary text-center font-medium hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-md-primary-container to-md-tertiary-container py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-md-primary opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 -left-20 w-40 h-40 rounded-full bg-md-primary opacity-20 animate-float"></div>
          <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-md-tertiary opacity-20 animate-float-delay"></div>

          {/* Additional floating elements */}
          <div className="absolute top-1/4 right-1/3 w-16 h-16 rounded-full bg-md-secondary opacity-10 animate-float-slow"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-md-tertiary opacity-10 animate-spin-slow"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1
              className={`text-4xl md:text-6xl font-bold text-md-on-surface mb-6 transition-transform duration-1000 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              About <span className="text-md-primary">Aptinova</span>
            </h1>
            <p
              className={`text-xl text-md-on-surface-variant mb-8 transition-opacity delay-300 duration-1000 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              Our journey to revolutionize the hiring process with AI-powered
              solutions.
            </p>

            <div
              className={`flex flex-wrap justify-center gap-4 transition-all delay-500 duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button
                onClick={() => setActiveSection("team")}
                className={`px-6 py-3 rounded-full transition-colors ${
                  activeSection === "team"
                    ? "bg-md-primary text-md-on-primary"
                    : "bg-md-surface/30 text-md-on-surface hover:bg-md-surface/50"
                }`}
              >
                Our Team
              </button>
              <button
                onClick={() => setActiveSection("project")}
                className={`px-6 py-3 rounded-full transition-colors ${
                  activeSection === "project"
                    ? "bg-md-primary text-md-on-primary"
                    : "bg-md-surface/30 text-md-on-surface hover:bg-md-surface/50"
                }`}
              >
                The Project
              </button>
              <button
                onClick={() => setActiveSection("technology")}
                className={`px-6 py-3 rounded-full transition-colors ${
                  activeSection === "technology"
                    ? "bg-md-primary text-md-on-primary"
                    : "bg-md-surface/30 text-md-on-surface hover:bg-md-surface/50"
                }`}
              >
                Technology
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        className={`py-20 bg-md-background relative ${
          activeSection === "team" ? "block" : "hidden"
        }`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-md-on-surface mb-12 text-center relative inline-block">
            Meet Our Team
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-md-primary rounded-full"></div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="animate-on-scroll opacity-0 translate-y-10"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-md-surface rounded-3xl overflow-hidden shadow-lg transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
                  {/* Profile Image Container */}
                  <div className="h-64 bg-gradient-to-br from-md-primary to-md-tertiary relative overflow-hidden">
                    {/* Display a placeholder or actual image if available */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Fallback for images - stylish placeholder with first letter */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl font-bold text-white/30">
                        {member.name.charAt(0)}
                      </span>
                    </div>

                    {/* If you have actual images, uncomment this */}
                    {/* <Image 
                      src={member.imageSrc}
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                    /> */}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-md-on-surface mb-1">
                      {member.name}
                    </h3>
                    <p className="text-md-primary font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-md-on-surface-variant mb-4">
                      {member.responsibilities}
                    </p>

                    {/* Social Links */}
                    <div className="flex space-x-4 mt-4">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-md-surface-variant flex items-center justify-center text-md-on-surface-variant hover:bg-md-primary hover:text-md-on-primary transition-colors"
                        aria-label={`${member.name}'s GitHub`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-md-surface-variant flex items-center justify-center text-md-on-surface-variant hover:bg-[#0077b5] hover:text-white transition-colors"
                        aria-label={`${member.name}'s LinkedIn`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                      <a
                        href={member.email}
                        className="w-10 h-10 rounded-full bg-md-surface-variant flex items-center justify-center text-md-on-surface-variant hover:bg-md-tertiary hover:text-md-on-tertiary transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Section */}
      <section
        className={`py-20 bg-md-surface relative ${
          activeSection === "project" ? "block" : "hidden"
        }`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-md-on-surface mb-12 text-center relative inline-block">
            The Project
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-md-tertiary rounded-full"></div>
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-md-surface-container rounded-3xl p-8 shadow-lg animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-block bg-md-tertiary/10 text-md-tertiary px-4 py-1 rounded-full text-sm font-medium mb-4">
                Capstone Project
              </div>

              <h3 className="text-2xl font-bold text-md-on-surface mb-6">
                AI-Powered Recruitment Platform
              </h3>

              <p className="text-md-on-surface-variant mb-6 leading-relaxed">
                Aptinova is a comprehensive AI-powered recruitment platform
                designed to streamline and revolutionize the hiring process.
                This platform was developed as a capstone project for our B.Tech
                CSE degree (2021-2025 batch) at SRM University AP under the
                guidance of Prof. Ajay Bhardwaj.
              </p>

              <div className="mb-8 bg-md-primary-container/30 rounded-2xl p-6">
                <h4 className="text-xl font-semibold text-md-on-surface mb-4">
                  Project Highlights
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
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
                    <span>
                      Advanced AI algorithms for candidate-job matching
                    </span>
                  </li>
                  <li className="flex items-start">
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
                    <span>Bias-free evaluation and scoring system</span>
                  </li>
                  <li className="flex items-start">
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
                    <span>End-to-end recruitment workflow automation</span>
                  </li>
                  <li className="flex items-start">
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
                    <span>Interactive dashboards with real-time analytics</span>
                  </li>
                  <li className="flex items-start">
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
                    <span>
                      Responsive design with cross-platform compatibility
                    </span>
                  </li>
                </ul>
              </div>

              {/* University and Project Guide */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-md-surface-container-high p-6 rounded-2xl flex items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center mr-4 overflow-hidden">
                    {/* University logo placeholder */}
                    <div className="text-gray-500 text-4xl font-bold">SRM</div>
                    {/* If you have a logo: <Image src="/images/srm-logo.png" alt="SRM University" width={96} height={96} /> */}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-md-on-surface">
                      SRM University AP
                    </h4>
                    <p className="text-md-on-surface-variant">
                      Department of Computer Science and Engineering
                    </p>
                    <p className="text-md-on-surface-variant">
                      B.Tech CSE 2021-2025 Batch
                    </p>
                  </div>
                </div>

                <div className="bg-md-surface-container-high p-6 rounded-2xl flex items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                    {/* Professor placeholder */}
                    <div className="text-gray-500 text-2xl font-bold">AB</div>
                    {/* If you have a photo: <Image src="/images/prof-ajay.jpg" alt="Prof. Ajay Bhardwaj" width={96} height={96} className="rounded-full" /> */}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-md-on-surface">
                      Prof. Ajay Bhardwaj
                    </h4>
                    <p className="text-md-on-surface-variant">Project Guide</p>
                    <p className="text-md-primary hover:underline">
                      ajay.bhardwaj@srmap.edu.in
                    </p>
                  </div>
                </div>
              </div>

              <blockquote className="italic text-md-on-surface-variant border-l-4 border-md-primary pl-4 py-2 mb-6">
                "Our vision for Aptinova was to create a platform that not only
                simplifies the recruitment process but also ensures fairness and
                efficiency through advanced AI algorithms."
              </blockquote>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <a
                  href="https://github.com/ayon380/aptinova-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors inline-flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View Project on GitHub
                </a>
                
                <a
                  href="/srs/aptinova.pdf"
                  download
                  className="px-8 py-3 rounded-full bg-md-tertiary text-md-on-tertiary hover:bg-md-tertiary-container hover:text-md-on-tertiary-container transition-colors inline-flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  Download Project Report
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section - Replacing Timeline Section */}
      <section
        className={`py-20 bg-md-background relative ${
          activeSection === "technology" ? "block" : "hidden"
        }`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-md-on-surface mb-12 text-center relative inline-block">
            Technology Stack
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-md-secondary rounded-full"></div>
          </h2>

          <div className="max-w-6xl mx-auto mb-16">
            <div className="bg-md-surface rounded-3xl p-8 shadow-lg mb-10 animate-on-scroll opacity-0 translate-y-10">
              <p className="text-center text-md-on-surface-variant mb-8 max-w-3xl mx-auto">
                Aptinova employs a modern technology stack, carefully selected
                to deliver a robust, scalable, and user-friendly recruitment
                platform. Our architecture uses the latest frameworks and tools
                to ensure optimal performance and maintainability.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-md-primary-container/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-bold text-md-primary mb-1">
                    40+
                  </div>
                  <div className="text-sm text-md-on-surface-variant">
                    Technologies
                  </div>
                </div>
                <div className="bg-md-secondary-container/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-bold text-md-secondary mb-1">
                    4
                  </div>
                  <div className="text-sm text-md-on-surface-variant">
                    Major Categories
                  </div>
                </div>
                <div className="bg-md-tertiary-container/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-bold text-md-tertiary mb-1">
                    6+
                  </div>
                  <div className="text-sm text-md-on-surface-variant">
                    External Services
                  </div>
                </div>
                <div className="bg-md-error-container/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-bold text-md-error mb-1">3</div>
                  <div className="text-sm text-md-on-surface-variant">
                    Authentication Methods
                  </div>
                </div>
              </div>
            </div>

            {/* Frontend Technologies */}
            <div
              className="animate-on-scroll opacity-0 translate-y-10"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="bg-gradient-to-r from-md-primary-container/50 to-md-primary-container/10 p-1 rounded-2xl mb-8">
                <div className="bg-md-surface rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-md-primary mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    Frontend
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technologies.frontend.map((tech, index) => (
                      <div
                        key={index}
                        className="bg-md-surface-container p-4 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-md-on-surface mb-1">
                          {tech.name}
                        </h4>
                        <p className="text-sm text-md-on-surface-variant">
                          {tech.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Backend Technologies */}
            <div
              className="animate-on-scroll opacity-0 translate-y-10"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="bg-gradient-to-r from-md-secondary-container/50 to-md-secondary-container/10 p-1 rounded-2xl mb-8">
                <div className="bg-md-surface rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-md-secondary mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 8H3V5h9v6zm9 8H3v-6h18v6zm0-8h-8V5h8v6z" />
                    </svg>
                    Backend
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technologies.backend.map((tech, index) => (
                      <div
                        key={index}
                        className="bg-md-surface-container p-4 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-md-on-surface mb-1">
                          {tech.name}
                        </h4>
                        <p className="text-sm text-md-on-surface-variant">
                          {tech.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* External Services */}
            <div
              className="animate-on-scroll opacity-0 translate-y-10"
              style={{ transitionDelay: "300ms" }}
            >
              <div className="bg-gradient-to-r from-md-tertiary-container/50 to-md-tertiary-container/10 p-1 rounded-2xl mb-8">
                <div className="bg-md-surface rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-md-tertiary mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z" />
                    </svg>
                    External Services
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technologies.services.map((tech, index) => (
                      <div
                        key={index}
                        className="bg-md-surface-container p-4 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-md-on-surface mb-1">
                          {tech.name}
                        </h4>
                        <p className="text-sm text-md-on-surface-variant">
                          {tech.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Development Tools */}
            <div
              className="animate-on-scroll opacity-0 translate-y-10"
              style={{ transitionDelay: "400ms" }}
            >
              <div className="bg-gradient-to-r from-md-surface-container-highest/70 to-md-surface-container-highest/30 p-1 rounded-2xl">
                <div className="bg-md-surface rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-md-on-surface mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.5 17.1c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79z" />
                    </svg>
                    Development Tools
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technologies.development.map((tech, index) => (
                      <div
                        key={index}
                        className="bg-md-surface-container p-4 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-md-on-surface mb-1">
                          {tech.name}
                        </h4>
                        <p className="text-sm text-md-on-surface-variant">
                          {tech.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Technology summary table */}
            <div
              className="mt-12 animate-on-scroll opacity-0 translate-y-10"
              style={{ transitionDelay: "500ms" }}
            >
              <div className="bg-md-surface rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-md-on-surface mb-4">
                  Technology Stack Summary
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-md-outline-variant">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-md-on-surface-variant">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-md-on-surface-variant">
                          Technology/Service
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-md-on-surface-variant">
                          Purpose
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-md-outline-variant/50">
                      <tr>
                        <td
                          className="px-4 py-3 text-sm text-md-on-surface font-medium"
                          rowSpan={5}
                        >
                          Frontend
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          React (Next.js)
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          UI Framework, SSR, Routing
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          Tailwind CSS
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Utility-First CSS Styling
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          Material You (via CSS vars)
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Dynamic Theming
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          Zustand
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Client-side State Management
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          face-api.js / TensorFlow.js
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Client-side Face Detection (Proctoring)
                        </td>
                      </tr>

                      <tr>
                        <td
                          className="px-4 py-3 text-sm text-md-on-surface font-medium"
                          rowSpan={4}
                        >
                          Backend
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          Node.js
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Server-side JavaScript Runtime
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          Express.js
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Web Application Framework
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          Sequelize
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          ORM for Database Interaction
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          JWT
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Session Management
                        </td>
                      </tr>

                      <tr>
                        <td
                          className="px-4 py-3 text-sm text-md-on-surface font-medium"
                          rowSpan={1}
                        >
                          Database
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          PostgreSQL
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Relational Database Management System
                        </td>
                      </tr>

                      <tr>
                        <td
                          className="px-4 py-3 text-sm text-md-on-surface font-medium"
                          rowSpan={3}
                        >
                          External Services
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          Google Gemini AI
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Resume Parsing, Job Analysis, Grading
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          Cloudinary
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Cloud-based File Storage
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-md-on-surface">
                          Razorpay
                        </td>
                        <td className="px-4 py-3 text-sm text-md-on-surface-variant">
                          Payment Gateway
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
                  <Link
                    href="/#features"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#how-it-works"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#testimonials"
                    className="text-md-on-surface-variant hover:text-md-primary"
                  >
                    Testimonials
                  </Link>
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

      {/* Add CSS for animations */}
      <style jsx global>{`
        /* Animation classes */
        .animate-on-scroll {
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 7s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default About;
