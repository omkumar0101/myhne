"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Updated trending memes with real images from free sources
const trendingMemes = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=1000&auto=format&fit=crop",
    title: "When the bull run finally starts",
    likes: 2453,
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop",
    title: "Diamond hands through the dip",
    likes: 1872,
  },
  {
    id: 3,
    imageUrl: "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1000",
    title: "My AI trading bot vs the market",
    likes: 1654,
  },
  {
    id: 4,
    imageUrl: "https://images.pexels.com/photos/8369590/pexels-photo-8369590.jpeg?auto=compress&cs=tinysrgb&w=1000",
    title: "Explaining NFTs to my parents",
    likes: 1432,
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1000&auto=format&fit=crop",
    title: "Calculating crypto taxes be like",
    likes: 1298,
  },
]

export default function TrendingMemes() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingMemes.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + trendingMemes.length) % trendingMemes.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Reset autoplay timer when manually changing slides
  const handleManualNavigation = (action: () => void) => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    action()
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 4000)
    }
  }

  // Setup autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 4000)
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying])

  // Fixed image fitting issues
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-purple-800/30 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative aspect-video w-full overflow-hidden">
        {/* Main slider */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {trendingMemes.map((meme) => (
            <div key={meme.id} className="relative min-w-full h-full">
              <img
                src={meme.imageUrl || "/placeholder.svg"}
                alt={meme.title}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-lg font-bold text-white truncate pr-2">{meme.title}</h3>
                  <div className="flex items-center space-x-1 rounded-full bg-purple-600/80 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs text-white whitespace-nowrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="sm:w-3 sm:h-3"
                    >
                      <path d="M7 10v12"></path>
                      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                    </svg>
                    <span>{meme.likes.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-1 sm:left-2 top-1/2 z-10 h-6 w-6 sm:h-8 sm:w-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 p-0"
          onClick={() => handleManualNavigation(prevSlide)}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 sm:right-2 top-1/2 z-10 h-6 w-6 sm:h-8 sm:w-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 p-0"
          onClick={() => handleManualNavigation(nextSlide)}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Indicators */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 sm:space-x-2 pb-1 sm:pb-2">
          {trendingMemes.map((_, index) => (
            <button
              key={index}
              className={`h-1 sm:h-1.5 rounded-full transition-all ${
                index === currentIndex ? "w-4 sm:w-6 bg-purple-500" : "w-1.5 sm:w-2 bg-white/50"
              }`}
              onClick={() => handleManualNavigation(() => goToSlide(index))}
            />
          ))}
        </div>
      </div>

      {/* Trending label */}
      <div className="absolute left-2 sm:left-4 top-2 sm:top-4 z-10 rounded-full bg-purple-600 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-white">
        TRENDING
      </div>
    </div>
  )
}

