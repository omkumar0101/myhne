import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { WalletProvider } from "@/contexts/wallet-context"

export const metadata: Metadata = {
  title: "Neurox",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}

