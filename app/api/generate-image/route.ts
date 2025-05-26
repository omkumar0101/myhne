import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Check if API key is configured
    if (!process.env.NEBIUS_API_KEY) {
      console.error("NEBIUS_API_KEY environment variable is not set")
      return NextResponse.json(
        { error: "Image generation service is not configured. Please contact the administrator." },
        { status: 500 },
      )
    }

    try {
      // Direct fetch to Nebius API
      const response = await fetch("https://api.studio.nebius.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEBIUS_API_KEY}`,
        },
        body: JSON.stringify({
          model: "black-forest-labs/flux-dev",
          response_format: "b64_json",
          prompt: prompt,
          width: 1024,
          height: 1024,
          num_inference_steps: 28,
          negative_prompt: "",
          seed: -1,
        }),
      })

      // Check if the response is ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Nebius API error:", response.status, errorText)
        return NextResponse.json(
          { error: `API error: ${response.status}`, details: errorText.substring(0, 500) },
          { status: response.status },
        )
      }

      // Parse the response
      const data = await response.json()

      // Check if we have the expected data
      if (!data.data || !data.data[0] || !data.data[0].b64_json) {
        console.error("Invalid response format:", data)
        return NextResponse.json({ error: "Invalid response format from API" }, { status: 500 })
      }

      // Return the base64 encoded image
      return NextResponse.json({
        success: true,
        image: data.data[0].b64_json,
      })
    } catch (fetchError) {
      console.error("Fetch error:", fetchError)
      return NextResponse.json(
        { error: "Failed to connect to image generation service. Please try again later." },
        { status: 503 },
      )
    }
  } catch (error: any) {
    console.error("General error in image generation route:", error)
    return NextResponse.json({ error: error.message || "Failed to generate image" }, { status: 500 })
  }
}

