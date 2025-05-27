"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, ExternalLink } from "lucide-react"

export default function TokenBuying() {
  const [copied, setCopied] = useState(false)

  // Token details
  const tokenAddress = "0x160d58d26ca6036e5c2c4e8daa1a5758e7116396"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const buyToken = () => {
    // Open external link for buying tokens
    window.open("https://dev.liquidlaunch.app/token/0x160d58d26ca6036e5c2c4e8daa1a5758e7116396", "_blank")
  }

  return (
    <div className="w-full">
      <Card className="bg-[#0B1211]/60 border-[#9FFFE0]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-2 sm:p-3 bg-[#0B1211]/80 rounded-md mb-6 overflow-x-auto">
            <code className="text-[#9FFFE0] text-xs sm:text-sm whitespace-nowrap">{tokenAddress}</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="text-[#9FFFE0] hover:text-white hover:bg-[#9FFFE0]/10 ml-2 flex-shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="text-center">
            <Button
              className="w-full bg-gradient-to-r from-[#9FFFE0] to-[#7FFFD0] hover:from-[#7FFFD0] hover:to-[#9FFFE0] text-[#0B1211] font-bold"
              onClick={buyToken}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Buy $NEUROX
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

