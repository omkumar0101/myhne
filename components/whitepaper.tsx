"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"

export default function Whitepaper() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Set font styles
      doc.setFont("helvetica", "bold")

      // Add logo/header
      doc.setFontSize(28)
      doc.setTextColor(128, 90, 213) // Purple color
      doc.text("NEUROX", 105, 20, { align: "center" })

      doc.setFontSize(16)
      doc.setTextColor(100, 100, 100)
      doc.text("Where AI Meets Relaxation in the Crypto Space", 105, 30, { align: "center" })

      doc.setFontSize(12)
      doc.text(`Version 1.0 - ${new Date().toLocaleDateString()}`, 105, 38, { align: "center" })

      // Add horizontal line
      doc.setDrawColor(128, 90, 213)
      doc.setLineWidth(0.5)
      doc.line(20, 42, 190, 42)

      // Table of Contents
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text("Table of Contents", 20, 55)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.text("1. Executive Summary", 25, 65)
      doc.text("2. Introduction", 25, 72)
      doc.text("3. Market Analysis", 25, 79)
      doc.text("4. The NEUROX Platform", 25, 86)
      doc.text("5. Technology Architecture", 25, 93)
      doc.text("6. Tokenomics", 25, 100)
      doc.text("7. Roadmap", 25, 107)
      doc.text("8. Conclusion", 25, 114)

      // Executive Summary
      doc.addPage()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(128, 90, 213)
      doc.text("1. Executive Summary", 20, 20)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      const executiveSummary = [
        "NEUROX is a revolutionary platform that combines artificial intelligence with mental wellness in the cryptocurrency space. Our mission is to provide crypto enthusiasts with tools to manage stress and anxiety often associated with market volatility while enjoying AI-powered creative experiences.",
        "",
        "Key highlights of the NEUROX ecosystem:",
        "",
        "• AI-Powered Relaxation Tools: Generate calming images, play stress-relief games, and interact with an AI assistant designed to promote mental well-being.",
        "",
        "• Zero-Tax Tokenomics: The NEUROX token features 0% buy and sell taxes, with 100% of the liquidity pool burned to ensure stability and security.",
        "",
        "• Community-Centric Approach: NEUROX is built by and for the community, with governance mechanisms that allow token holders to influence the platform's future development.",
      ]

      let yPos = 30
      executiveSummary.forEach((line) => {
        doc.text(line, 20, yPos)
        yPos += 7
      })

      // Introduction
      doc.addPage()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(128, 90, 213)
      doc.text("2. Introduction", 20, 20)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      const introduction = [
        "The cryptocurrency market is known for its high volatility and emotional rollercoaster. Investors and enthusiasts often experience significant stress, anxiety, and mental fatigue while navigating this space. NEUROX was conceived as a solution to this problem, offering a unique blend of AI technology and mental wellness tools specifically designed for the crypto community.",
        "",
        "2.1 The Problem",
        "",
        "• Market volatility causes emotional stress and anxiety",
        "• Constant chart-watching leads to mental fatigue",
        "• Limited resources for crypto-specific mental wellness",
        "• Lack of relaxing, entertaining applications in the crypto space",
        "",
        "2.2 Our Solution",
        "",
        "NEUROX creates a digital sanctuary where users can:",
        "",
        "• Generate AI art to express emotions and creativity",
        "• Engage with mini-games designed to reduce stress",
        "• Interact with an AI assistant trained in crypto knowledge and mental wellness",
        "• Participate in a community focused on balanced approaches to crypto investing",
      ]

      yPos = 30
      introduction.forEach((line) => {
        if (line.startsWith("2.1") || line.startsWith("2.2")) {
          doc.setFont("helvetica", "bold")
          doc.text(line, 20, yPos)
          doc.setFont("helvetica", "normal")
        } else {
          doc.text(line, 20, yPos)
        }
        yPos += 7
      })

      // Market Analysis
      doc.addPage()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(128, 90, 213)
      doc.text("3. Market Analysis", 20, 20)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      const marketAnalysis = [
        "The intersection of cryptocurrency, artificial intelligence, and mental wellness represents a significant market opportunity that remains largely untapped.",
        "",
        "3.1 Cryptocurrency Market",
        "",
        "• Global crypto market cap exceeds $1 trillion",
        "• Over 300 million crypto users worldwide",
        "• Growing mainstream adoption across various demographics",
        "",
        "3.2 AI Market",
        "",
        "• AI market projected to reach $190 billion by 2025",
        "• Generative AI experiencing explosive growth with applications in art, content, and interactive experiences",
        "• Increasing accessibility of AI tools to everyday users",
        "",
        "3.3 Mental Wellness Market",
        "",
        "• Mental wellness apps market valued at $4.2 billion, growing at 20% CAGR",
        "• Increasing awareness of mental health in financial and investment communities",
        "• Demand for specialized tools that address specific stressors in different industries",
      ]

      yPos = 30
      marketAnalysis.forEach((line) => {
        if (line.startsWith("3.1") || line.startsWith("3.2") || line.startsWith("3.3")) {
          doc.setFont("helvetica", "bold")
          doc.text(line, 20, yPos)
          doc.setFont("helvetica", "normal")
        } else {
          doc.text(line, 20, yPos)
        }
        yPos += 7
      })

      // The NEUROX Platform
      doc.addPage()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(128, 90, 213)
      doc.text("4. The NEUROX Platform", 20, 20)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      const platform = [
        "The NEUROX platform consists of several integrated components designed to provide a comprehensive experience for users seeking relaxation and entertainment in the crypto space.",
        "",
        "4.1 AI Image Generator",
        "",
        "• Create personalized, calming digital art based on text prompts",
        "• Share generated images with the community",
        "• Therapeutic creative outlet for expressing emotions related to market movements",
        "",
        "4.2 Mini-Games",
        "",
        "• Price Predictor: A game that helps users practice emotional detachment from price movements",
        "• Memory Match: Cognitive exercise that improves focus and provides a break from chart watching",
        "• Breathing Exercise: Guided 4-7-8 breathing technique proven to reduce anxiety and stress",
        "",
        "4.3 AI Chat Assistant",
        "",
        "• Provides balanced perspective on market movements",
        "• Offers relaxation techniques specific to crypto-related stress",
        "• Answers questions about cryptocurrency while maintaining a wellness-focused approach",
        "",
        "4.4 Community Features",
        "",
        "• Floating meme system that creates a light-hearted atmosphere",
        "• Shared creative content from the community",
        "• Forums and discussion spaces for mental wellness in crypto",
      ]

      yPos = 30
      platform.forEach((line) => {
        if (line.startsWith("4.1") || line.startsWith("4.2") || line.startsWith("4.3") || line.startsWith("4.4")) {
          doc.setFont("helvetica", "bold")
          doc.text(line, 20, yPos)
          doc.setFont("helvetica", "normal")
        } else {
          doc.text(line, 20, yPos)
        }
        yPos += 7

        // Add a new page if we're running out of space
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
      })

      // Technology Architecture
      doc.addPage()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(128, 90, 213)
      doc.text("5. Technology Architecture", 20, 20)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      const technology = [
        "NEUROX leverages cutting-edge technologies to deliver a seamless, responsive, and secure user experience.",
        "",
        "5.1 Frontend",
        "",
        "• React.js and Next.js for a responsive, modern user interface",
        "• TailwindCSS for consistent styling and optimal user experience across devices",
        "• Progressive Web App (PWA) capabilities for mobile accessibility",
        "",
        "5.2 Backend",
        "",
        "• Node.js server architecture for efficient API handling",
        "• Integration with state-of-the-art AI models for image generation and chat functionality",
        "• Blockchain integration for token utilities and transactions",
        "",
        "5.3 AI Components",
        "",
        "• Image generation powered by advanced diffusion models",
        "• Natural language processing for the AI assistant",
        "• Continuous learning algorithms to improve responses based on user interactions",
        "",
        "5.4 Blockchain Integration",
        "",
        "• ERC-20 token standard for the NEUROX token",
        "• Smart contracts for token utility functions",
        "• Decentralized governance mechanisms for community input",
      ]

      yPos = 30
      technology.forEach((line) => {
        if (line.startsWith("5.1") || line.startsWith("5.2") || line.startsWith("5.3") || line.startsWith("5.4")) {
          doc.setFont("helvetica", "bold")
          doc.text(line, 20, yPos)
          doc.setFont("helvetica", "normal")
        } else {
          doc.text(line, 20, yPos)
        }
        yPos += 7
      })

      // Tokenomics
      doc.addPage()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(128, 90, 213)
      doc.text("6. Tokenomics", 20, 20)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      const tokenomics = [
        "The NEUROX token is designed with simplicity, fairness, and long-term sustainability in mind.",
        "",
        "6.1 Token Details",
        "",
        "• Token Name: NEUROX",
        "• Total Supply: 1,000,000,000 NEUROX",
        "• Token Standard: ERC-20",
        "• Decimals: 18",
        "",
        "6.2 Distribution",
        "",
        "• 100% released on clanker",
        "",
        "6.3 Tax Structure",
        "",
        "• Buy Tax: 0%",
        "• Sell Tax: 0%",
        "",
        "This zero-tax policy ensures that 100% of transactions go directly to buying or selling NEUROX tokens, maximizing value for holders and creating a fair trading environment.",
        "",
        "6.4 Token Utility",
        "",
        "• Access premium AI features and higher generation limits",
        "• Governance voting rights on platform development",
        "• Staking rewards for passive income",
        "• Community incentives and rewards",
      ]

      yPos = 30
      tokenomics.forEach((line) => {
        if (line.startsWith("6.1") || line.startsWith("6.2") || line.startsWith("6.3") || line.startsWith("6.4")) {
          doc.setFont("helvetica", "bold")
          doc.text(line, 20, yPos)
          doc.setFont("helvetica", "normal")
        } else {
          doc.text(line, 20, yPos)
        }
        yPos += 7
      })

      // Roadmap
      doc.addPage()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(128, 90, 213)
      doc.text("7. Roadmap", 20, 20)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      const roadmap = [
        "NEUROX has a clear development roadmap divided into four phases:",
        "",
        "7.1 Phase 1 – Foundation & Development (Completed)",
        "",
        "• Concept creation & branding",
        "• Website & AI infrastructure development",
        "• Tokenomics & whitepaper release",
        "• AI-powered meme & image generation system",
        "",
        "7.2 Phase 2 – Launch & Community Growth (Current)",
        "",
        "• Community building (Discord, Telegram, X, Wrapcast)",
        "• Token Launch through Clanker on base chain",
        "• Listing on major exchanges",
        "",
        "7.3 Phase 3 – Expansion & Utility (Q3 2024)",
        "",
        "• Staking and reward mechanisms",
        "• Enhanced AI capabilities",
        "• Additional games and relaxation tools",
        "• Partnership & ecosystem growth",
        "• Mobile-optimized experience",
        "",
        "7.4 Phase 4 – Global Adoption (Q1 2025)",
        "",
        "• Full-scale platform launch with all features",
        "• Enterprise & Web3 integrations",
        "• Mobile app release",
        "• Advanced AI personalization",
        "• Expanded ecosystem partnerships",
      ]

      yPos = 30
      roadmap.forEach((line) => {
        if (line.startsWith("7.1") || line.startsWith("7.2") || line.startsWith("7.3") || line.startsWith("7.4")) {
          doc.setFont("helvetica", "bold")
          doc.text(line, 20, yPos)
          doc.setFont("helvetica", "normal")
        } else {
          doc.text(line, 20, yPos)
        }
        yPos += 7

        // Add a new page if we're running out of space
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
      })

      // Conclusion
      doc.addPage()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(128, 90, 213)
      doc.text("8. Conclusion", 20, 20)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      const conclusion = [
        "NEUROX represents a paradigm shift in how we approach cryptocurrency engagement, bringing together cutting-edge AI technology with mental wellness principles to create a unique platform that addresses a significant need in the market.",
        "",
        "By focusing on the human element of crypto trading and investing, NEUROX aims to create a more sustainable, healthy relationship with digital assets. Our zero-tax tokenomics and burned liquidity demonstrate our commitment to creating a fair, transparent ecosystem that prioritizes long-term value for all participants.",
        "",
        "As we progress through our roadmap, we invite community members, investors, and partners to join us in building a more balanced, enjoyable crypto experience. Together, we can transform how people interact with digital assets, making the space more accessible, less stressful, and more rewarding for everyone involved.",
        "",
        "The future of crypto isn't just about financial gains—it's about creating technologies that enhance our lives while respecting our mental and emotional wellbeing. NEUROX is leading this new wave of human-centered crypto projects, and we welcome you to be part of this journey.",
      ]

      yPos = 30
      conclusion.forEach((line) => {
        doc.text(line, 20, yPos)
        yPos += 7
      })

      // Add disclaimer page
      doc.addPage()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(128, 90, 213)
      doc.text("Legal Disclaimer", 105, 20, { align: "center" })

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)

      const disclaimer = [
        "This whitepaper is for informational purposes only and does not constitute financial advice, investment advice, trading advice, or any other sort of advice. You should not treat any of the whitepaper's content as such.",
        "",
        "NEUROX does not recommend that any cryptocurrency should be bought, sold, or held by you. Do conduct your due diligence and consult your financial advisor before making any investment decisions.",
        "",
        "Cryptocurrency investments are volatile and high risk in nature. Do not invest more than what you can afford to lose.",
        "",
        "This whitepaper contains forward-looking statements that involve risks and uncertainties. Results could differ materially from those anticipated in these forward-looking statements as a result of many factors.",
        "",
        "The NEUROX token is a utility token and is not intended to constitute securities in any jurisdiction. This whitepaper does not constitute a prospectus or offer document of any sort and is not intended to constitute an offer of securities or a solicitation for investment in securities in any jurisdiction.",
        "",
        "No regulatory authority has examined or approved any of the information set out in this whitepaper. No such action has been or will be taken under the laws, regulatory requirements, or rules of any jurisdiction.",
        "",
        "© 2024 NEUROX. All rights reserved.",
      ]

      yPos = 40
      disclaimer.forEach((line) => {
        doc.text(line, 20, yPos, { maxWidth: 170 })
        yPos += line ? 10 : 5
      })

      // Save the PDF
      doc.save("NEUROX_Whitepaper.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#9FFFE0]">
        Neurox – The Future of AI & Crypto Entertainment
      </h2>
      <p className="text-lg mb-8 text-[#9FFFE0]/70">
        For a detailed breakdown of Neurox's vision, technology, and tokenomics, read our comprehensive whitepaper.
        Learn how Neurox is redefining AI-powered relaxation and engagement in the Web3 space.
      </p>
      <Button size="lg" className="bg-[#9FFFE0] hover:bg-[#7FFFD0] text-[#0B1211]" onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            Download the Whitepaper
          </>
        )}
      </Button>
      <p className="text-xs text-[#9FFFE0]/70 mt-4">
        PDF will be generated and downloaded to your device. File size approximately 500KB.
      </p>
    </div>
  )
}

