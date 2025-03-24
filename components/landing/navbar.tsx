"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ThemeToggle from "./theme-toggle"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? "bg-black/90 backdrop-blur-md border-b border-gold-500/20" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Logo placeholder */}
              <div className="h-10 w-32 bg-gradient-to-r from-gold-400 to-gold-600 rounded-md flex items-center justify-center text-black font-bold">
                HireFlow
              </div>
            </div>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {["Features", "How It Works", "Testimonials", "Pricing"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-300 hover:text-gold-400 font-medium transition-colors relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <div className="hidden md:block">
              <button className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black px-5 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                Get Started
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-gold-400">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-b border-gold-500/20 shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {["Features", "How It Works", "Testimonials", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block py-2 text-gray-300 hover:text-gold-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <button className="w-full mt-4 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black px-5 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)]">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

