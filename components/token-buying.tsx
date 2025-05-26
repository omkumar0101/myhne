"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, ExternalLink, AlertCircle, Smartphone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConnectWalletButton } from "./ConnectWalletButton"
import { NETWORK } from "@/constants/network"
import { useWallet } from "@/contexts/wallet-context"

export default function TokenBuying() {
  const { walletAddress, isWrongNetwork } = useWallet()
  const [copied, setCopied] = useState(false)
  const [isAddingToken, setIsAddingToken] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isMetaMaskBrowser, setIsMetaMaskBrowser] = useState(false)

  // Token details
  const tokenAddress = "0x0000000000000000000000000000000000000000" // Replace with actual NEUROX token address
  const tokenSymbol = "NEUROX"
  const tokenDecimals = 18
  const tokenImage = "https://neurox.io/token-logo.png" // Replace with actual token logo URL

  // Check if on mobile device and if we're in MetaMask browser
  useEffect(() => {
    const checkEnvironment = () => {
      // Check if mobile
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)
      setIsMobile(isMobileDevice)

      // Check if we're in MetaMask browser
      const isMMBrowser = window.ethereum?.isMetaMask && isMobileDevice && /MetaMask\//.test(userAgent)
      setIsMetaMaskBrowser(!!isMMBrowser)
    }
    checkEnvironment()
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const addTokenToWallet = async () => {
    setError(null)
    setSuccess(null)

    if (!window.ethereum || !window.ethereum.isMetaMask) {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    if (!walletAddress) {
      setError("Please connect your wallet first.")
      return
    }

    if (isWrongNetwork) {
      setError(`Please switch to ${NETWORK.NAME} network first.`)
      return
    }

    try {
      setIsAddingToken(true)

      // Request to add the BEP20 token to MetaMask
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // MetaMask uses ERC20 for all token standards including BEP20
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      })

      if (wasAdded) {
        setSuccess(`$${tokenSymbol} BEP20 token was successfully added to your wallet!`)
      } else {
        // Simple message
        setError("Please add the token to your wallet to continue.")
      }
    } catch (err: any) {
      // Simple message
      setError("Please add the token to your wallet to continue.")
    } finally {
      setIsAddingToken(false)
    }
  }

  const buyToken = async () => {
    setError(null)
    setSuccess(null)

    if (!window.ethereum || !window.ethereum.isMetaMask) {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    if (!walletAddress) {
      setError("Please connect your wallet first.")
      return
    }

    if (isWrongNetwork) {
      setError(`Please switch to ${NETWORK.NAME} network first.`)
      return
    }

    // Open MetaMask to send ETH to the token contract
    try {
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: tokenAddress,
            value: "0x" + (0.01 * 1e18).toString(16), // 0.01 BNB in hex
            // You can add data field for specific contract interactions if needed
          },
        ],
      })

      setSuccess("Transaction initiated! Check MetaMask for details.")
    } catch (err: any) {
      // Simple message
      setError("Please confirm the transaction in MetaMask to buy tokens.")
    }
  }

  return (
    <div className="w-full">
      <Card className="bg-[#0B1211]/60 border-[#9FFFE0]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-[#9FFFE0] mb-2">Add $NEUROX to Your Wallet</h3>
            <p className="text-sm sm:text-base text-[#9FFFE0]/70">
              Connect your MetaMask wallet to buy $NEUROX tokens directly on {NETWORK.NAME}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-900/30 border-green-800/50">
              <Check className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">{success}</AlertDescription>
            </Alert>
          )}

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

          <div className="space-y-4">
            {!walletAddress ? (
              <>
                <ConnectWalletButton />

                {isMobile && !isMetaMaskBrowser && (
                  <div className="mt-4 p-3 bg-blue-900/20 rounded-md">
                    <p className="text-sm text-blue-300 mb-2 flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      <strong>Mobile User?</strong> Follow these steps:
                    </p>
                    <ol className="text-xs text-blue-200 list-decimal pl-5 mb-3 space-y-1">
                      <li>Open the MetaMask app</li>
                      <li>Tap on the browser icon at the bottom</li>
                      <li>Enter this website URL in the browser</li>
                      <li>Then connect your wallet</li>
                    </ol>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-500 text-blue-400 hover:bg-blue-950 mt-2"
                      onClick={() => {
                        // Open MetaMask app
                        window.location.href = "https://metamask.app.link/"
                      }}
                    >
                      Open MetaMask App
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="p-2 sm:p-3 bg-[#0B1211]/80 rounded-md text-center">
                  <p className="text-xs sm:text-sm text-[#9FFFE0]/70 mb-1">Connected Wallet</p>
                  <p className="text-[#9FFFE0] text-sm sm:text-base font-medium truncate">{walletAddress}</p>
                  <p className="text-xs text-[#9FFFE0]/70 mt-1">
                    Network:{" "}
                    {!isWrongNetwork ? (
                      <span className="text-green-400">{NETWORK.NAME}</span>
                    ) : (
                      <span className="text-red-400">Wrong Network</span>
                    )}
                  </p>
                </div>

                {isWrongNetwork ? (
                  <div className="text-center">
                    <p className="text-amber-400 text-sm mb-2">
                      Please switch to {NETWORK.NAME} to buy or add NEUROX tokens
                    </p>
                    <ConnectWalletButton />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      className="w-full bg-gradient-to-r from-[#9FFFE0] to-[#7FFFD0] hover:from-[#7FFFD0] hover:to-[#9FFFE0] text-[#0B1211] font-bold"
                      onClick={buyToken}
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Buy $NEUROX
                    </Button>

                    <Button
                      className="w-full bg-[#0B1211]/80 hover:bg-[#0B1211]/60 text-[#9FFFE0] font-bold border border-[#9FFFE0]/30"
                      onClick={addTokenToWallet}
                      disabled={isAddingToken}
                    >
                      {isAddingToken ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-[#9FFFE0] border-t-transparent rounded-full" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <svg
                            className="mr-2 h-5 w-5"
                            viewBox="0 0 35 33"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M17.5 0L32.0574 25.5H2.94263L17.5 0Z" fill="#E17726" />
                          </svg>
                          Add to MetaMask
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-6 p-2 sm:p-3 bg-[#0B1211]/30 border border-[#9FFFE0]/30 rounded-md">
            <h4 className="font-medium text-[#9FFFE0] mb-1 sm:mb-2 text-sm sm:text-base">Important Notice</h4>
            <p className="text-xs sm:text-sm text-[#9FFFE0]/70">
              Always verify the contract address from official sources. Be cautious of scams and fake tokens with
              similar names.
            </p>
            <p className="text-xs sm:text-sm text-[#9FFFE0]/70 mt-2">
              NEUROX is deployed as a token on {NETWORK.NAME} (Chain ID: {NETWORK.CHAIN_ID_DECIMAL}).
            </p>
          </div>

          {typeof window !== "undefined" && !window.ethereum && !isMobile && (
            <div className="mt-4 text-center">
              <p className="text-sm text-[#9FFFE0]/70 mb-2">MetaMask not detected</p>
              <Button
                variant="outline"
                size="sm"
                className="border-[#9FFFE0] text-[#9FFFE0] hover:bg-[#0B1211]"
                onClick={() => window.open("https://metamask.io/download/", "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Install MetaMask
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

