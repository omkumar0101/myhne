"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string, isMobile = false) => {
    return (e: React.MouseEvent) => {
      e.preventDefault()
      const element = document.querySelector(sectionId)
      if (element) {
        // Calculate position with offset for fixed header
        const headerOffset = 80 // Approximate header height
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })

        if (isMobile) {
          setIsMobileMenuOpen(false)
        }
      }
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0B1211]/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-[#9FFFE0] flex items-center justify-center">
                <span className="text-[#0B1211] font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-[#9FFFE0]">HYPER NEUROX</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="#about"
              className="text-sm lg:text-base text-white hover:text-[#9FFFE0] transition-colors"
              onClick={scrollToSection("#about")}
            >
              About
            </Link>
            <Link
              href="#features"
              className="text-sm lg:text-base text-white hover:text-[#9FFFE0] transition-colors"
              onClick={scrollToSection("#features")}
            >
              Features
            </Link>
            <Link
              href="#ai-chat-games"
              className="text-sm lg:text-base text-white hover:text-[#9FFFE0] transition-colors"
              onClick={scrollToSection("#ai-chat-games")}
            >
              AI Chat & Games
            </Link>
            <Link
              href="#buy"
              className="text-sm lg:text-base text-white hover:text-[#9FFFE0] transition-colors"
              onClick={scrollToSection("#buy")}
            >
              Buy
            </Link>
            <Link
              href="#roadmap"
              className="text-sm lg:text-base text-white hover:text-[#9FFFE0] transition-colors"
              onClick={scrollToSection("#roadmap")}
            >
              Roadmap
            </Link>
            <Link
              href="#community"
              className="text-sm lg:text-base text-white hover:text-[#9FFFE0] transition-colors"
              onClick={scrollToSection("#community")}
            >
              Community
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="text-[#9FFFE0] hover:text-white hover:bg-[#9FFFE0]/10">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0B1211]/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link
                href="#about"
                className="text-white hover:text-[#9FFFE0] transition-colors py-2"
                onClick={scrollToSection("#about", true)}
              >
                About
              </Link>
              <Link
                href="#features"
                className="text-white hover:text-[#9FFFE0] transition-colors py-2"
                onClick={scrollToSection("#features", true)}
              >
                Features
              </Link>
              <Link
                href="#ai-chat-games"
                className="text-white hover:text-[#9FFFE0] transition-colors py-2"
                onClick={scrollToSection("#ai-chat-games", true)}
              >
                AI Chat & Games
              </Link>
              <Link
                href="#buy"
                className="text-white hover:text-[#9FFFE0] transition-colors py-2"
                onClick={scrollToSection("#buy", true)}
              >
                Buy
              </Link>
              <Link
                href="#roadmap"
                className="text-white hover:text-[#9FFFE0] transition-colors py-2"
                onClick={scrollToSection("#roadmap", true)}
              >
                Roadmap
              </Link>
              <Link
                href="#community"
                className="text-white hover:text-[#9FFFE0] transition-colors py-2"
                onClick={scrollToSection("#community", true)}
              >
                Community
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

