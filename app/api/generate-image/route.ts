import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Use the provided API key directly
    const NEBIUS_API_KEY = "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDExNDgwMDE2MTczODc2Mjk5ODk3MyIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTkwNTk1ODE1MywidXVpZCI6IjY1ZmFjMWI1LWRhNGQtNDdmZi05NWZiLTg0NTM5NGQzNzRkNSIsIm5hbWUiOiJVbm5hbWVkIGtleSIsImV4cGlyZXNfYXQiOiIyMDMwLTA1LTI1VDE2OjQ5OjEzKzAwMDAifQ.WZYPmsk-pZQGhkMxwkVhzzipeorPQ-0uW22ut6uUow0"

    try {
      // Use the exact configuration provided by the user
      const response = await fetch("https://api.studio.nebius.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NEBIUS_API_KEY}`,
        },
        body: JSON.stringify({
          model: "black-forest-labs/flux-schnell",
          response_format: "b64_json",
          response_extension: "png",
          width: 1024,
          height: 1024,
          num_inference_steps: 4,
          negative_prompt: "",
          seed: -1,
          prompt: prompt,
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

