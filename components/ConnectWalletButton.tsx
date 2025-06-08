"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2, Check, AlertTriangle, LogOut } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWallet } from "@/contexts/wallet-context"

export function ConnectWalletButton() {
  const { walletAddress, isConnecting, isWrongNetwork, connectWallet, disconnectWallet } = useWallet()
  const [justConnected, setJustConnected] = useState(false)
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  // Set justConnected state when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      setJustConnected(true)
      setTimeout(() => setJustConnected(false), 3000)
    }
  }, [walletAddress])

  // Handle disconnect with loading state
  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      await disconnectWallet()
    } finally {
      setIsDisconnecting(false)
    }
  }

  // Determine button text based on state
  const getButtonText = () => {
    if (isConnecting) return "Connecting..."
    if (isSwitchingNetwork) return "Switching Network..."
    if (justConnected) return "Connected!"
    if (walletAddress && isWrongNetwork) return "Switch to BNB Chain"
    if (walletAddress) return `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    return "Connect Wallet"
  }

  return (
    <>
      {networkError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{networkError}</AlertDescription>
        </Alert>
      )}

      {walletAddress ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              variant={isWrongNetwork ? "destructive" : "outline"}
              className={`${
                isWrongNetwork
                  ? "border-[#9FFFE0] text-[#9FFFE0] hover:bg-[#0B1211]"
                  : "border-green-500 text-green-400 hover:bg-green-950"
              } 
                w-full sm:w-auto transition-all duration-300`}
              disabled={isConnecting || isSwitchingNetwork || isDisconnecting}
            >
              {isConnecting || isSwitchingNetwork ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {getButtonText()}
                </>
              ) : justConnected ? (
                <>
                  <Check className="mr-2 h-5 w-5 text-green-400" />
                  {getButtonText()}
                </>
              ) : isWrongNetwork ? (
                <>
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  {getButtonText()}
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  {getButtonText()}
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleDisconnect}
              className="text-red-500 cursor-pointer"
              disabled={isDisconnecting}
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect Wallet
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          size="lg"
          variant="outline"
          className="border-[#9FFFE0] text-[#9FFFE0] hover:bg-[#0B1211] w-full sm:w-auto transition-all duration-300"
          onClick={connectWallet}
          disabled={isConnecting || isSwitchingNetwork}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </>
          )}
        </Button>
      )}
    </>
  )
}

