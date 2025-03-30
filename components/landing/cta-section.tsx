"use client";

import { useEffect, useRef } from "react";

export default function CtaSection() {
  const ctaRef = useRef<HTMLDivElement>(null);

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

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  return (
    <section className="py-24 relative" ref={ctaRef}>
      {/* Material You inspired background */}
      <div className="absolute inset-0 bg-md-surface-container -z-10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6750A4_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative max-w-5xl mx-auto opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          {/* Animated border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-md-primary to-md-tertiary rounded-3xl blur opacity-30 animate-pulse"></div>

          <div className="relative bg-md-surface-container-high rounded-3xl overflow-hidden border border-md-outline/30 shadow-md">
            <div className="absolute inset-0 bg-[radial-gradient(#6750A4_0.5px,transparent_0.5px)] [background-size:10px_10px] opacity-5"></div>

            <div className="px-8 py-16 md:p-16 text-center">
              <div className="inline-block mb-3 px-4 py-1 bg-md-tertiary-container border border-md-outline/20 rounded-full text-md-on-tertiary-container text-sm font-medium">
                PREMIUM ACCESS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-md-on-surface mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-md-primary to-md-tertiary">
                  Ready to Transform Your Hiring Process?
                </span>
              </h2>
              <p className="text-xl text-md-on-surface-variant mb-10 max-w-3xl mx-auto">
                Join elite companies that are saving time and finding better
                candidates with HireFlow&#39;s AI-powered platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="px-8 py-4 bg-md-primary hover:bg-md-primary-container text-md-on-primary hover:text-md-on-primary-container font-bold rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
                  Start Free Trial
                </button>

                <button className="px-8 py-4 bg-transparent text-md-primary border border-md-outline/50 hover:border-md-primary font-medium rounded-full shadow-sm transition-all duration-300 hover:bg-md-secondary-container hover:text-md-on-secondary-container">
                  Schedule Premium Demo
                </button>
              </div>

              <div className="mt-10 text-md-primary text-sm">
                No credit card required. 14-day free trial with premium
                features.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
