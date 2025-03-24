import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gold-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-6">
              {/* Logo placeholder */}
              <div className="h-10 w-32 bg-gradient-to-r from-gold-400 to-gold-600 rounded-md flex items-center justify-center text-black font-bold">
                HireFlow
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Premium AI-powered hiring platform that simplifies recruitment and finds the best candidates in less time.
            </p>
            <div className="space-y-3">
              <div className="flex items-center group">
                <Mail className="w-5 h-5 text-gold-400 mr-3 group-hover:text-gold-300 transition-colors" />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">contact@hireflow.com</span>
              </div>
              <div className="flex items-center group">
                <Phone className="w-5 h-5 text-gold-400 mr-3 group-hover:text-gold-300 transition-colors" />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center group">
                <MapPin className="w-5 h-5 text-gold-400 mr-3 group-hover:text-gold-300 transition-colors" />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  123 Innovation St, San Francisco, CA
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-300 to-gold-500">Product</span>
            </h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "Case Studies", "Testimonials", "API Documentation"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-300 to-gold-500">Company</span>
            </h3>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Press", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-300 to-gold-500">
                Subscribe
              </span>
            </h3>
            <p className="text-gray-400 mb-4">Stay updated with the latest features and releases.</p>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 rounded-l-md border border-gold-500/30 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-medium rounded-r-md transition-all duration-300">
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
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:bg-gray-700 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold-500/10 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 mb-4 md:mb-0">© {new Date().getFullYear()} HireFlow. All rights reserved.</div>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-500 hover:text-gold-400 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gold-400 transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gold-400 transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

