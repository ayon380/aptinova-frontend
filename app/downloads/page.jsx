"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  CheckCircle2,
  Smartphone,
  Shield,
  Zap,
  Wifi,
  Menu,
  X,
  Moon,
  Sun,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const Downloads = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const version = "1.0.2";
  const apkSize = "15.4 MB";
  const appFeatures = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Native Experience",
      description: "Optimized for Android devices with a smooth, native feel",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "End-to-end encryption for your recruitment data",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Offline Mode",
      description: "Continue working even without an internet connection",
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Low Data Usage",
      description: "Designed to minimize data consumption on mobile networks",
    },
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleDownload = () => {
    setDownloadStarted(true);
    // Reset after animation completes
    setTimeout(() => {
      setDownloadStarted(false);
    }, 3000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement actual dark mode toggling
  };

  return (
    <div className="min-h-screen bg-md-background flex flex-col">
      {/* Header */}
      <header className="bg-md-surface sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-xl bg-md-primary flex items-center justify-center">
                <span className="text-md-on-primary text-lg font-bold">A</span>
              </div>
              <span className="text-xl font-bold text-md-on-surface">
                Aptinova
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-md-on-surface-variant hover:text-md-primary transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
              >
                Sign up
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-md-surface-container transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden ${isMenuOpen ? "block" : "hidden"} mt-4 pb-4`}
          >
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-md-on-surface-variant hover:text-md-primary transition-colors py-2"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="text-md-on-surface-variant hover:text-md-primary transition-colors py-2"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-md-on-surface-variant hover:text-md-primary transition-colors py-2"
              >
                Pricing
              </Link>
              <Link
                href="/downloads"
                className="text-md-primary font-medium py-2"
              >
                Downloads
              </Link>
              <Link
                href="/contact"
                className="text-md-on-surface-variant hover:text-md-primary transition-colors py-2"
              >
                Contact
              </Link>
              <div className="flex items-center justify-between pt-4 border-t border-md-outline/10">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-md-surface-container transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <div className="flex space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-md-primary-container to-md-tertiary-container">
        {/* Animated background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-md-primary opacity-10 animate-float"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-md-tertiary opacity-10 animate-float-delay"></div>
          <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-md-secondary opacity-10 animate-float-slow"></div>
        </div>

        <div
          className={`container mx-auto px-6 py-20 relative z-10 transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold text-md-on-surface mb-6 leading-tight">
                Aptinova Mobile{" "}
                <span className="text-md-primary">Android App</span>
              </h1>
              <p className="text-xl text-md-on-surface-variant mb-8">
                Take your recruitment journey on the go. Access candidates,
                interviews, and analytics anywhere, anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/apk/Aptinova.apk"
                  download
                  className="relative overflow-hidden group"
                  onClick={handleDownload}
                >
                  <div
                    className={`px-8 py-3 rounded-full bg-md-primary text-md-on-primary text-center hover:bg-md-primary-container hover:text-md-on-primary-container transition-all duration-300 flex items-center justify-center gap-2 ${
                      downloadStarted ? "animate-pulse" : ""
                    }`}
                  >
                    {downloadStarted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download APK</span>
                      </>
                    )}
                  </div>
                  <span className="absolute inset-0 bg-md-primary-container scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </a>

                <div className="text-md-on-surface-variant text-sm pt-2 flex flex-col">
                  <span>Version {version}</span>
                  <span>Size: {apkSize}</span>
                </div>
              </div>
            </div>

            <div
              className={`md:w-1/2 flex justify-center transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              {/* Samsung Ultra phone mockup */}
              <div className="relative w-[280px] h-[560px]">
                {/* Samsung Ultra frame */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[1.2rem] shadow-2xl overflow-hidden">
                  {/* Subtle edge shimmer */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 opacity-30"></div>
                  <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-gray-700 via-gray-500 to-gray-700 opacity-30"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 opacity-30"></div>
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-gray-700 via-gray-500 to-gray-700 opacity-30"></div>
                </div>

                {/* Volume buttons */}
                <div className="absolute left-[-3px] top-[120px] h-16 w-1 bg-gray-700 rounded-r-lg"></div>
                <div className="absolute left-[-3px] top-[160px] h-12 w-1 bg-gray-700 rounded-r-lg"></div>

                {/* Power button */}
                <div className="absolute right-[-3px] top-[140px] h-16 w-1 bg-gray-700 rounded-l-lg"></div>

                {/* Screen with curved edges */}
                <div className="absolute inset-[4px] rounded-[1rem] overflow-hidden bg-black">
                  <div className="absolute inset-[1px] rounded-[1rem] overflow-hidden bg-gradient-to-br from-md-primary-container to-md-surface-container">
                    {/* Camera cutout */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-black z-20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gray-900 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                      </div>
                    </div>

                    {/* Status bar */}
                    <div className="h-10 w-full bg-md-surface-container-high flex items-center justify-between px-8 pt-2">
                      <div className="text-md-on-surface-variant text-xs">
                        9:41
                      </div>
                      {/* <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-md-primary"></div>
                        <div className="w-3 h-3 rounded-full bg-md-tertiary"></div>
                      </div> */}
                    </div>

                    {/* App content */}
                    <div className="flex flex-col h-[calc(100%-2.5rem)] p-4">
                      {/* App header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-md-primary flex items-center justify-center">
                            <span className="text-md-on-primary text-sm font-bold">
                              A
                            </span>
                          </div>
                          <span className="text-md-on-surface text-lg font-bold">
                            Aptinova
                          </span>
                        </div>
                      </div>

                      {/* Dashboard preview with animation */}
                      <div className="bg-md-surface rounded-xl p-3 mb-3 animate-float-slow">
                        <div className="h-2 w-1/2 bg-md-primary-container rounded-full mb-2"></div>
                        <div className="flex justify-between mb-2">
                          <div className="h-8 w-8 rounded-md bg-md-tertiary-container"></div>
                          <div className="h-8 w-16 rounded-md bg-md-secondary-container"></div>
                        </div>
                        <div className="h-20 bg-md-surface-variant rounded-lg"></div>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <div className="bg-md-surface rounded-xl p-3 flex-1 animate-float">
                          <div className="h-2 w-1/2 bg-md-tertiary-container rounded-full mb-2"></div>
                          <div className="h-16 bg-md-surface-variant rounded-lg"></div>
                        </div>
                        <div className="bg-md-surface rounded-xl p-3 flex-1 animate-float-delay">
                          <div className="h-2 w-1/2 bg-md-primary-container rounded-full mb-2"></div>
                          <div className="h-16 bg-md-surface-variant rounded-lg"></div>
                        </div>
                      </div>

                      <div className="bg-md-surface rounded-xl p-3 flex-1 animate-float-slow-alt">
                        <div className="h-2 w-1/3 bg-md-secondary-container rounded-full mb-2"></div>
                        <div className="h-40 bg-md-surface-variant rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated glowing effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-md-primary/20 via-transparent to-md-tertiary/20 rounded-[4rem] filter blur-xl opacity-70 animate-pulse-slow -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-md-surface">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-md-on-surface mb-12 text-center">
            Mobile App Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {appFeatures.map((feature, index) => (
              <div
                key={index}
                className={`p-6 bg-md-surface-container rounded-3xl transition-all duration-500 hover:shadow-lg hover:-translate-y-2 relative overflow-hidden ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100 + 500}ms` }}
              >
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-md-primary/5 rounded-full -translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>

                <div className="rounded-2xl bg-md-primary-container p-4 inline-block mb-4 group-hover:bg-md-primary transition-all duration-300 relative z-10 text-md-on-primary-container">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-md-on-surface mb-2 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-md-on-surface-variant relative z-10">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Installation Guide */}
      <div className="py-16 bg-md-background">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-md-on-surface mb-8 text-center">
            Installation Guide
          </h2>

          <div className="max-w-2xl mx-auto">
            <div className="bg-md-surface-container rounded-3xl p-8 shadow-sm">
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-primary-container text-md-on-primary-container font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Download the APK
                    </h4>
                    <p className="text-md-on-surface-variant mb-2">
                      Click the download button above to get the latest version
                      of the Aptinova Android app.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-primary-container text-md-on-primary-container font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Enable Unknown Sources
                    </h4>
                    <p className="text-md-on-surface-variant mb-2">
                      Go to Settings &gt; Security &gt; Unknown Sources and
                      enable it to allow installation of apps from sources other
                      than the Play Store.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-primary-container text-md-on-primary-container font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Install the App
                    </h4>
                    <p className="text-md-on-surface-variant mb-2">
                      Open the downloaded APK file and follow the on-screen
                      instructions to install.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-md-primary-container text-md-on-primary-container font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-md-on-surface mb-1">
                      Launch and Log In
                    </h4>
                    <p className="text-md-on-surface-variant">
                      Open the installed app and log in with your Aptinova
                      account credentials.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 p-4 bg-md-tertiary-container rounded-xl">
                <p className="text-md-on-tertiary-container">
                  <strong>Note:</strong> If you encounter any issues during
                  installation, please contact our support team at
                  aptinovacare@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="py-16 bg-md-surface">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-md-on-surface mb-4">
            Coming Soon
          </h2>
          <p className="text-xl text-md-on-surface-variant max-w-2xl mx-auto mb-8">
            We're working on expanding our mobile offerings. Stay tuned for:
          </p>

          <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
            <div className="bg-md-surface-container rounded-2xl p-6 opacity-70 transition-all hover:opacity-100 hover:shadow-md">
              <Image
                src="/icons/ios.png"
                alt="iOS App"
                width={60}
                height={60}
                className="mx-auto mb-3"
              />
              <p className="text-md-on-surface font-medium">iOS App</p>
            </div>

            <div className="bg-md-surface-container rounded-2xl p-6 opacity-70 transition-all hover:opacity-100 hover:shadow-md">
              <Image
                src="/icons/playstore.png"
                alt="Google Play Store"
                width={40}
                height={40}
                className="mx-auto mb-3"
              />
              <p className="text-md-on-surface font-medium">
                Google Play Store
              </p>
            </div>

            <div className="bg-md-surface-container rounded-2xl p-6 opacity-70 transition-all hover:opacity-100 hover:shadow-md">
              <Image
                src="/icons/windows.png"
                alt="Windows App"
                width={40}
                height={40}
                className="mx-auto mb-3"
              />
              <p className="text-md-on-surface font-medium">Windows App</p>
            </div>

            <div className="bg-md-surface-container rounded-2xl p-6 opacity-70 transition-all hover:opacity-100 hover:shadow-md">
              <Image
                src="/icons/macos.png"
                alt="macOS App"
                width={60}
                height={60}
                className="mx-auto mb-3"
              />
              <p className="text-md-on-surface font-medium">macOS App</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-md-surface-container-high mt-auto">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <div className="h-10 w-10 rounded-xl bg-md-primary flex items-center justify-center">
                  <span className="text-md-on-primary text-lg font-bold">
                    A
                  </span>
                </div>
                <span className="text-xl font-bold text-md-on-surface">
                  Aptinova
                </span>
              </Link>
              <p className="text-md-on-surface-variant mb-6">
                Modern recruitment software that streamlines your hiring process
                and helps you find the best talent.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com"
                  className="text-md-on-surface-variant hover:text-md-primary"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-md-on-surface-variant hover:text-md-primary"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="https://github.com"
                  className="text-md-on-surface-variant hover:text-md-primary"
                >
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-md-on-surface font-bold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/features"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/downloads"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Downloads
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-md-on-surface font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-md-on-surface font-bold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-md-outline/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-md-on-surface-variant text-sm">
              &copy; {new Date().getFullYear()} Aptinova. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-md-on-surface-variant hover:text-md-primary text-sm"
              >
                English
              </Link>
              <Link
                href="#"
                className="text-md-on-surface-variant hover:text-md-primary text-sm"
              >
                Support
              </Link>
              <Link
                href="#"
                className="text-md-on-surface-variant hover:text-md-primary text-sm"
              >
                Status
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Additional animations CSS */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
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
            transform: translateY(-5px) translateX(5px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes float-slow-alt {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-7px) translateX(-5px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes pulse-slow {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.5;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 5s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-slow-alt {
          animation: float-slow-alt 7s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Downloads;
