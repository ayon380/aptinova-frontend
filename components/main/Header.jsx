import React from "react";
import Link from "next/link";
const Header = () => {
  return (
    <header className="bg-md-surface text-md-on-surface py-4  relative">
      <div className="container mx-auto px-4 mt-2 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-md-primary">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="text-md-on-surface hover:text-md-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-md-on-surface hover:text-md-primary transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-md-on-surface hover:text-md-primary transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Wavy border for header */}
      <div className="px-20 mt-5 opacity-45">
        <div className="wavy-line"></div>
      </div>
    </header>
  );
};

export default Header;
