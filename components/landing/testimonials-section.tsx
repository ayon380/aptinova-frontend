"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote:
        "HireFlow has transformed our recruitment process. We've reduced our time-to-hire by 65% while finding better quality candidates.",
      author: "Sarah Johnson",
      position: "HR Director",
      company: "TechGrowth Inc.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "The AI-powered screening is a game-changer. It accurately identifies the best candidates and has saved our team countless hours of manual review.",
      author: "Michael Chen",
      position: "Talent Acquisition Lead",
      company: "Innovate Solutions",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "We've been able to scale our hiring process efficiently thanks to HireFlow. The automated testing and interview scheduling features are invaluable.",
      author: "Jessica Rodriguez",
      position: "COO",
      company: "Startup Ventures",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ];

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

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

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
    };
  }, []);

  return (
    <section
      id="testimonials"
      className="py-24 bg-md-background relative"
      ref={testimonialsRef}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,#6750A4_0,transparent_70%)] opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-fade-in"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          <div className="inline-block mb-3 px-4 py-1 bg-md-tertiary-container border border-md-outline/20 rounded-full text-md-on-tertiary-container text-sm font-medium">
            Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-md-on-background mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-md-primary to-md-tertiary">
              Trusted by Elite Companies
            </span>
          </h2>
          <p className="text-xl text-md-on-surface-variant">
            See how HireFlow is helping premium organizations transform their
            hiring process.
          </p>
        </div>

        <div
          className="relative max-w-4xl mx-auto opacity-0 animate-fade-in"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          {/* Testimonial slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-md-surface-container-high p-8 md:p-10 rounded-3xl shadow-md border border-md-outline/20 hover:border-md-outline/40 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center mb-8">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-md-primary to-md-tertiary blur-sm opacity-70 animate-pulse"></div>
                          <Image
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.author}
                            width={80}
                            height={80}
                            className="rounded-full border-2 border-md-outline relative z-10 object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-md-on-surface text-xl">
                          {testimonial.author}
                        </h4>
                        <p className="text-md-primary">
                          {testimonial.position}, {testimonial.company}
                        </p>
                      </div>
                    </div>

                    <blockquote className="text-md-on-surface-variant italic text-xl leading-relaxed mb-6">
                      &#34;{testimonial.quote}&#34;
                    </blockquote>

                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-6 h-6 text-md-tertiary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-gradient-to-r from-md-primary to-md-tertiary w-8"
                    : "bg-md-surface-variant hover:bg-md-outline"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div
          className="mt-24 opacity-0 animate-fade-in"
          style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
        >
          <div className="bg-md-surface-container-high rounded-3xl overflow-hidden shadow-md border border-md-outline/20 transform hover:scale-[1.02] transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-block mb-3 px-4 py-1 bg-md-tertiary-container border border-md-outline/20 rounded-full text-md-on-tertiary-container text-sm font-medium">
                  PREMIUM CASE STUDY
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-md-on-surface mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-md-primary to-md-tertiary">
                    How TechGrowth Reduced Hiring Time by 65%
                  </span>
                </h3>
                <p className="text-md-on-surface-variant mb-8">
                  Learn how TechGrowth Inc. transformed their recruitment
                  process and found better candidates faster using HireFlow&#34;s
                  AI-powered platform.
                </p>
                <div>
                  <button className="px-8 py-3 bg-md-primary hover:bg-md-primary-container text-md-on-primary hover:text-md-on-primary-container font-medium rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
                    <span className="relative z-10">Read Case Study</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-[radial-gradient(#6750A4_0.5px,transparent_0.5px)] [background-size:10px_10px] opacity-10 z-10"></div>
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Case Study"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-md-surface-container-highest/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
