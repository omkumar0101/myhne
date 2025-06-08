"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface Meme {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  rotation: number
  rotationSpeed: number
  imageUrl?: string
}

export default function FloatingMemes() {
  const [memes, setMemes] = useState<Meme[]>([])
  const pathname = usePathname()

  useEffect(() => {
    // Only run this code on the client side
    if (typeof window === "undefined") return

    // Generate random memes
    const newMemes: Meme[] = []
    const count = window.innerWidth < 768 ? 5 : 8 // Fewer memes on mobile

    for (let i = 0; i < count; i++) {
      newMemes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: (20 + Math.random() * 30) * (window.innerWidth < 768 ? 0.8 : 1), // Smaller size on mobile
        speed: 0.1 + Math.random() * 0.3,
        opacity: 0.1 + Math.random() * 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
      })
    }

    setMemes(newMemes)

    // Animation loop
    let animationFrameId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const delta = time - lastTime
      lastTime = time

      setMemes((prevMemes) =>
        prevMemes.map((meme) => {
          let newY = meme.y - meme.speed * (delta / 16)
          if (newY < -20) newY = 120

          return {
            ...meme,
            y: newY,
            rotation: (meme.rotation + meme.rotationSpeed * (delta / 16)) % 360,
          }
        }),
      )

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [pathname])

  // Function to add a new meme with a custom image
  const addCustomMeme = (imageUrl: string) => {
    const newMeme: Meme = {
      id: Date.now(),
      x: Math.random() * 100,
      y: 110, // Start from bottom
      size: 60 + Math.random() * 40, // Larger size for generated images
      speed: 0.1 + Math.random() * 0.3,
      opacity: 0.6 + Math.random() * 0.4, // More visible
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
      imageUrl,
    }

    setMemes((prevMemes) => [...prevMemes, newMeme])
  }

  // Expose the addCustomMeme function to the window object only on the client side
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return
    ;(window as any).addMemeToFloatingSystem = addCustomMeme
    return () => {
      delete (window as any).addMemeToFloatingSystem
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {memes.map((meme) => (
        <div
          key={meme.id}
          className="absolute"
          style={{
            left: `${meme.x}%`,
            top: `${meme.y}%`,
            width: `${meme.size}px`,
            height: `${meme.size}px`,
            opacity: meme.opacity,
            transform: `rotate(${meme.rotation}deg)`,
            transition: "transform 0.5s ease-out",
          }}
        >
          <div className="w-full h-full bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30 flex items-center justify-center overflow-hidden">
            {meme.imageUrl ? (
              <img
                src={meme.imageUrl || "/placeholder.svg"}
                alt="Generated meme"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
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
                className="text-purple-300"
              >
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                <path d="M7 7h.01"></path>
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

