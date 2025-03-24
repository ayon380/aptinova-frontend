"use client"

import { useEffect, useRef } from "react"

export default function CtaSection() {
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (ctaRef.current) {
      observer.observe(ctaRef.current)
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 relative" ref={ctaRef}>
      {/* Tech-inspired background */}
      <div className="absolute inset-0 bg-black -z-10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto opacity-0" style={{ animationFillMode: "forwards" }}>
          {/* Animated border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-2xl blur opacity-30 animate-pulse"></div>

          <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gold-500/30">
            <div className="absolute inset-0 bg-[radial-gradient(#FFD700_0.5px,transparent_0.5px)] [background-size:10px_10px] opacity-5"></div>

            <div className="px-8 py-16 md:p-16 text-center">
              <div className="inline-block mb-3 px-4 py-1 bg-gold-900/30 border border-gold-500/20 rounded-full text-gold-400 text-sm font-medium">
                PREMIUM ACCESS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-300 to-gold-500">
                  Ready to Transform Your Hiring Process?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Join elite companies that are saving time and finding better candidates with HireFlow's AI-powered
                platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-medium rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] overflow-hidden">
                  <span className="relative z-10 font-bold">Start Free Trial</span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold-300 to-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                </button>

                <button className="px-8 py-4 bg-transparent text-gold-400 border border-gold-500/50 hover:border-gold-400 font-medium rounded-md shadow-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                  Schedule Premium Demo
                </button>
              </div>

              <div className="mt-10 text-gold-400 text-sm">
                No credit card required. 14-day free trial with premium features.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

