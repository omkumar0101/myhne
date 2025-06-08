"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, Rocket, Diamond, Globe } from "lucide-react"
import TokenDistribution from "@/components/token-distribution"
import FloatingMemes from "@/components/floating-memes"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AIImageGenerator from "@/components/ai-image-generator"
import TokenBuying from "@/components/token-buying"
import MiniGames from "@/components/mini-games"
import AIChat from "@/components/ai-chat"
import TrendingMemes from "@/components/trending-memes"
import { ConnectWalletButton } from "@/components/ConnectWalletButton"
import CreditsManager from "@/components/credits-manager"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1211] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-8 md:pb-12 overflow-hidden">
        <FloatingMemes />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-[#9FFFE0]">
              Welcome to Hyper Neurox – Where AI Meets Relaxation
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-[#9FFFE0]/80 max-w-3xl mx-auto">
              Hyper Neurox is a cutting-edge AI-powered platform designed to help users unwind from crypto market stress. By
              blending AI-generated art, entertainment, and mental well-being, Hyper Neurox provides a unique space where
              technology meets tranquility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#9FFFE0] hover:bg-[#9FFFE0]/90 text-[#0B1211] w-full sm:w-auto"
                onClick={() => {
                  const generatorSection = document.getElementById("ai-generator-section")
                  if (generatorSection) {
                    const headerOffset = 80
                    const elementPosition = generatorSection.getBoundingClientRect().top
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    })
                  }
                }}
              >
                Try This AI
              </Button>
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </section>

      {/* About Section - moved above AI Chat & Image Generation */}
      <section id="about" className="py-10 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-[#9FFFE0]">What is Hyper Neurox?</h2>
            <p className="text-base md:text-lg mb-6 md:mb-8 text-[#9FFFE0]/70 max-w-3xl mx-auto">
              Hyper Neurox is an innovative platform that merges artificial intelligence with mental wellness and blockchain
              technology. It is designed for users who need a break from the volatility of the crypto market, offering
              AI-powered image generation, stress-relief activities, and a fun, interactive experience. Our goal is to
              create a digital sanctuary where users can relax, generate images, and engage with a vibrant community.
            </p>
          </div>
        </div>
      </section>

      {/* AI Chat & Image Generation Section */}
      <section id="ai-chat-games" className="py-10 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-[#9FFFE0]">
            AI Chat & Image Generation
          </h2>

          <div className="bg-[#0B1211]/40 p-4 md:p-6 rounded-xl border border-[#9FFFE0]/30 backdrop-blur-sm">
            <p className="text-[#9FFFE0]/70 mb-6">
              Interact with our AI assistant for crypto insights and relaxation tips, or create stunning AI-generated images using our advanced image generation system.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 h-full items-stretch">
              <div className="h-full flex flex-col">
                <h4 className="text-lg font-semibold mb-3 text-white">AI Chat Assistant</h4>
                <p className="text-[#9FFFE0]/70 mb-4">
                  Chat with our AI assistant for crypto insights, relaxation tips, and friendly conversation.
                </p>
                <div className="flex-grow h-full flex flex-col">
                  <AIChat />
                </div>
              </div>

              <div className="h-full flex flex-col">
                <h4 className="text-lg font-semibold mb-3 text-white">Create Your AI Image</h4>
                <p className="text-[#9FFFE0]/70 mb-4">
                  Generate unique AI-powered images using your credits. Describe what you want to see, and our AI will bring it to life.
                </p>
                <div className="flex-grow h-full flex flex-col">
                  <AIImageGenerator />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mini-Games Section */}
      <section id="features" className="py-8 md:py-12 scroll-mt-20">
        <div className="container mx-auto px-4">

          {/* Happy trending coin news Section */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-[#9FFFE0]">
            Happy trending coin news
          </h2>
          <div className="mb-8 md:mb-12">
            <Card className="bg-[#0B1211]/60 border-[#9FFFE0]/30 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-[#9FFFE0] flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#0B1211]"
                  >
                    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                    <path d="M7 7h.01"></path>
                  </svg>
                </div>
                <p className="text-[#9FFFE0]/70 mb-4">
                  New memes appear dynamically, keeping users entertained and engaged. Your AI-generated images will
                  join the floating meme system, creating a personalized experience.
                </p>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-[#9FFFE0] mb-2">TRENDING MEMES</h4>
                  <TrendingMemes />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mini-Games Section */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-[#9FFFE0] mt-12">
            Mini-Games
          </h2>
          <div className="bg-[#0B1211]/40 p-4 md:p-6 rounded-xl border border-[#9FFFE0]/30 backdrop-blur-sm">
            <p className="text-[#9FFFE0]/70 mb-6">
                  Take a break from crypto stress with these relaxing mini-games designed to calm your mind.
                </p>
                <div className="flex-grow">
                  <MiniGames />
            </div>
          </div>
        </div>
      </section>

      {/* Token Buying Section */}
      <section id="buy" className="py-10 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center text-[#9FFFE0]">How to Buy $NEUROX</h2>
          <p className="text-lg mb-12 text-[#9FFFE0]/70 text-center max-w-3xl mx-auto">
            Ready to join the Neurox ecosystem? Get your $NEUROX tokens through various exchanges or directly add the
            token to your wallet.
          </p>

          <TokenBuying />
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-10 bg-[#0B1211]/50 backdrop-blur-sm scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center text-[#9FFFE0]">Our Vision & Milestones</h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#9FFFE0] flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#0B1211]"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Phase 1 – Foundation & Development</h3>
                </div>
                <div className="ml-14 space-y-2">
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Check className="h-4 w-4 text-[#9FFFE0] mr-2" /> Concept creation & branding
                  </p>
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Check className="h-4 w-4 text-[#9FFFE0] mr-2" /> Website & AI infrastructure development
                  </p>
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Check className="h-4 w-4 text-[#9FFFE0] mr-2" /> Tokenomics & whitepaper release
                  </p>
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Check className="h-4 w-4 text-[#9FFFE0] mr-2" /> AI-powered meme & image generation system
                  </p>
                </div>
                <Progress value={100} className="h-2 mt-4 bg-[#0B1211]" />
              </div>

              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#9FFFE0] flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#0B1211]"
                    >
                      <path d="M12 19V5"></path>
                      <path d="m5 12 7-7 7 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Phase 2 – Launch & Community Growth</h3>
                </div>
                <div className="ml-14 space-y-2">
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Check className="h-4 w-4 text-[#9FFFE0] mr-2" /> Community building (Telegram, X
                )
                  </p>
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Rocket className="h-4 w-4 text-[#9FFFE0] mr-2" /> Token Launch through LiquidLaunch on Hyper Liquid
                  </p>
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Rocket className="h-4 w-4 text-[#9FFFE0] mr-2" />
                    Listing on major exchanges
                  </p>
                </div>
                <Progress value={60} className="h-2 mt-4 bg-[#0B1211]" />
              </div>

              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#9FFFE0] flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#0B1211]"
                    >
                      <path d="M12 2v20"></path>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Phase 3 – Expansion & Utility</h3>
                </div>
                <div className="ml-14 space-y-2">
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Diamond className="h-4 w-4 text-[#9FFFE0] mr-2" /> Staking and reward mechanisms
                  </p>
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Diamond className="h-4 w-4 text-[#9FFFE0] mr-2" /> AI enhancements & new creative features
                  </p>
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Diamond className="h-4 w-4 text-[#9FFFE0] mr-2" /> Partnership & ecosystem growth
                  </p>
                </div>
                <Progress value={20} className="h-2 mt-4 bg-[#0B1211]" />
              </div>

              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#9FFFE0] flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#0B1211]"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Phase 4 – Global Adoption</h3>
                </div>
                <div className="ml-14 space-y-2">
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Globe className="h-4 w-4 text-[#9FFFE0] mr-2" /> Full-scale platform launch
                  </p>
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Globe className="h-4 w-4 text-[#9FFFE0] mr-2" /> Enterprise & Web3 integrations
                  </p>
                  <p className="text-[#9FFFE0]/70 flex items-center">
                    <Globe className="h-4 w-4 text-[#9FFFE0] mr-2" /> Mobile app release
                  </p>
                </div>
                <Progress value={5} className="h-2 mt-4 bg-[#0B1211]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-12 md:py-20 bg-[#0B1211]/50 backdrop-blur-sm scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-[#9FFFE0]">
              Join the Hyper Neurox Movement!
            </h2>
            <p className="text-base md:text-lg mb-6 md:mb-8 text-[#9FFFE0]/70">
              Be part of our growing community and stay updated on the latest developments, features, and token news.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Button
                variant="outline"
                className="border-[#9FFFE0] text-[#9FFFE0] hover:bg-[#9FFFE0]/20 text-sm md:text-base"
                onClick={() => window.open("https://x.com/Hyper_Neurox", "_blank")}
              >
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
                  className="mr-2"
                >
                  <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z"></path>
                </svg>
                Twitter
              </Button>
              
            
              <Button
                variant="outline"
                className="border-[#9FFFE0] text-[#9FFFE0] hover:bg-[#9FFFE0]/20 text-sm md:text-base"
                onClick={() => window.open("https://t.me/hyper_neuroX", "_blank")}
              >
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
                  className="mr-2"
                >
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
                Telegram
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

