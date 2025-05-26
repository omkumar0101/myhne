"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, ArrowDown, RefreshCw, Brain, Timer } from "lucide-react"

export default function MiniGames() {
  return (
    <Tabs defaultValue="price-predictor" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-[#0B1211] text-xs sm:text-sm">
        <TabsTrigger value="price-predictor" className="py-1.5">
          Price Predictor
        </TabsTrigger>
        <TabsTrigger value="memory-match" className="py-1.5">
          Memory Match
        </TabsTrigger>
        <TabsTrigger value="breathing" className="py-1.5">
          Breathing Exercise
        </TabsTrigger>
      </TabsList>

      <TabsContent value="price-predictor" className="mt-4 sm:mt-6">
        <PricePredictor />
      </TabsContent>

      <TabsContent value="memory-match" className="mt-4 sm:mt-6">
        <MemoryMatch />
      </TabsContent>

      <TabsContent value="breathing" className="mt-4 sm:mt-6">
        <BreathingExercise />
      </TabsContent>
    </Tabs>
  )
}

// Price Predictor Game
function PricePredictor() {
  const [currentPrice, setCurrentPrice] = useState(25000)
  const [nextPrice, setNextPrice] = useState(0)
  const [prediction, setPrediction] = useState<"up" | "down" | null>(null)
  const [result, setResult] = useState<"correct" | "wrong" | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)

  // Generate a random price movement
  const generateNextPrice = () => {
    const movement = Math.random() > 0.5 ? 1 : -1
    const amount = Math.floor(Math.random() * 1000) + 100
    return currentPrice + movement * amount
  }

  // Start a new round
  const startRound = () => {
    setNextPrice(0)
    setPrediction(null)
    setResult(null)
    setIsPlaying(true)
    setTimeLeft(10)
  }

  // Make a prediction
  const makePrediction = (direction: "up" | "down") => {
    if (!isPlaying) return

    setPrediction(direction)
    const next = generateNextPrice()
    setNextPrice(next)

    const isCorrect = (direction === "up" && next > currentPrice) || (direction === "down" && next < currentPrice)

    setResult(isCorrect ? "correct" : "wrong")

    if (isCorrect) {
      setScore((prev) => prev + 10)
      setStreak((prev) => prev + 1)
    } else {
      setStreak(0)
    }

    setIsPlaying(false)
    setCurrentPrice(next)
  }

  // Timer effect
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          makePrediction(Math.random() > 0.5 ? "up" : "down")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying])

  return (
    <Card className="bg-[#0B1211]/60 border-[#9FFFE0] backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#9FFFE0] mb-2">Crypto Price Predictor</h3>
          <p className="text-[#9FFFE0]/70">Predict if the price will go up or down in the next 10 seconds!</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-[#9FFFE0]/70">Score</p>
            <p className="text-2xl font-bold text-[#9FFFE0]">{score}</p>
          </div>
          <div>
            <p className="text-sm text-[#9FFFE0]/70">Current Price</p>
            <p className="text-2xl font-bold text-[#9FFFE0]">${currentPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-[#9FFFE0]/70">Streak</p>
            <p className="text-2xl font-bold text-[#9FFFE0]">{streak}🔥</p>
          </div>
        </div>

        {nextPrice > 0 && (
          <div className="mb-6 text-center">
            <p className="text-sm text-[#9FFFE0]/70">Next Price</p>
            <p className={`text-2xl font-bold ${nextPrice > currentPrice ? "text-green-500" : "text-red-500"}`}>
              ${nextPrice.toLocaleString()}
              {nextPrice > currentPrice ? " ↑" : " ↓"}
            </p>
          </div>
        )}

        {result && (
          <div
            className={`mb-6 p-3 rounded-md text-center ${result === "correct" ? "bg-[#0B1211]/30 text-[#9FFFE0]" : "bg-[#0B1211]/30 text-[#9FFFE0]"}`}
          >
            {result === "correct" ? "Correct prediction! +10 points" : "Wrong prediction! Streak reset"}
          </div>
        )}

        {isPlaying ? (
          <div className="mb-6">
            <div className="flex justify-center items-center gap-4">
              <Button onClick={() => makePrediction("up")} className="flex-1 bg-[#9FFFE0] hover:bg-[#7FFFD0] text-[#0B1211]">
                <ArrowUp className="mr-2 h-4 w-4" />
                Up
              </Button>
              <div className="text-center">
                <Timer className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
                <p className="text-lg font-bold text-yellow-400">{timeLeft}s</p>
              </div>
              <Button onClick={() => makePrediction("down")} className="flex-1 bg-[#9FFFE0] hover:bg-[#7FFFD0] text-[#0B1211]">
                <ArrowDown className="mr-2 h-4 w-4" />
                Down
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={startRound} className="w-full bg-[#9FFFE0] hover:bg-[#7FFFD0] text-[#0B1211]">
            <RefreshCw className="mr-2 h-4 w-4" />
            {result ? "Next Round" : "Start Game"}
          </Button>
        )}

        <p className="text-xs text-[#9FFFE0]/70 mt-4 text-center">
          Disclaimer: This is just a game and not financial advice. Prices are simulated.
        </p>
      </CardContent>
    </Card>
  )
}

// Memory Match Game - Updated to use emojis instead of images
function MemoryMatch() {
  // Crypto emojis for the memory match game
  const cryptoEmojis = ["💰", "💎", "🪙", "📈", "🏦", "💸", "🤑", "💹"]
  const allEmojis = [...cryptoEmojis, ...cryptoEmojis]

  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Initialize game
  const initGame = () => {
    // Shuffle cards
    const shuffledCards = allEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    setGameOver(false)
    setGameStarted(true)
  }

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore if already flipped or matched
    if (cards[id].flipped || cards[id].matched) return

    // Ignore if already two cards flipped
    if (flippedCards.length === 2) return

    // Flip the card
    const newCards = [...cards]
    newCards[id].flipped = true
    setCards(newCards)

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id]
    setFlippedCards(newFlippedCards)

    // If two cards flipped, check for match
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      const [first, second] = newFlippedCards

      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[first].matched = true
          matchedCards[second].matched = true
          setCards(matchedCards)
          setFlippedCards([])

          // Check if game over
          if (matchedCards.every((card) => card.matched)) {
            setGameOver(true)
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[first].flipped = false
          resetCards[second].flipped = false
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <Card className="bg-[#0B1211]/60 border-[#9FFFE0] backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#9FFFE0] mb-2">Crypto Memory Match</h3>
          <p className="text-[#9FFFE0]/70">Match pairs of crypto emojis to win!</p>
        </div>

        {gameStarted ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-[#9FFFE0]/70">
                Moves: <span className="text-[#9FFFE0] font-bold">{moves}</span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={initGame}
                className="border-[#9FFFE0]/30 text-[#9FFFE0] hover:bg-[#0B1211] text-[#9FFFE0] hover:bg-[#7FFFD0]"
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Restart
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square rounded-md cursor-pointer transition-all duration-300 transform ${
                    card.flipped || card.matched ? "bg-[#9FFFE0] rotate-y-180" : "bg-[#0B1211]/80 hover:bg-[#0B1211]/70"
                  } ${card.matched ? "opacity-70" : "opacity-100"} flex items-center justify-center`}
                >
                  {(card.flipped || card.matched) && <div className="text-2xl">{card.emoji}</div>}
                </div>
              ))}
            </div>

            {gameOver && (
              <div className="mb-4 p-3 rounded-md text-center bg-[#0B1211]/30 text-[#9FFFE0]">
                <p className="font-bold">Congratulations! You won in {moves} moves!</p>
              </div>
            )}
          </>
        ) : (
          <Button onClick={initGame} className="w-full bg-[#9FFFE0] hover:bg-[#7FFFD0] text-[#0B1211]">
            <Brain className="mr-2 h-4 w-4" />
            Start Game
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Breathing Exercise
function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale")
  const [timer, setTimer] = useState(0)
  const [cycles, setCycles] = useState(0)

  const maxCycles = 3

  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 1,
  }

  const phaseMessages = {
    inhale: "Breathe in...",
    hold: "Hold...",
    exhale: "Breathe out...",
    rest: "Rest...",
  }

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev + 1

        // Check if current phase is complete
        if (newTime >= phaseDurations[phase]) {
          // Move to next phase
          if (phase === "inhale") {
            setPhase("hold")
            return 0
          } else if (phase === "hold") {
            setPhase("exhale")
            return 0
          } else if (phase === "exhale") {
            setPhase("rest")
            return 0
          } else {
            // End of cycle
            if (cycles >= maxCycles - 1) {
              setIsActive(false)
              setPhase("inhale")
              setCycles(0)
              return 0
            } else {
              setCycles((prev) => prev + 1)
              setPhase("inhale")
              return 0
            }
          }
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase, cycles])

  const startExercise = () => {
    setIsActive(true)
    setPhase("inhale")
    setTimer(0)
    setCycles(0)
  }

  const stopExercise = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimer(0)
    setCycles(0)
  }

  // Calculate progress percentage for the current phase
  const progress = (timer / phaseDurations[phase]) * 100

  return (
    <Card className="bg-[#0B1211]/60 border-[#9FFFE0] backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#9FFFE0] mb-2">4-7-8 Breathing Exercise</h3>
          <p className="text-[#9FFFE0]/70">A relaxation technique to reduce stress and anxiety</p>
        </div>

        <div className="flex flex-col items-center justify-center mb-6">
          <div
            className={`h-40 w-40 rounded-full flex items-center justify-center mb-4 transition-all duration-1000 ${
              isActive
                ? phase === "inhale"
                  ? "bg-[#9FFFE0]/20 scale-125"
                  : phase === "hold"
                    ? "bg-[#9FFFE0]/20 scale-125"
                    : phase === "exhale"
                      ? "bg-[#9FFFE0]/20 scale-100"
                      : "bg-[#0B1211]/20 scale-100"
                : "bg-[#0B1211]/20"
            }`}
          >
            <div
              className={`h-32 w-32 rounded-full flex items-center justify-center text-center transition-all duration-1000 ${
                isActive
                  ? phase === "inhale"
                    ? "bg-[#9FFFE0]/30 scale-100"
                    : phase === "hold"
                      ? "bg-[#9FFFE0]/30 scale-100"
                      : phase === "exhale"
                        ? "bg-[#9FFFE0]/30 scale-75"
                        : "bg-[#0B1211]/30 scale-90"
                  : "bg-[#0B1211]/30"
              }`}
            >
              {isActive ? (
                <div>
                  <p
                    className={`text-lg font-bold ${
                      phase === "inhale"
                        ? "text-[#9FFFE0]"
                        : phase === "hold"
                          ? "text-[#9FFFE0]"
                          : phase === "exhale"
                            ? "text-[#9FFFE0]"
                            : "text-[#9FFFE0]"
                    }`}
                  >
                    {phaseMessages[phase]}
                  </p>
                  <p className="text-2xl font-bold text-[#9FFFE0]">{phaseDurations[phase] - timer}</p>
                </div>
              ) : (
                <p className="text-lg font-bold text-[#9FFFE0]">Ready?</p>
              )}
            </div>
          </div>

          <div className="w-full h-2 bg-[#0B1211] rounded-full mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                phase === "inhale"
                  ? "bg-[#9FFFE0]"
                  : phase === "hold"
                    ? "bg-[#9FFFE0]"
                    : phase === "exhale"
                      ? "bg-[#9FFFE0]"
                      : "bg-[#9FFFE0]"
              }`}
              style={{ width: `${isActive ? progress : 0}%` }}
            ></div>
          </div>

          <p className="text-sm text-[#9FFFE0]/70 mb-4">
            Cycle {cycles + 1} of {maxCycles}
          </p>
        </div>

        {isActive ? (
          <Button onClick={stopExercise} className="w-full bg-[#9FFFE0] hover:bg-[#7FFFD0] text-[#0B1211]">
            Stop Exercise
          </Button>
        ) : (
          <Button onClick={startExercise} className="w-full bg-[#9FFFE0] hover:bg-[#7FFFD0] text-[#0B1211]">
            Start Breathing Exercise
          </Button>
        )}

        <div className="mt-4 p-3 bg-[#0B1211] rounded-md">
          <h4 className="font-medium text-[#9FFFE0] mb-2">How it works:</h4>
          <ol className="text-sm text-[#9FFFE0]/70 list-decimal pl-5 space-y-1">
            <li>Inhale quietly through your nose for 4 seconds</li>
            <li>Hold your breath for 7 seconds</li>
            <li>Exhale completely through your mouth for 8 seconds</li>
            <li>Repeat the cycle 3 times</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

