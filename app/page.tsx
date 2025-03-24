import type { Metadata } from "next"
import Navbar from "@/components/landing/navbar"
import HeroSection from "@/components/landing/hero-section"
import FeaturesSection from "@/components/landing/features-section"
import TestimonialsSection from "@/components/landing/testimonials-section"
import CtaSection from "@/components/landing/cta-section"
import Footer from "@/components/landing/footer"
import ThemeProvider from "@/components/landing/theme-provider"

export const metadata: Metadata = {
  title: "HireFlow | Premium AI Hiring Platform",
  description: "AI-powered hiring platform that simplifies recruitment and finds the best candidates in less time.",
}

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <FeaturesSection />
          <TestimonialsSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

