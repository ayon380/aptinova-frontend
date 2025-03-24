"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export default function HeroSection() {
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Parallax effect for decorative elements
    const handleMouseMove = (e: MouseEvent) => {
      if (!circleRef.current) return

      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight

      circleRef.current.style.transform = `translate(${x * 30}px, ${y * 30}px)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Tech-inspired background */}
      <div className="absolute inset-0 bg-black -z-10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Animated circuit lines */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="none"
              stroke="url(#circuitGradient)"
              strokeWidth="0.1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0,50 L100,50 M50,0 L50,100"
              fill="none"
              stroke="url(#circuitGradient)"
              strokeWidth="0.05"
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#FFC107" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#F9A825" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Animated gold circle */}
      <div
        ref={circleRef}
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-gold-400/10 to-gold-600/5 blur-3xl -z-10 animate-pulse"
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block mb-3 px-4 py-1 bg-gold-900/30 border border-gold-500/20 rounded-full text-gold-400 text-sm font-medium">
              AI-Powered Recruitment
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-300 to-gold-500">
                Hiring, Elevated
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Our premium AI platform transforms your recruitment process, delivering exceptional talent with
              unprecedented efficiency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group relative px-8 py-3 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-medium rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] overflow-hidden">
                <span className="relative z-10">Get Started Free</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold-300 to-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              </button>

              <button className="px-8 py-3 bg-transparent text-gold-400 border border-gold-500/50 hover:border-gold-400 font-medium rounded-md shadow-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                Watch Demo
              </button>
            </div>

            <div className="mt-12 text-sm text-gray-400">
              <span className="block mb-4">Trusted by premium enterprises worldwide</span>
              <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-24 bg-gray-800 rounded opacity-50 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-gold-500 text-xs"
                  >
                    PREMIUM CLIENT
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500">
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-gold-600/20 rounded-2xl blur-xl opacity-70 animate-pulse"></div>

              {/* Main dashboard image */}
              <div className="relative bg-gray-900 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.2)] overflow-hidden border border-gold-500/30">
                <div className="absolute inset-0 bg-[radial-gradient(#FFD700_0.5px,transparent_0.5px)] [background-size:10px_10px] opacity-10"></div>
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="HireFlow Premium Dashboard"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />

                {/* Animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Scan line animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold-400/70 to-transparent absolute top-0 left-0 animate-[scan_3s_ease-in-out_infinite]"></div>
                </div>
              </div>

              {/* Floating elements with animations */}
              <div className="absolute -top-6 -right-6 bg-gray-900 p-4 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-gold-500/30 transform hover:scale-110 hover:rotate-3 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-900/50 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">AI Matching</div>
                    <div className="text-xs text-gold-400">98% accuracy</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-gray-900 p-4 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-gold-500/30 transform hover:scale-110 hover:rotate-[-3deg] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-900/50 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Time Saved</div>
                    <div className="text-xs text-gold-400">80% reduction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

