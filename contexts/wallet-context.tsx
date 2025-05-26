"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { NETWORK } from "@/constants/network"

interface WalletContextType {
  walletAddress: string | null
  isConnecting: boolean
  isWrongNetwork: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  checkNetwork: () => Promise<boolean>
  switchNetwork: () => Promise<boolean>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMetaMaskBrowser, setIsMetaMaskBrowser] = useState(false)

  // Check if on mobile device and if we're in MetaMask browser
  useEffect(() => {
    const checkEnvironment = () => {
      // Only run on client side
      if (typeof window === "undefined") return

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

  // Check if the user is on the correct network
  const checkNetwork = async () => {
    if (!window.ethereum) return false

    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const isCorrectNetwork = chainId === NETWORK.CHAIN_ID
      setIsWrongNetwork(!isCorrectNetwork)
      return isCorrectNetwork
    } catch (error) {
      console.error("Error checking network:", error)
      return false
    }
  }

  // Switch to the BNB Chain network
  const switchNetwork = async () => {
    if (!window.ethereum) return false

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORK.CHAIN_ID }],
      })

      setIsWrongNetwork(false)
      return true
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: NETWORK.CHAIN_ID,
                chainName: NETWORK.NAME,
                nativeCurrency: {
                  name: NETWORK.NAME,
                  symbol: NETWORK.CURRENCY_SYMBOL,
                  decimals: 18,
                },
                rpcUrls: NETWORK.RPC_URLS,
                blockExplorerUrls: [NETWORK.BLOCK_EXPLORER],
                iconUrls: [NETWORK.ICON_URL],
              },
            ],
          })

          setIsWrongNetwork(false)
          return true
        } catch (addError: any) {
          console.error("Error adding network:", addError)
          return false
        }
      } else {
        console.error("Error switching network:", switchError)
        return false
      }
    }
  }

  // Check if MetaMask is installed and get current account on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Try to restore wallet connection from localStorage
    const savedWalletAddress = localStorage.getItem("connectedWalletAddress")
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress)
      // Check network when wallet is connected
      checkNetwork()
    }

    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          // Get current accounts
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
            // Save wallet address to localStorage
            localStorage.setItem("connectedWalletAddress", accounts[0])
            // Check network when wallet is connected
            checkNetwork()
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
              // Check network when account changes
              checkNetwork()
            }
          }

          // Listen for chain changes
          const handleChainChanged = (chainId: string) => {
            // Check if the new chain is the correct one
            const isCorrectNetwork = chainId === NETWORK.CHAIN_ID
            setIsWrongNetwork(!isCorrectNetwork)
          }

          window.ethereum.on("accountsChanged", handleAccountsChanged)
          window.ethereum.on("chainChanged", handleChainChanged)

          return () => {
            if (window.ethereum) {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
            window.ethereum.removeListener("chainChanged", handleChainChanged)
            }
          }
        } catch (err) {
          console.error("Error checking MetaMask connection:", err)
        }
      }
    }

    checkConnection()

    // Listen for storage changes (for cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "connectedWalletAddress") {
        if (e.newValue) {
          setWalletAddress(e.newValue)
        } else {
          setWalletAddress(null)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Connect wallet
  const connectWallet = async () => {
    // If already connected but on wrong network, switch network
    if (walletAddress && isWrongNetwork) {
      await switchNetwork()
      return
    }

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

          // Check and switch network if needed
          const isCorrectNetwork = await checkNetwork()
          if (!isCorrectNetwork) {
            await switchNetwork()
          }
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
        window.location.href = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}?utm_source=hyper-neurox`
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

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent("walletConnected", { detail: accounts[0] }))

      // Check and switch network if needed
      const isCorrectNetwork = await checkNetwork()
      if (!isCorrectNetwork) {
        await switchNetwork()
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    try {
      // Remove from localStorage
      localStorage.removeItem("connectedWalletAddress")

      // Clear any user credits or other wallet-related data
      try {
        // Clear user credits data if needed
        const storedCreditsData = localStorage.getItem("userCredits")
        if (storedCreditsData) {
          const allUserCredits = JSON.parse(storedCreditsData)
          // Keep other users' data, just remove this wallet's data
          const filteredCredits = allUserCredits.filter(
            (user: any) => user.address.toLowerCase() !== walletAddress?.toLowerCase(),
          )
          localStorage.setItem("userCredits", JSON.stringify(filteredCredits))
        }
      } catch (e) {
        console.error("Error clearing user data:", e)
      }

      // Update state
      setWalletAddress(null)
      setIsWrongNetwork(false)

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent("walletDisconnected"))

      // Note: This doesn't actually disconnect MetaMask from the site at the wallet level
      // It only removes our local reference to the connection

      // Optional: Display a toast or notification explaining this
      if (typeof window !== "undefined") {
        alert(
          "Your wallet has been disconnected from this site. Note that you may still need to disconnect this site in your MetaMask wallet settings for complete disconnection.",
        )
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnecting,
        isWrongNetwork,
        connectWallet,
        disconnectWallet,
        checkNetwork,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

