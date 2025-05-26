import { NextResponse } from "next/server"

// Helper function to ensure we always return a valid JSON response
function safeJsonResponse(data: any, status = 200) {
  try {
    return NextResponse.json(data, { status })
  } catch (error) {
    console.error("Error creating JSON response:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
        fallback: true,
      },
      { status: 500 },
    )
  }
}

// Common responses for faster replies to frequent questions
const QUICK_RESPONSES = {
  hello: "Hello! I'm your NEUROX AI assistant. How can I help you relax today?",
  hi: "Hi there! How can I assist you with crypto or relaxation today?",
  "how are you": "I'm functioning well, thank you! How can I help you today?",
  "what is neurox":
    "NEUROX is a platform that combines AI with mental wellness for crypto enthusiasts, offering tools to manage stress from market volatility while enjoying AI-powered creative experiences.",
  "what can you do":
    "I can help you generate AI images, provide relaxation tips, discuss crypto topics, and offer a friendly conversation to help you unwind.",
  help: "I can assist with generating images, provide relaxation techniques, discuss crypto topics, or just chat. What would you like to know about?",
  relax:
    "Try this simple breathing exercise: breathe in for 4 seconds, hold for 7 seconds, then exhale for 8 seconds. Repeat this a few times to help calm your mind.",
  stress:
    "When feeling stressed about crypto markets, try stepping away from charts for a while, practicing mindfulness, or engaging in a hobby you enjoy.",
}

// Fallback responses when the API is unavailable
const FALLBACK_RESPONSES = [
  "I'm having trouble connecting to my knowledge base right now. In the meantime, remember that taking regular breaks from crypto charts can help reduce stress.",
  "My connection seems unstable at the moment. While I work on that, try this relaxation tip: practice deep breathing for 5 minutes to clear your mind.",
  "I'm experiencing some technical difficulties. While I sort this out, remember that diversification is key to reducing anxiety in volatile markets.",
  "I seem to be having connection issues. A good practice during market volatility is to focus on your long-term strategy rather than short-term fluctuations.",
  "I'm having trouble processing your request right now. In the meantime, consider setting up price alerts instead of constantly checking charts.",
  "My systems are a bit overloaded. While I'm working on it, remember that physical exercise is one of the best ways to reduce crypto-related stress.",
  "I'm having difficulty accessing my full capabilities right now. Try the breathing exercise in our mini-games section for immediate stress relief.",
  "I'm experiencing some delays in my responses. While I'm sorting this out, why not try generating some relaxing AI images with our image generator?",
]

// OpenRouter API key
const OPENROUTER_API_KEY = "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"

export async function POST(request: Request) {
  try {
    // Parse the request body
    let messages
    try {
      const body = await request.json()
      messages = body.messages
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return safeJsonResponse(
        {
          success: false,
          message: "I couldn't understand your request. Please try again.",
          fallback: true,
        },
        400,
      )
    }

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("Invalid messages format:", messages)
      return safeJsonResponse(
        {
          success: false,
          message: "I need a message to respond to. Could you try asking me something?",
          fallback: true,
        },
        400,
      )
    }

    // Get the last user message
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()

    // Check for quick responses to common questions
    if (lastUserMessage) {
      const userText = lastUserMessage.content.toLowerCase().trim()

      // Check if we have a quick response for this message
      for (const [key, response] of Object.entries(QUICK_RESPONSES)) {
        if (userText.includes(key)) {
          console.log(`Quick response matched for key: ${key}`)
          return safeJsonResponse({
            success: true,
            message: response,
          })
        }
      }
    }

    // Sanitize and validate messages - only send the last few messages to reduce token count
    const sanitizedMessages = messages.slice(-5).map((msg) => ({
      role: String(msg.role),
      content: String(msg.content),
    }))

    // Add system message for context
    sanitizedMessages.unshift({
      role: "system",
      content:
        "You are NEUROX AI, a helpful assistant specialized in crypto and relaxation. Keep responses brief, helpful, and focused on providing mental wellness tips for crypto traders and enthusiasts. Your goal is to help users manage stress and anxiety related to cryptocurrency market volatility.",
    })

    try {
      console.log("Preparing to send request to OpenRouter API")

      // Use direct fetch with a timeout for production
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        console.log("Request to OpenRouter API timed out after 60 seconds")
      }, 60000) // 60 second timeout

      console.log("Sending request to OpenRouter API")
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://neurox.io", // Replace with your actual site URL
          "X-Title": "NEUROX AI Assistant", // Replace with your actual site name
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: sanitizedMessages,
          max_tokens: 256, // Limit response length for faster responses
          temperature: 0.7,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      console.log(`OpenRouter API response status: ${response.status}`)

      // Check if the response is ok
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`)

        // Try to get more error details
        let errorDetails = ""
        try {
          const errorText = await response.text()
          errorDetails = errorText.substring(0, 200)
          console.error("Error response:", errorDetails)
        } catch (e) {
          console.error("Could not read error response")
        }

        // Return a random fallback response
        const fallbackResponse = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
        return safeJsonResponse({
          success: false,
          message: fallbackResponse,
          fallback: true,
          debug: `Status: ${response.status}, Details: ${errorDetails}`,
        })
      }

      // Parse the response
      const data = await response.json()
      console.log("Successfully received and parsed response from OpenRouter API")

      // Check if we have the expected data structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected API response format:", data)
        // Return a random fallback response
        const fallbackResponse = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
        return safeJsonResponse({
          success: false,
          message: fallbackResponse,
          fallback: true,
        })
      }

      // Return the successful response
      const cleanedMessage = data.choices[0].message.content.replace(
        /<[Tt]hink(?:ing)?>[\s\S]*?<\/[Tt]hink(?:ing)?>/g,
        "",
      )
      console.log("Returning successful response to client")
      return safeJsonResponse({
        success: true,
        message: cleanedMessage,
      })
    } catch (apiError) {
      console.error("API error:", apiError)

      // If it's an abort error (timeout), return a specific message
      if (apiError.name === "AbortError") {
        console.log("Request aborted due to timeout")
        // Return a random fallback response
        const fallbackResponse = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
        return safeJsonResponse({
          success: false,
          message: fallbackResponse,
          fallback: true,
        })
      }

      // Return a random fallback response
      const fallbackResponse = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
      return safeJsonResponse({
        success: false,
        message: fallbackResponse,
        fallback: true,
        error: apiError.message,
      })
    }
  } catch (error) {
    console.error("Unhandled error in chat route:", error)
    // Return a random fallback response
    const fallbackResponse = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
    return safeJsonResponse({
      success: false,
      message: fallbackResponse,
      fallback: true,
    })
  }
}

