"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#0B1211] text-[#9FFFE0]/70 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#9FFFE0] mb-4">HYPER NEUROX</h3>
            <p className="mb-4">Where AI meets relaxation in the crypto space.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#9FFFE0] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="hover:text-[#9FFFE0] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-[#9FFFE0] transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#9FFFE0] mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-[#9FFFE0] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#9FFFE0] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#9FFFE0] mb-4">Subscribe</h3>
            <p className="mb-4">Stay updated with our latest news and announcements.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-[#0B1211] text-white px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#9FFFE0] w-full text-sm md:text-base border border-[#9FFFE0]/30"
              />
              <button className="bg-[#9FFFE0] hover:bg-[#9FFFE0]/90 text-[#0B1211] px-3 py-2 rounded-r-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#9FFFE0]/30 mt-8 md:mt-12 pt-6 md:pt-8 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Hyper Neurox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

