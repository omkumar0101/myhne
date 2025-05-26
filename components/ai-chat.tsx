"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, RefreshCw, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Message = {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: string
  role?: "user" | "assistant" | "system"
  isFallback?: boolean
  isTemporary?: boolean
}

// Fallback responses when the client-side fetch fails completely
const CLIENT_FALLBACK_RESPONSES = [
  "I'm having trouble connecting right now. While I work on that, remember that taking breaks from crypto charts can help reduce stress.",
  "I seem to be experiencing connection issues. A good practice during market volatility is to focus on your long-term strategy rather than short-term fluctuations.",
  "I'm having difficulty connecting to my knowledge base. Try the breathing exercise in our mini-games section for immediate stress relief.",
  "My connection seems unstable at the moment. While I work on that, try this relaxation tip: practice deep breathing for 5 minutes to clear your mind.",
]

export default function AIChat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your HYPER NEUROX AI assistant. How can I help you relax today?",
      sender: "ai",
      timestamp: new Date().toISOString(),
      role: "assistant",
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [retryCount, setRetryCount] = useState(0)
  const retryCountRef = useRef(0)
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null)
  const maxRetries = 1 // Reduced to 1 retry to avoid excessive attempts
  const [isRetrying, setIsRetrying] = useState(false)

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }
  }

  // Scroll when messages change
  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom()
    }
  }, [messages])

  // Get a random fallback response
  const getRandomFallbackResponse = () => {
    return CLIENT_FALLBACK_RESPONSES[Math.floor(Math.random() * CLIENT_FALLBACK_RESPONSES.length)]
  }

  // Generate a contextual response based on the user's message
  const getContextualResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("crypto") || lowerMessage.includes("bitcoin") || lowerMessage.includes("market")) {
      return "The crypto market can be volatile, but maintaining a long-term perspective and not checking prices constantly can help reduce stress. Remember to only invest what you can afford to lose."
    } else if (lowerMessage.includes("relax") || lowerMessage.includes("stress") || lowerMessage.includes("anxiety")) {
      return "For immediate stress relief, try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. Repeat this a few times to help calm your nervous system."
    } else if (lowerMessage.includes("image") || lowerMessage.includes("generate") || lowerMessage.includes("ai")) {
      return "You can use our AI image generator to create calming visuals. Just describe what you'd like to see, and our AI will create it for you. This can be a great way to visualize peaceful scenes."
    } else if (lowerMessage.includes("token") || lowerMessage.includes("neurox") || lowerMessage.includes("buy")) {
      return "HYPER NEUROX is our platform token that combines AI with mental wellness for crypto enthusiasts."
    } else {
      // If no specific context is detected, use a random fallback response
      return getRandomFallbackResponse()
    }
  }

  const handleSend = async (userInput = input, isRetry = false) => {
    if (!userInput.trim() && !isRetry) return

    // Prevent multiple retries running at the same time
    if (isRetry && isRetrying) return

    // If not a retry, reset retry count and save the user message
    if (!isRetry) {
      setRetryCount(0)
      retryCountRef.current = 0
      setLastUserMessage(userInput.trim())
    } else {
      setIsRetrying(true)
    }

    setError(null)

    // Add user message if not a retry
    if (!isRetry) {
      const userMessage: Message = {
        id: Date.now(),
        text: userInput,
        sender: "user",
        timestamp: new Date().toISOString(),
        role: "user",
      }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
    }

    setIsTyping(true)

    // Show thinking message immediately
    const thinkingMessage: Message = {
      id: Date.now() + 999,
      text: "I'm thinking about this...",
      sender: "ai",
      timestamp: new Date().toISOString(),
      role: "assistant",
      isTemporary: true,
    }
    setMessages((prev) => [...prev.filter((m) => !m.isTemporary), thinkingMessage])

    try {
      // Prepare messages for the API - only include the last 5 messages
      const recentMessages = messages
        .filter((m) => !m.isTemporary) // Filter out temporary messages
        .slice(-5)
        .concat(
          isRetry ? [] : [{ id: Date.now(), text: userInput, sender: "user", timestamp: new Date().toISOString(), role: "user" }],
        )
        .filter((msg) => msg.role) // Only include messages with a role
        .map((msg) => ({
          role: msg.role,
          content: msg.text,
        }))

      // Call the API with a timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout for better response waiting

      try {
        // Make the API request with cache: 'no-store' to prevent caching
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          body: JSON.stringify({ messages: recentMessages }),
          signal: controller.signal,
          cache: "no-store",
        })

        clearTimeout(timeoutId)

        // Check response status first
        if (!response.ok) {
          console.error(`API error: ${response.status}`)
          throw new Error(`API error: ${response.status}`)
        }

        // Parse the response
        const data = await response.json()

        // Remove any temporary thinking messages
        setMessages((prev) => prev.filter((m) => !m.isTemporary))

        // Add AI response
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: data.message || "I'm sorry, I couldn't generate a response. Please try again.",
          sender: "ai",
          timestamp: new Date().toISOString(),
          role: "assistant",
          isFallback: data.fallback === true || !data.success,
        }

        setMessages((prev) => [...prev, aiMessage])
        setRetryCount(0) // Reset retry count on success
        retryCountRef.current = 0 // Also reset the ref
      } catch (fetchError) {
        console.error("Fetch error:", fetchError)

        // Remove any temporary thinking messages
        setMessages((prev) => prev.filter((m) => !m.isTemporary))

        if (fetchError.name === "AbortError") {
          // Instead of showing a timeout message, just keep the thinking message
          // and continue waiting for the response
          console.log("Request is taking longer than expected, continuing to wait...")

          // Try again with a longer timeout
          try {
            const longTimeoutController = new AbortController()
            // No timeout this time - let it run until completion

            console.log("Making a second attempt with longer timeout...")
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
              body: JSON.stringify({ messages: recentMessages }),
              signal: longTimeoutController.signal,
              cache: "no-store",
            })

            // Check response status
            if (!response.ok) {
              console.error(`API error on second attempt: ${response.status}`)
              throw new Error(`API error: ${response.status}`)
            }

            // Parse the response
            const data = await response.json()

            // Remove any temporary thinking messages
            setMessages((prev) => prev.filter((m) => !m.isTemporary))

            // Add AI response
            const aiMessage: Message = {
              id: Date.now() + 1,
              text: data.message || "I'm sorry, I couldn't generate a response. Please try again.",
              sender: "ai",
              timestamp: new Date().toISOString(),
              role: "assistant",
              isFallback: data.fallback === true || !data.success,
            }

            setMessages((prev) => [...prev, aiMessage])
            setRetryCount(0)
            retryCountRef.current = 0
          } catch (secondError) {
            console.error("Error on second attempt:", secondError)

            // Only now show a timeout message after the second attempt failed
            const timeoutMessage: Message = {
              id: Date.now() + 1,
              text: "I apologize for the delay. Our servers are experiencing high traffic. Please try again in a moment.",
              sender: "ai",
              timestamp: new Date().toISOString(),
              role: "assistant",
              isFallback: true,
            }
            setMessages((prev) => prev.filter((m) => !m.isTemporary).concat([timeoutMessage]))
          }
        } else {
          // For other errors, try to retry if we haven't exceeded max retries
          if (retryCountRef.current < maxRetries) {
            const retryMessage: Message = {
              id: Date.now() + 1,
              text: `I'm having a bit of trouble connecting. Let me try again (attempt ${retryCountRef.current + 1}/${maxRetries})...`,
              sender: "ai",
              timestamp: new Date().toISOString(),
              role: "assistant",
              isFallback: true,
            }
            setMessages((prev) => [...prev, retryMessage])

            // Increment retry count BEFORE scheduling the retry
            const newRetryCount = retryCountRef.current + 1
            retryCountRef.current = newRetryCount
            setRetryCount(newRetryCount)

            // Only retry if we haven't reached max retries
            if (newRetryCount < maxRetries) {
              // Wait a moment before retrying
              setTimeout(() => {
                setIsRetrying(false)
                if (lastUserMessage) {
                  handleSend(lastUserMessage, true) // Retry with the same user message
                }
              }, 2000) // Reduced wait time to 2 seconds
            } else {
              // We've reached max retries, show final error message with a contextual response
              setTimeout(() => {
                const contextualResponse = lastUserMessage
                  ? getContextualResponse(lastUserMessage)
                  : getRandomFallbackResponse()
                const finalErrorMessage: Message = {
                  id: Date.now() + 2,
                  text: contextualResponse,
                  sender: "ai",
                  timestamp: new Date().toISOString(),
                  role: "assistant",
                  isFallback: true,
                }
                setMessages((prev) => [...prev, finalErrorMessage])
                setIsRetrying(false)
              }, 1000)
            }
          } else {
            throw fetchError
          }
        }
      }
    } catch (err) {
      console.error("Unhandled error:", err)

      // Remove any temporary thinking messages
      setMessages((prev) => prev.filter((m) => !m.isTemporary))

      // Add an error message from the AI with a contextual response
      const contextualResponse = lastUserMessage ? getContextualResponse(lastUserMessage) : getRandomFallbackResponse()
      const aiErrorMessage: Message = {
        id: Date.now() + 1,
        text: contextualResponse,
        sender: "ai",
        timestamp: new Date().toISOString(),
        role: "assistant",
        isFallback: true,
      }
      setMessages((prev) => [...prev, aiErrorMessage])
    } finally {
      setIsTyping(false)
      if (isRetry) {
        setIsRetrying(false)
      }
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "Hello! I'm your HYPER NEUROX AI assistant. How can I help you relax today?",
        sender: "ai",
        timestamp: new Date().toISOString(),
        role: "assistant",
      },
    ])
    setError(null)
    setRetryCount(0)
    retryCountRef.current = 0
    setLastUserMessage(null)
    setIsRetrying(false)
  }

  return (
    <div className="flex flex-col h-[400px] sm:h-[500px] bg-[#0B1211] border border-[#9FFFE0]/30 rounded-lg backdrop-blur-sm">
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#9FFFE0]/30">
        <div className="flex items-center">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#9FFFE0] flex items-center justify-center mr-2 sm:mr-3">
            <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-[#0B1211]" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">HYPER NEUROX AI Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="text-[#9FFFE0] hover:text-white hover:bg-[#9FFFE0]/10 h-7 w-7 p-0"
        >
          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                message.sender === "user"
                  ? "bg-[#9FFFE0] text-[#0B1211]"
                  : message.isFallback
                    ? "bg-[#9FFFE0]/10 text-[#9FFFE0] border border-[#9FFFE0]/30"
                    : message.isTemporary
                      ? "bg-[#0B1211] text-[#9FFFE0] border border-[#9FFFE0]/30"
                      : "bg-[#0B1211] text-white border border-[#9FFFE0]/30"
              }`}
            >
              <div className="flex items-center mb-1">
                {message.sender === "ai" ? (
                  message.isFallback ? (
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-[#9FFFE0]" />
                  ) : (
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-[#9FFFE0]" />
                  )
                ) : (
                  <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-[#0B1211]" />
                )}
                <span className="text-[10px] sm:text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
              <p className="text-xs sm:text-sm">
                {message.isTemporary ? (
                  <span className="flex items-center">
                    {message.text}
                    <span className="ml-2 inline-flex">
                      <span className="animate-bounce mx-0.5 h-1 w-1 bg-[#9FFFE0] rounded-full"></span>
                      <span
                        className="animate-bounce mx-0.5 h-1 w-1 bg-[#9FFFE0] rounded-full"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                      <span
                        className="animate-bounce mx-0.5 h-1 w-1 bg-[#9FFFE0] rounded-full"
                        style={{ animationDelay: "0.4s" }}
                      ></span>
                    </span>
                  </span>
                ) : (
                  message.text
                )}
              </p>
            </div>
          </div>
        ))}

        {isTyping && !messages.some((m) => m.isTemporary) && (
          <div className="flex justify-start">
            <div className="bg-[#0B1211] text-white rounded-lg p-2 sm:p-3 max-w-[85%] sm:max-w-[80%] border border-[#9FFFE0]/30">
              <div className="flex items-center mb-1">
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-[#9FFFE0]" />
                <span className="text-[10px] sm:text-xs opacity-70">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
              <div className="flex space-x-1">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#9FFFE0] rounded-full animate-bounce"></div>
                <div
                  className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#9FFFE0] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#9FFFE0] rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-4 border-t border-[#9FFFE0]/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about crypto, relaxation, or AI..."
            className="bg-[#0B1211] border-[#9FFFE0]/30 text-white text-xs sm:text-sm focus:border-[#9FFFE0] focus:ring-[#9FFFE0]/20"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="bg-[#9FFFE0] hover:bg-[#9FFFE0]/90 text-[#0B1211] h-9 w-9 p-0 flex-shrink-0"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

