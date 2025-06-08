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
  hello: "Hello! I'm your HYPER NEUROX AI assistant. How can I help you relax today?",
  hi: "Hi there! How can I assist you with crypto or relaxation today?",
  "how are you": "I'm functioning well, thank you! How can I help you today?",
  "what is neurox":
    "HYPER NEUROX is a platform that combines AI with mental wellness for crypto enthusiasts, offering tools to manage stress from market volatility while enjoying AI-powered creative experiences.",
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

// Nebius API configuration
const NEBIUS_API_KEY = "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDExNDgwMDE2MTczODc2Mjk5ODk3MyIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTkwNTk1ODYxNSwidXVpZCI6ImQxN2QyNGUxLTU4MGQtNDIyOC04NDJkLTU0MWZjOWQ0ZjI5YyIsIm5hbWUiOiJjaGF0IiwiZXhwaXJlc19hdCI6IjIwMzAtMDUtMjVUMTY6NTY6NTUrMDAwMCJ9.bVFOx3wQbCbDlMFK74bIkdYno7u5rkIEW0x0xUDWLGY"
const NEBIUS_BASE_URL = "https://api.studio.nebius.com/v1/"

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
      content: [
        {
          type: "text",
          text: String(msg.content)
        }
      ]
    }))

    // Add system message for context
    sanitizedMessages.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: "You are HYPER NEUROX AI, a helpful assistant specialized in crypto and relaxation. Keep responses brief, helpful, and focused on providing mental wellness tips for crypto traders and enthusiasts. Your goal is to help users manage stress and anxiety related to cryptocurrency market volatility."
        }
      ]
    })

    try {
      console.log("Preparing to send request to Nebius API")

      // Use direct fetch with a timeout for production
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        console.log("Request to Nebius API timed out after 60 seconds")
      }, 60000) // 60 second timeout

      console.log("Sending request to Nebius API")
      const response = await fetch(`${NEBIUS_BASE_URL}chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NEBIUS_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
          max_tokens: 512,
          temperature: 0.6,
          top_p: 0.9,
          top_k: 50,
          messages: sanitizedMessages,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      console.log(`Nebius API response status: ${response.status}`)

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
      console.log("Successfully received and parsed response from Nebius API")

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

      // Extract the message content
      let messageContent = ""
      if (data.choices[0].message.content) {
        if (Array.isArray(data.choices[0].message.content)) {
          // Handle array format
          messageContent = data.choices[0].message.content
            .filter(item => item.type === "text")
            .map(item => item.text)
            .join("")
        } else {
          // Handle string format
          messageContent = data.choices[0].message.content
        }
      }

      // Clean up the message content
      const cleanedMessage = messageContent.replace(
        /<[Tt]hink(?:ing)?>[\s\S]*?<\/[Tt]hink(?:ing)?>/g,
        "",
      ).trim()

      console.log("Returning successful response to client")
      return safeJsonResponse({
        success: true,
        message: cleanedMessage || "I'm here to help! How can I assist you today?",
      })
    } catch (apiError: any) {
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

