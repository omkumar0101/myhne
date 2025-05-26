"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2, Check } from "lucide-react"

// Define types for Ethereum and MetaMask
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (request: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
      selectedAddress?: string
    }
  }
}

export default function ConnectWalletButton() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMetaMaskBrowser, setIsMetaMaskBrowser] = useState(false)
  const [justConnected, setJustConnected] = useState(false)

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

  // Check if MetaMask is installed and get current account on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Try to restore wallet connection from localStorage
    const savedWalletAddress = localStorage.getItem("connectedWalletAddress")
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress)
    }

    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        try {
          // Get current accounts
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
            // Save wallet address to localStorage
            localStorage.setItem("connectedWalletAddress", accounts[0])
          }

          // Listen for account changes
          const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
              setWalletAddress(null)
              localStorage.removeItem("connectedWalletAddress")
            } else {
              const newAddress = accounts[0]
              setWalletAddress(newAddress)
              localStorage.setItem("connectedWalletAddress", newAddress)
            }
          }

          window.ethereum.on("accountsChanged", handleAccountsChanged)

          return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          }
        } catch (err) {
          console.error("Error checking MetaMask connection:", err)
        }
      }
    }

    checkConnection()
  }, [])

  // Connect wallet
  const connectWallet = async () => {
    // For mobile devices
    if (isMobile) {
      // Check if MetaMask is available in the current browser
      if (window.ethereum && window.ethereum.isMetaMask) {
        // If we're already in the MetaMask browser, proceed with connection
        try {
          setIsConnecting(true)
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
          setWalletAddress(accounts[0])
          localStorage.setItem("connectedWalletAddress", accounts[0])
          setJustConnected(true)
          setTimeout(() => setJustConnected(false), 3000)
        } catch (err: any) {
          console.error("Error connecting wallet:", err)
        } finally {
          setIsConnecting(false)
        }
      } else {
        // If not in MetaMask browser, redirect to MetaMask app
        // Provide a deep link to open MetaMask with the current URL
        const currentUrl = window.location.href

        // This will attempt to open the MetaMask app with a return URL
        // Using the universal link format for better compatibility
        window.location.href = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}?utm_source=neurox`
      }
      return
    }

    // For desktop
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      window.open("https://metamask.io/download/", "_blank")
      return
    }

    try {
      setIsConnecting(true)
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setWalletAddress(accounts[0])
      localStorage.setItem("connectedWalletAddress", accounts[0])
      setJustConnected(true)
      setTimeout(() => setJustConnected(false), 3000)
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
    } finally {
      setIsConnecting(false)
    }
  }

  // Determine button text based on state
  const getButtonText = () => {
    if (isConnecting) return "Connecting..."
    if (justConnected) return "Connected!"
    if (walletAddress) return `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    return "Connect Wallet"
  }

  return (
    <Button
      size="lg"
      variant={walletAddress ? "outline" : "outline"}
      className={`${
        walletAddress
          ? "border-green-500 text-green-400 hover:bg-green-950"
          : "border-purple-500 text-purple-400 hover:bg-purple-950"
      } 
        w-full sm:w-auto transition-all duration-300`}
      onClick={connectWallet}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {getButtonText()}
        </>
      ) : justConnected ? (
        <>
          <Check className="mr-2 h-5 w-5 text-green-400" />
          {getButtonText()}
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-5 w-5" />
          {getButtonText()}
        </>
      )}
    </Button>
  )
}

