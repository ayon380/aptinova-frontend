import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-md-surface-container-highest border-t border-md-outline/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-6">
              {/* Logo placeholder */}
              <div className="h-10 w-32 bg-gradient-to-r from-md-primary to-md-tertiary rounded-full flex items-center justify-center text-md-on-primary font-bold">
                HireFlow
              </div>
            </div>
            <p className="text-md-on-surface-variant mb-6">
              Premium AI-powered hiring platform that simplifies recruitment and finds the best candidates in less time.
            </p>
            <div className="space-y-3">
              <div className="flex items-center group">
                <Mail className="w-5 h-5 text-md-primary mr-3 group-hover:text-md-tertiary transition-colors" />
                <span className="text-md-on-surface-variant group-hover:text-md-on-surface transition-colors">contact@hireflow.com</span>
              </div>
              <div className="flex items-center group">
                <Phone className="w-5 h-5 text-md-primary mr-3 group-hover:text-md-tertiary transition-colors" />
                <span className="text-md-on-surface-variant group-hover:text-md-on-surface transition-colors">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center group">
                <MapPin className="w-5 h-5 text-md-primary mr-3 group-hover:text-md-tertiary transition-colors" />
                <span className="text-md-on-surface-variant group-hover:text-md-on-surface transition-colors">
                  123 Innovation St, San Francisco, CA
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-md-on-surface mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-md-primary to-md-tertiary">Product</span>
            </h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "Case Studies", "Testimonials", "API Documentation"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-md-on-surface-variant hover:text-md-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-md-on-surface mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-md-primary to-md-tertiary">Company</span>
            </h3>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Press", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-md-on-surface-variant hover:text-md-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-md-on-surface mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-md-primary to-md-tertiary">
                Subscribe
              </span>
            </h3>
            <p className="text-md-on-surface-variant mb-4">Stay updated with the latest features and releases.</p>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 rounded-l-full border border-md-outline bg-md-surface-container text-md-on-surface focus:outline-none focus:ring-2 focus:ring-md-primary transition-all"
              />
              <button className="px-4 py-2 bg-md-primary hover:bg-md-primary-container text-md-on-primary hover:text-md-on-primary-container font-medium rounded-r-full transition-all duration-300">
                Subscribe
              </button>
            </div>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
                { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
                { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" },
                { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-md-surface-container flex items-center justify-center text-md-on-surface-variant hover:text-md-primary hover:bg-md-surface-container-high transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-md-outline/10 flex flex-col md:flex-row justify-between items-center">
          <div className="text-md-on-surface-variant mb-4 md:mb-0">© {new Date().getFullYear()} HireFlow. All rights reserved.</div>
          <div className="flex space-x-6">
            <Link href="#" className="text-md-on-surface-variant hover:text-md-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-md-on-surface-variant hover:text-md-primary transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-md-on-surface-variant hover:text-md-primary transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

