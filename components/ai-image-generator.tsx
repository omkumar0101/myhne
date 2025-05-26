"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, Send, AlertCircle, Coins, Download, Trash2, Share2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Key for storing generated images in localStorage
const GENERATED_IMAGES_KEY = "generatedImages"

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [needsCredits, setNeedsCredits] = useState(false)
  const generatorRef = useRef<HTMLDivElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  // Load saved images from localStorage on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem(GENERATED_IMAGES_KEY)
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages)
        if (Array.isArray(parsedImages)) {
          setGeneratedImages(parsedImages)
        }
      } catch (error) {
        console.error("Error loading saved images:", error)
      }
    }
  }, [])

  const handleCreditsChange = (newCredits: number) => {
    setCredits(newCredits)
    setNeedsCredits(newCredits <= 0)
  }

  // Save generated images to localStorage
  const saveGeneratedImages = (images: string[]) => {
    try {
      localStorage.setItem(GENERATED_IMAGES_KEY, JSON.stringify(images))
    } catch (error) {
      console.error("Error saving generated images:", error)
    }
  }

  const generateImage = async () => {
    if (!prompt.trim()) return

    // Check if user has credits
    if (credits <= 0) {
      setNeedsCredits(true)
      setError("You need to purchase more credits to generate images")
      return
    }

    setIsGenerating(true)
    setError(null)
    setNeedsCredits(false)

    try {
      // Use the actual API
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      // First check if the response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error details from the response
        let errorMessage = `Server error: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          // If JSON parsing fails, try to get the text
          try {
            const errorText = await response.text()
            errorMessage = `Server error: ${errorText.substring(0, 100)}...`
          } catch (textError) {
            // If all else fails, use the status text
            errorMessage = `Server error: ${response.statusText}`
          }
        }
        throw new Error(errorMessage)
      }

      // Now try to parse the JSON response
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError)
        throw new Error("Failed to parse server response")
      }

      // Validate the response data
      if (!data || !data.image) {
        console.error("Invalid response data:", data)
        throw new Error("Invalid response from server")
      }

      // Create image URL from base64 data
      const imageUrl = `data:image/webp;base64,${data.image}`

      // Add to generated images
      const updatedImages = [imageUrl, ...generatedImages]
      setGeneratedImages(updatedImages)
      saveGeneratedImages(updatedImages) // Save to localStorage
      setImageUrl(imageUrl)

      // Deduct a credit
      setCredits((prev) => {
        const newCredits = prev - 1
        // Update localStorage
        try {
          const walletAddress = localStorage.getItem("connectedWalletAddress")
          if (walletAddress) {
            const storedCreditsData = localStorage.getItem("userCredits")
            if (storedCreditsData) {
              const allUserCredits = JSON.parse(storedCreditsData)
              const existingUserIndex = allUserCredits.findIndex(
                (user: any) => user.address.toLowerCase() === walletAddress.toLowerCase(),
              )
              if (existingUserIndex >= 0) {
                allUserCredits[existingUserIndex].credits = newCredits
                allUserCredits[existingUserIndex].lastUpdated = Date.now()
                localStorage.setItem("userCredits", JSON.stringify(allUserCredits))
              }
            }
          } else {
            // Handle anonymous user
            localStorage.setItem(
              "anonymousUserCredits",
              JSON.stringify({
                credits: newCredits,
                lastUpdated: Date.now(),
              }),
            )
          }
        } catch (error) {
          console.error("Error updating credits:", error)
        }
        return newCredits
      })

      setPrompt("")
    } catch (err) {
      console.error("Error generating image:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const addToFloatingSystem = (img: string) => {
    if (typeof window !== "undefined" && (window as any).addMemeToFloatingSystem) {
      ;(window as any).addMemeToFloatingSystem(img)
    }
  }

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `neurox-image-${index}.webp`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const removeImage = (index: number) => {
    const updatedImages = [...generatedImages]
    updatedImages.splice(index, 1)
    setGeneratedImages(updatedImages)
    saveGeneratedImages(updatedImages)
  }

  // Helper function to convert data URL to Blob
  const dataURLtoBlob = (dataURL: string): Blob => {
    // Convert base64/URLEncoded data component to raw binary data
    let byteString
    if (dataURL.split(",")[0].indexOf("base64") >= 0) {
      byteString = atob(dataURL.split(",")[1])
    } else {
      byteString = decodeURIComponent(dataURL.split(",")[1])
    }

    // Separate out the mime component
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0]

    // Write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ia], { type: mimeString })
  }

  const shareToWhatsApp = async (imageUrl: string) => {
    setIsSharing(true)
    try {
      // Check if Web Share API is available
      if (navigator.share && navigator.canShare) {
        try {
          // Convert data URL directly to blob without using fetch
          const blob = dataURLtoBlob(imageUrl)
          const file = new File([blob], "neurox-image.webp", { type: "image/webp" })

          // Check if we can share files
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "Check out this AI-generated image from NEUROX!",
              text: "Generated with NEUROX AI",
            })
          } else {
            // Fallback to WhatsApp web with text only
            window.open(`https://wa.me/?text=Check out this AI-generated image from NEUROX!`, "_blank")
          }
        } catch (err) {
          console.error("Error sharing:", err)
          // Fallback to WhatsApp web
          window.open(`https://wa.me/?text=Check out this AI-generated image from NEUROX!`, "_blank")
        }
      } else {
        // Fallback to WhatsApp web
        window.open(`https://wa.me/?text=Check out this AI-generated image from NEUROX!`, "_blank")
      }
    } catch (error) {
      console.error("Error in shareToWhatsApp:", error)
      // Final fallback
      window.open(`https://wa.me/?text=Check out this AI-generated image from NEUROX!`, "_blank")
    } finally {
      setIsSharing(false)
    }
  }

  useEffect(() => {
    if (imageUrl) {
      addToFloatingSystem(imageUrl)
    }
  }, [imageUrl])

  return (
    <div ref={generatorRef} id="ai-generator-section" className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {needsCredits && (
        <Alert className="mb-4 bg-blue-900/30 border-blue-800/50">
          <Coins className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-300">
            You need to purchase more credits to generate images. Connect your wallet and buy credits with NEUROX
            tokens.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-8 md:mb-10">
        <div className="bg-[#0B1211]/80 border-2 border-[#9FFFE0]/60 rounded-lg p-4 md:p-6 shadow-lg shadow-[#9FFFE0]/10">
          <h3 className="text-lg md:text-xl font-bold text-[#9FFFE0] mb-3 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-[#9FFFE0]" />
            Create Your AI Image
          </h3>

          <label htmlFor="image-prompt" className="block text-sm font-medium text-[#9FFFE0]/70 mb-2">
            Enter your image description below:
          </label>

          <div className="flex flex-col gap-4">
            <textarea
              id="image-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate... (be detailed for better results)"
              className="bg-[#0B1211] border-[#9FFFE0] text-white text-base md:text-lg py-4 px-4 h-24 min-h-[96px] rounded-md w-full focus:ring-2 focus:ring-[#9FFFE0] focus:border-[#9FFFE0] resize-none"
              onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && generateImage()}
            />

            <Button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim() || credits <= 0}
              className="bg-[#9FFFE0] hover:bg-[#7FFFD0] text-[#0B1211] w-full py-6 text-base md:text-lg font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Image...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {credits > 0
                    ? `Generate Image (${credits} credit${credits !== 1 ? "s" : ""} left)`
                    : "Purchase Credits to Generate"}
                </>
              )}
            </Button>
          </div>

          <div className="mt-3 bg-[#0B1211]/50 p-3 rounded-md">
            <p className="text-sm text-[#9FFFE0]/70">
              <strong className="text-[#9FFFE0]">Pro Tip:</strong> Try prompts like "crypto market bull run", "relaxing
              digital landscape", or "AI-powered meme"
            </p>
          </div>
        </div>
      </div>

      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-semibold text-white">Your Generated Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {generatedImages.map((img, index) => (
              <div key={index} className="relative group">
                <div className="overflow-hidden rounded-lg border border-purple-500/50 aspect-square">
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-purple-600 hover:bg-purple-700 h-7 w-7 p-0"
                    onClick={() => addToFloatingSystem(img)}
                    title="Add to floating system"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-green-600 hover:bg-green-700 h-7 w-7 p-0"
                    onClick={() => shareToWhatsApp(img)}
                    disabled={isSharing}
                    title="Share to WhatsApp"
                  >
                    {isSharing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Share2 className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-blue-600 hover:bg-blue-700 h-7 w-7 p-0"
                    onClick={() => downloadImage(img, index)}
                    title="Download image"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-red-600 hover:bg-red-700 h-7 w-7 p-0"
                    onClick={() => removeImage(index)}
                    title="Remove image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

