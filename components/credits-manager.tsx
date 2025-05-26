"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, Plus, AlertCircle, Check, Smartphone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectWalletButton } from "./ConnectWalletButton"
import { NETWORK } from "@/constants/network"
import { useWallet } from "@/contexts/wallet-context"

// Update the token address and add ABI constants at the top of the file, after the imports
const NRX_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000" // Replace with actual NEUROX BEP20 token contract address
const CREDIT_MANAGER_ADDRESS = "0x0000000000000000000000000000000000000000" // Replace with your credit manager contract address
const ANONYMOUS_USER_KEY = "anonymousUserCredits"

export interface UserCredits {
  address: string
  credits: number
  lastUpdated: number
}

interface CreditsManagerProps {
  onCreditsChange?: (credits: number) => void
}

export default function CreditsManager({ onCreditsChange }: CreditsManagerProps) {
  const { walletAddress, isWrongNetwork } = useWallet()
  const [credits, setCredits] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [purchaseAmount, setPurchaseAmount] = useState<number>(10)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isBuyingNRX, setIsBuyingNRX] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMetaMaskBrowser, setIsMetaMaskBrowser] = useState(false)
  const [needsWallet, setNeedsWallet] = useState(false)

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

  // Load credits on component mount - either from wallet or anonymous
  useEffect(() => {
    if (walletAddress) {
      loadUserCredits(walletAddress)
    } else {
      loadAnonymousCredits()
    }
  }, [walletAddress])

  // Listen for wallet connection/disconnection events
  useEffect(() => {
    const handleWalletDisconnected = () => {
      loadAnonymousCredits()
    }

    const handleWalletConnected = (e: CustomEvent) => {
      if (e.detail) {
        loadUserCredits(e.detail)
      }
    }

    window.addEventListener("walletDisconnected", handleWalletDisconnected as EventListener)
    window.addEventListener("walletConnected", handleWalletConnected as EventListener)

    return () => {
      window.removeEventListener("walletDisconnected", handleWalletDisconnected as EventListener)
      window.removeEventListener("walletConnected", handleWalletConnected as EventListener)
    }
  }, [])

  // Load anonymous user credits from localStorage
  const loadAnonymousCredits = () => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      const anonymousCredits = localStorage.getItem(ANONYMOUS_USER_KEY)

      if (anonymousCredits) {
        const parsedCredits = JSON.parse(anonymousCredits)
        setCredits(parsedCredits.credits)
        if (onCreditsChange) onCreditsChange(parsedCredits.credits)

        // Check if user needs to connect wallet (credits <= 0)
        setNeedsWallet(parsedCredits.credits <= 0)
        return
      }

      // If no credits found, give 10 free credits
      setCredits(10)
      saveAnonymousCredits(10)
      if (onCreditsChange) onCreditsChange(10)
      setNeedsWallet(false)
    } catch (error) {
      console.error("Error loading anonymous credits:", error)
      // Default to 10 free credits if there's an error
      setCredits(10)
      if (onCreditsChange) onCreditsChange(10)
      setNeedsWallet(false)
    }
  }

  // Save anonymous user credits to localStorage
  const saveAnonymousCredits = (newCredits: number) => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(
        ANONYMOUS_USER_KEY,
        JSON.stringify({
          credits: newCredits,
          lastUpdated: Date.now(),
        }),
      )

      // Check if user needs to connect wallet (credits <= 0)
      setNeedsWallet(newCredits <= 0)
    } catch (error) {
      console.error("Error saving anonymous credits:", error)
    }
  }

  // Load user credits from localStorage
  const loadUserCredits = (address: string) => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      const storedCreditsData = localStorage.getItem("userCredits")

      if (storedCreditsData) {
        const allUserCredits: UserCredits[] = JSON.parse(storedCreditsData)
        const userCredits = allUserCredits.find((user) => user.address.toLowerCase() === address.toLowerCase())

        if (userCredits) {
          setCredits(userCredits.credits)
          if (onCreditsChange) onCreditsChange(userCredits.credits)
          return
        }
      }

      // If no credits found or no stored data, give 10 free credits to new user
      setCredits(10)
      saveUserCredits(address, 10)
      if (onCreditsChange) onCreditsChange(10)
    } catch (error) {
      console.error("Error loading user credits:", error)
      // Default to 10 free credits if there's an error
      setCredits(10)
      if (onCreditsChange) onCreditsChange(10)
    }
  }

  // Save user credits to localStorage
  const saveUserCredits = (address: string, newCredits: number) => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      const storedCreditsData = localStorage.getItem("userCredits")
      let allUserCredits: UserCredits[] = []

      if (storedCreditsData) {
        allUserCredits = JSON.parse(storedCreditsData)
        // Find and update existing user
        const existingUserIndex = allUserCredits.findIndex(
          (user) => user.address.toLowerCase() === address.toLowerCase(),
        )

        if (existingUserIndex >= 0) {
          allUserCredits[existingUserIndex] = {
            address,
            credits: newCredits,
            lastUpdated: Date.now(),
          }
        } else {
          // Add new user
          allUserCredits.push({
            address,
            credits: newCredits,
            lastUpdated: Date.now(),
          })
        }
      } else {
        // Create new credits data
        allUserCredits = [
          {
            address,
            credits: newCredits,
            lastUpdated: Date.now(),
          },
        ]
      }

      localStorage.setItem("userCredits", JSON.stringify(allUserCredits))
    } catch (error) {
      console.error("Error saving user credits:", error)
    }
  }

  // Use a credit
  const useCredit = () => {
    if (credits > 0) {
      const newCredits = credits - 1
      setCredits(newCredits)

      if (walletAddress) {
        saveUserCredits(walletAddress, newCredits)
      } else {
        saveAnonymousCredits(newCredits)
      }

      if (onCreditsChange) onCreditsChange(newCredits)
      return true
    }
    return false
  }

  // Add credits
  const addCredits = (amount: number) => {
    const newCredits = credits + amount
    setCredits(newCredits)

    if (walletAddress) {
      saveUserCredits(walletAddress, newCredits)
    } else {
      saveAnonymousCredits(newCredits)
    }

    if (onCreditsChange) onCreditsChange(newCredits)
  }

  // Purchase credits with NEUROX BEP20 tokens
  const purchaseCredits = async () => {
    setError(null)
    setSuccess(null)

    if (!walletAddress) {
      setError("Please connect your wallet first.")
      return
    }

    if (isWrongNetwork) {
      setError(`Please switch to ${NETWORK.NAME} network first.`)
      return
    }

    if (purchaseAmount <= 0) {
      setError("Please enter a valid amount of credits to purchase.")
      return
    }

    try {
      setIsPurchasing(true)

      // Calculate total cost in NEUROX tokens
      const totalCost = purchaseAmount * 0.01 // creditPrice

      // Convert to wei (assuming 18 decimals for the token)
      const totalCostWei = BigInt(Math.floor(totalCost * 10 ** 18)).toString(16)

      // For BEP20 tokens, we need to call the token's transfer function
      // First, request approval for the token transfer
      const approvalTx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: NRX_TOKEN_ADDRESS,
            // This is the encoded function call for approve(address,uint256)
            // Function signature: approve(address spender, uint256 amount)
            data: `0x095ea7b3${CREDIT_MANAGER_ADDRESS.slice(2).padStart(64, "0")}${totalCostWei.padStart(64, "0")}`,
            gas: "0x30D40", // Gas limit
          },
        ],
      })

      console.log("Approval transaction sent:", approvalTx)
      setSuccess("Approval transaction sent! Please confirm the credit purchase transaction next.")

      // Wait a moment for the approval to be processed
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Now execute the purchase transaction
      const purchaseTx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: CREDIT_MANAGER_ADDRESS,
            // This is the encoded function call for purchaseCredits(uint256)
            // Function signature: purchaseCredits(uint256 amount)
            data: `0x8f7177ae${purchaseAmount.toString(16).padStart(64, "0")}`,
            gas: "0x30D40", // Gas limit
          },
        ],
      })

      console.log("Purchase transaction sent:", purchaseTx)

      // For demo purposes, we'll add the credits immediately
      // In a production environment, you would listen for events from the contract
      addCredits(purchaseAmount)
      setSuccess(`Successfully purchased ${purchaseAmount} credits!`)
      setIsDialogOpen(false)
    } catch (err: any) {
      console.error("Error purchasing credits:", err)
      if (err.code === 4001) {
        // User rejected the transaction
        setError("Transaction was rejected. Please try again.")
      } else {
        setError(err.message || "Transaction failed. Please try again.")
      }
    } finally {
      setIsPurchasing(false)
    }
  }

  // Add a new function to buy NRX tokens directly
  const buyNRXTokens = async () => {
    setError(null)
    setSuccess(null)

    if (!walletAddress) {
      setError("Please connect your wallet first.")
      return
    }

    if (isWrongNetwork) {
      setError(`Please switch to ${NETWORK.NAME} network first.`)
      return
    }

    try {
      setIsBuyingNRX(true)

      // Open MetaMask to send ETH to a DEX or token sale contract
      // For ETH, this could be Uniswap or another ETH DEX
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: "0x0000000000000000000000000000000000000000", // Replace with actual DEX or token sale contract
            value: "0x" + (0.01 * 1e18).toString(16), // 0.01 ETH in hex
            gas: "0x30D40", // Gas limit
          },
        ],
      })

      setSuccess("NRX token purchase initiated! Check your wallet for tokens.")
    } catch (error) {
      // Don't log the error to console to avoid showing technical details
      // Just set a user-friendly error message
      setError("Failed to purchase NRX tokens. Please try again.")
    } finally {
      setIsBuyingNRX(false)
    }
  }

  return (
    <Card className="bg-[#0B1211]/60 border-[#9FFFE0]/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-[#9FFFE0]">Image Generation Credits</CardTitle>
        <CardDescription className="text-[#9FFFE0]/70">Generate AI images using your credits</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-[#0B1211]/30 border-[#9FFFE0]/30">
            <Check className="h-4 w-4 text-[#9FFFE0]" />
            <AlertDescription className="text-[#9FFFE0]/70">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0B1211]/80 rounded-lg">
            <div>
              <p className="text-sm text-[#9FFFE0]/70">Available Credits</p>
              <p className="text-2xl font-bold text-[#9FFFE0]">{credits}</p>
            </div>

            {!walletAddress && credits <= 0 ? (
              <ConnectWalletButton />
            ) : (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#9FFFE0] hover:bg-[#9FFFE0]/90"
                    onClick={() => {
                      if (!walletAddress && credits <= 0) {
                        return
                      }
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {walletAddress ? "Buy Credits" : credits > 0 ? `${credits} Free Credits Left` : "Connect Wallet"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0B1211] border-[#9FFFE0] text-white">
                  <DialogHeader>
                    <DialogTitle className="text-[#9FFFE0]">Purchase Image Generation Credits</DialogTitle>
                    <DialogDescription className="text-[#9FFFE0]/70">
                      Buy credits using NEUROX BEP20 tokens to generate more AI images
                    </DialogDescription>
                  </DialogHeader>

                  {isWrongNetwork && walletAddress ? (
                    <div className="py-4">
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please switch to {NETWORK.NAME} network to purchase credits.
                        </AlertDescription>
                      </Alert>
                      <ConnectWalletButton />
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="credits">Number of Credits</Label>
                        <Input
                          id="credits"
                          type="number"
                          min="1"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(Number.parseInt(e.target.value) || 0)}
                          className="bg-[#0B1211] border-[#9FFFE0] text-white"
                        />
                      </div>

                      <div className="p-3 bg-[#0B1211]/80 rounded-md">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#9FFFE0]/70">Price per credit:</span>
                          <span className="text-[#9FFFE0]">0.01 NRX</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span className="text-[#9FFFE0]/70">Total cost:</span>
                          <span className="text-[#9FFFE0]">{(purchaseAmount * 0.01).toFixed(2)} NRX</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#0B1211]/20 rounded-md">
                        <p className="text-sm text-[#9FFFE0]/70 mb-2">
                          <strong>Need NRX tokens?</strong> You can buy them directly with ETH:
                        </p>
                        <Button
                          onClick={buyNRXTokens}
                          className="w-full bg-[#9FFFE0] hover:bg-[#9FFFE0]/90"
                          disabled={isBuyingNRX}
                        >
                          {isBuyingNRX ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-[#9FFFE0] border-t-transparent rounded-full" />
                              Processing...
                            </>
                          ) : (
                            "Buy NRX Tokens"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="border-[#9FFFE0]/30 text-[#9FFFE0] hover:bg-[#0B1211]"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={purchaseCredits}
                      disabled={isPurchasing || purchaseAmount <= 0 || !walletAddress || isWrongNetwork}
                      className="bg-gradient-to-r from-[#9FFFE0] to-[#9FFFE0]/90 hover:from-[#9FFFE0]/90 hover:to-[#9FFFE0]"
                    >
                      {isPurchasing ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-[#9FFFE0] border-t-transparent rounded-full" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Purchase Credits
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {walletAddress ? (
            <div className="flex items-center justify-between text-xs text-[#9FFFE0]/70 px-1">
              <span>
                Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
              <span>
                Network:{" "}
                {!isWrongNetwork ? (
                  <span className="text-[#9FFFE0]">{NETWORK.NAME}</span>
                ) : (
                  <span className="text-[#9FFFE0]">Wrong Network</span>
                )}
              </span>
            </div>
          ) : (
            <div className="text-xs text-[#9FFFE0]/70 text-center px-1">
              {credits > 0 ? (
                <span>You have {credits} free credits. Connect wallet to buy more when they run out.</span>
              ) : (
                <span>Connect your wallet to purchase more credits.</span>
              )}
            </div>
          )}

          {isMobile && !isMetaMaskBrowser && !walletAddress && (
            <div className="mt-4 p-3 bg-[#0B1211]/20 rounded-md">
              <p className="text-sm text-[#9FFFE0]/70 mb-2 flex items-center">
                <Smartphone className="h-4 w-4 mr-2" />
                <strong>Mobile User?</strong> Follow these steps:
              </p>
              <ol className="text-xs text-[#9FFFE0]/70 list-decimal pl-5 mb-3 space-y-1">
                <li>Open the MetaMask app</li>
                <li>Tap on the browser icon at the bottom</li>
                <li>Enter this website URL in the browser</li>
                <li>Then connect your wallet</li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[#9FFFE0] text-[#9FFFE0] hover:bg-[#0B1211]"
                onClick={() => {
                  // Open MetaMask app
                  window.location.href = "https://metamask.app.link/"
                }}
              >
                Open MetaMask App
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Export the useCredit function for external use
export function useImageCredits() {
  const { walletAddress } = useWallet()
  const [credits, setCredits] = useState<number>(0)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    if (walletAddress) {
      loadUserCredits(walletAddress)
    } else {
      loadAnonymousCredits()
    }
  }, [walletAddress])

  // Listen for wallet connection/disconnection events
  useEffect(() => {
    const handleWalletDisconnected = () => {
      loadAnonymousCredits()
    }

    const handleWalletConnected = (e: CustomEvent) => {
      if (e.detail) {
        loadUserCredits(e.detail)
      }
    }

    window.addEventListener("walletDisconnected", handleWalletDisconnected as EventListener)
    window.addEventListener("walletConnected", handleWalletConnected as EventListener)

    return () => {
      window.removeEventListener("walletDisconnected", handleWalletDisconnected as EventListener)
      window.removeEventListener("walletConnected", handleWalletConnected as EventListener)
    }
  }, [])

  const loadAnonymousCredits = () => {
    try {
      const anonymousCredits = localStorage.getItem(ANONYMOUS_USER_KEY)

      if (anonymousCredits) {
        const parsedCredits = JSON.parse(anonymousCredits)
        setCredits(parsedCredits.credits)
        return
      }

      // If no credits found, give 10 free credits
      setCredits(10)
      saveAnonymousCredits(10)
    } catch (error) {
      console.error("Error loading anonymous credits:", error)
      setCredits(10)
    }
  }

  const saveAnonymousCredits = (newCredits: number) => {
    try {
      localStorage.setItem(
        ANONYMOUS_USER_KEY,
        JSON.stringify({
          credits: newCredits,
          lastUpdated: Date.now(),
        }),
      )
    } catch (error) {
      console.error("Error saving anonymous credits:", error)
    }
  }

  const loadUserCredits = (address: string) => {
    try {
      const storedCreditsData = localStorage.getItem("userCredits")

      if (storedCreditsData) {
        const allUserCredits: UserCredits[] = JSON.parse(storedCreditsData)
        const userCredits = allUserCredits.find((user) => user.address.toLowerCase() === address.toLowerCase())

        if (userCredits) {
          setCredits(userCredits.credits)
          return
        }
      }

      // If no credits found, set to 10 free credits
      setCredits(10)
      saveUserCredits(address, 10)
    } catch (error) {
      console.error("Error loading credits:", error)
      setCredits(10)
    }
  }

  const saveUserCredits = (address: string, newCredits: number) => {
    try {
      const storedCreditsData = localStorage.getItem("userCredits")
      let allUserCredits: UserCredits[] = []

      if (storedCreditsData) {
        allUserCredits = JSON.parse(storedCreditsData)
        const existingUserIndex = allUserCredits.findIndex(
          (user) => user.address.toLowerCase() === address.toLowerCase(),
        )

        if (existingUserIndex >= 0) {
          allUserCredits[existingUserIndex].credits = newCredits
          allUserCredits[existingUserIndex].lastUpdated = Date.now()
        } else {
          allUserCredits.push({
            address,
            credits: newCredits,
            lastUpdated: Date.now(),
          })
        }
      } else {
        allUserCredits = [
          {
            address,
            credits: newCredits,
            lastUpdated: Date.now(),
          },
        ]
      }

      localStorage.setItem("userCredits", JSON.stringify(allUserCredits))
    } catch (error) {
      console.error("Error saving credits:", error)
    }
  }

  const useCredit = () => {
    if (credits > 0) {
      const newCredits = credits - 1
      setCredits(newCredits)

      // Save to localStorage
      if (walletAddress) {
        saveUserCredits(walletAddress, newCredits)
      } else {
        saveAnonymousCredits(newCredits)
      }

      return true
    }
    return false
  }

  return { credits, useCredit, walletAddress }
}

