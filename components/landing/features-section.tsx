"use client";

import { useEffect, useRef } from "react";

export default function FeaturesSection() {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  const features = [
    {
      title: "AI-Powered Candidate Matching",
      description:
        "Our intelligent algorithm identifies the most qualified candidates based on skills, experience, and cultural fit.",
      icon: "🧠",
    },
    {
      title: "Automated Screening & Assessment",
      description:
        "Save time with customizable pre-screening questions and assessments that evaluate candidate qualifications.",
      icon: "✓",
    },
    {
      title: "Interview Scheduling",
      description:
        "Seamlessly coordinate interviews with integrated calendar features and automated reminders.",
      icon: "📅",
    },
    {
      title: "Collaborative Hiring",
      description:
        "Enable your entire team to collaborate effectively with shared notes, ratings, and feedback tools.",
      icon: "👥",
    },
    {
      title: "Advanced Analytics & Reporting",
      description:
        "Track key metrics and generate insights to continuously improve your hiring process.",
      icon: "📊",
    },
    {
      title: "Seamless ATS Integration",
      description:
        "Connect with your existing ATS and HRIS systems for a unified workflow.",
      icon: "🔄",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-md-surface-container relative"
      ref={featuresRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
          <div className="inline-block mb-3 px-4 py-1 bg-md-secondary-container border border-md-outline/20 rounded-full text-md-on-secondary-container text-sm font-medium">
            Premium Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-md-on-surface mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-md-primary to-md-tertiary">
              Transform Your Hiring Process
            </span>
          </h2>
          <p className="text-xl text-md-on-surface-variant">
            HireFlow combines cutting-edge AI with powerful automation to streamline your recruitment workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-0 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-md-surface-container-high p-8 rounded-3xl shadow-md border border-md-outline/20 hover:border-md-outline/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full flex flex-col"
            >
              <div className="w-14 h-14 bg-md-primary-container rounded-2xl flex items-center justify-center text-md-on-primary-container text-2xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-md-on-surface mb-3">
                {feature.title}
              </h3>
              <p className="text-md-on-surface-variant flex-grow">
                {feature.description}
              </p>
              <div className="mt-6 pt-6 border-t border-md-outline/10">
                <button className="text-md-primary hover:text-md-tertiary font-medium inline-flex items-center transition-colors">
                  Learn more
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 opacity-0 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <div className="bg-md-secondary-container rounded-3xl overflow-hidden shadow-md">
            <div className="p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-md-on-secondary-container mb-6">
                Ready to experience the HireFlow difference?
              </h3>
              <button className="px-8 py-3 bg-md-primary hover:bg-md-primary-container text-md-on-primary hover:text-md-on-primary-container font-medium rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
