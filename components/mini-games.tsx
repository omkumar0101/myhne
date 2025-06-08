"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, ArrowDown, RefreshCw, Brain, Timer, Moon, Sun, Star, Trophy, Zap, Sparkles, Crown, Gem, Eye, EyeOff, AlertTriangle } from "lucide-react"

export default function MiniGames() {
  return (
    <Tabs defaultValue="memory-match" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-[#0B1211] text-xs sm:text-sm">
        <TabsTrigger value="memory-match" className="py-1.5">
          Memory Match
        </TabsTrigger>
        <TabsTrigger value="breathing" className="py-1.5">
          Breathing Exercise
        </TabsTrigger>
        <TabsTrigger value="astral-cards" className="py-1.5">
          Astral Cards
        </TabsTrigger>
      </TabsList>

      <TabsContent value="memory-match" className="mt-4 sm:mt-6">
        <MemoryMatch />
      </TabsContent>

      <TabsContent value="breathing" className="mt-4 sm:mt-6">
        <BreathingExercise />
      </TabsContent>

      <TabsContent value="astral-cards" className="mt-4 sm:mt-6">
        <AstralCards />
      </TabsContent>
    </Tabs>
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

            <div className="grid grid-cols-4 gap-3 mb-4 max-w-md mx-auto">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    card.flipped || card.matched ? "bg-[#9FFFE0] rotate-y-180" : "bg-[#0B1211]/80 hover:bg-[#0B1211]/70"
                  } ${card.matched ? "opacity-70" : "opacity-100"} flex items-center justify-center border-2 border-[#9FFFE0]/30 min-h-[60px] sm:min-h-[80px]`}
                >
                  {(card.flipped || card.matched) && <div className="text-3xl sm:text-4xl">{card.emoji}</div>}
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

// Astral Cards Game - Full Balatro-style game
function AstralCards() {
  // Types
  type Suit = "moon" | "sun" | "star"
  type Rank = "A" | "2" | "3" | "4" | "5" | "Q" | "K"

  interface GameCard {
    id: string
    suit: Suit
    rank: Rank
    baseValue: number
  }

  interface HandType {
    name: string
    baseScore: number
    baseMultiplier: number
    priority: number
    description: string
  }

  interface Joker {
    id: string
    name: string
    description: string
    rarity: "common" | "rare" | "legendary" | "mythic"
    effect: (
      cards: GameCard[],
      handType: HandType,
      scoringCards: GameCard[],
    ) => { scoreBonus: number; multiplierBonus: number }
  }

  interface Reward {
    type: "card_boost" | "hand_boost" | "hand_multiplier" | "global_boost" | "special"
    description: string
    apply: () => void
  }

  interface AppliedReward {
    id: string
    type: string
    description: string
    value: number
  }

  interface GameState {
    deck: GameCard[]
    hand: GameCard[]
    discardPile: GameCard[]
    selectedCards: string[]
    currentOpponent: number
    currentRound: number
    discardsUsed: number
    playsUsed: number
    maxPlays: number
    score: number
    targetScore: number
    phase: "playing" | "victory" | "defeat" | "reward" | "joker_select" | "game_complete" | "plays_exhausted"
    jokers: Joker[]
    cardBoosts: Record<string, number>
    handBoosts: Record<string, number>
    handMultipliers: Record<string, number>
    globalMultiplier: number
    globalScoreBonus: number
    appliedRewards: AppliedReward[]
  }

  // Constants
  const SUITS: Suit[] = ["moon", "sun", "star"]
  const RANKS: Rank[] = ["A", "2", "3", "4", "5", "Q", "K"]
  const CARD_VALUES: Record<Rank, number> = {
    A: 10,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    Q: 7,
    K: 8,
  }

  const HAND_TYPES: Record<string, HandType> = {
    high_card: {
      name: "High Card",
      baseScore: 10,
      baseMultiplier: 1,
      priority: 1,
      description: "Highest single card",
    },
    pair: {
      name: "Pair",
      baseScore: 15,
      baseMultiplier: 2,
      priority: 2,
      description: "Two cards of same rank",
    },
    three_kind: {
      name: "Three of a Kind",
      baseScore: 20,
      baseMultiplier: 3,
      priority: 3,
      description: "Three cards of same rank",
    },
    flush: {
      name: "Flush",
      baseScore: 30,
      baseMultiplier: 4,
      priority: 4,
      description: "3+ cards of same suit",
    },
    straight: {
      name: "Straight",
      baseScore: 30,
      baseMultiplier: 4,
      priority: 5,
      description: "3+ cards in sequence",
    },
    straight_flush: {
      name: "Straight Flush",
      baseScore: 50,
      baseMultiplier: 10,
      priority: 6,
      description: "3+ cards in sequence, same suit",
    },
  }

  const SEQUENCE_ORDER = ["A", "2", "3", "4", "5", "Q", "K", "A"]

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    hand: [],
    discardPile: [],
    selectedCards: [],
    currentOpponent: 1,
    currentRound: 1,
    discardsUsed: 0,
    playsUsed: 0,
    maxPlays: 4,
    score: 0,
    targetScore: 100,
    phase: "playing",
    jokers: [],
    cardBoosts: {},
    handBoosts: {},
    handMultipliers: {},
    globalMultiplier: 0,
    globalScoreBonus: 0,
    appliedRewards: [],
  })

  const [rewards, setRewards] = useState<Reward[]>([])
  const [availableJokers, setAvailableJokers] = useState<Joker[]>([])
  const [draggedCard, setDraggedCard] = useState<string | null>(null)
  const [backgroundHue, setBackgroundHue] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([])
  const [showDeck, setShowDeck] = useState(false)
  const [showDiscardPile, setShowDiscardPile] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  // Sound effects
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = "sine") => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }, [])

  // Psychedelic background animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundHue((prev) => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Particle system
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1,
          }))
          .filter((p) => p.y < window.innerHeight && p.x > -10 && p.x < window.innerWidth + 10)

        // Add new particles occasionally
        if (Math.random() < 0.1) {
          updated.push({
            id: Date.now(),
            x: Math.random() * window.innerWidth,
            y: -10,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2 + 1,
          })
        }

        return updated
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Initialize game
  const createDeck = useCallback((): GameCard[] => {
    const deck: GameCard[] = []
    SUITS.forEach((suit) => {
      RANKS.forEach((rank) => {
        deck.push({
          id: `${suit}-${rank}-${Math.random()}`,
          suit,
          rank,
          baseValue: CARD_VALUES[rank],
        })
      })
    })
    return shuffleDeck(deck)
  }, [])

  const shuffleDeck = (deck: GameCard[]): GameCard[] => {
    const shuffled = [...deck]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  useEffect(() => {
    const newDeck = createDeck()
    setGameState((prev) => ({
      ...prev,
      deck: newDeck.slice(9),
      hand: newDeck.slice(0, 9),
      targetScore: 100 + (prev.currentOpponent - 1) * 75,
      discardPile: [],
      playsUsed: 0,
    }))
  }, [createDeck, gameState.currentOpponent])

  // Enhanced hand detection with scoring cards identification
  const detectHandTypeAndScoringCards = (cards: GameCard[]): { handType: HandType; scoringCards: GameCard[] } => {
    if (cards.length === 0) return { handType: HAND_TYPES.high_card, scoringCards: [] }

    const ranks = cards.map((c) => c.rank)
    const suits = cards.map((c) => c.suit)

    // Check for straight
    const isSequence = (ranks: Rank[]): boolean => {
      if (ranks.length < 3) return false
      const sortedRanks = [...ranks].sort((a, b) => SEQUENCE_ORDER.indexOf(a) - SEQUENCE_ORDER.indexOf(b))
      for (let i = 0; i < sortedRanks.length - 1; i++) {
        const currentIndex = SEQUENCE_ORDER.indexOf(sortedRanks[i])
        const nextIndex = SEQUENCE_ORDER.indexOf(sortedRanks[i + 1])
        if (nextIndex !== currentIndex + 1) return false
      }
      return true
    }

    const isFlush = cards.length >= 3 && suits.every((suit) => suit === suits[0])
    const isStraight = isSequence(ranks)

    // Count rank occurrences
    const rankCounts = ranks.reduce(
      (acc, rank) => {
        acc[rank] = (acc[rank] || 0) + 1
        return acc
      },
      {} as Record<Rank, number>,
    )

    const counts = Object.values(rankCounts).sort((a, b) => b - a)

    // Determine hand type and scoring cards
    if (isStraight && isFlush) {
      return { handType: HAND_TYPES.straight_flush, scoringCards: cards }
    }
    if (isStraight) {
      return { handType: HAND_TYPES.straight, scoringCards: cards }
    }
    if (isFlush) {
      return { handType: HAND_TYPES.flush, scoringCards: cards }
    }
    if (counts[0] >= 3) {
      // Find the three of a kind cards
      const threeKindRank = Object.keys(rankCounts).find((rank) => rankCounts[rank as Rank] >= 3) as Rank
      const scoringCards = cards.filter((card) => card.rank === threeKindRank)
      return { handType: HAND_TYPES.three_kind, scoringCards }
    }
    if (counts[0] >= 2) {
      // Find the pair cards
      const pairRank = Object.keys(rankCounts).find((rank) => rankCounts[rank as Rank] >= 2) as Rank
      const scoringCards = cards.filter((card) => card.rank === pairRank).slice(0, 2)
      return { handType: HAND_TYPES.pair, scoringCards }
    }

    // High card - only the highest value card
    const highestCard = cards.reduce((highest, card) => (card.baseValue > highest.baseValue ? card : highest))
    return { handType: HAND_TYPES.high_card, scoringCards: [highestCard] }
  }

  // Enhanced score calculation
  const calculateScore = (cards: GameCard[]): { score: number; handType: HandType; scoringCards: GameCard[] } => {
    const { handType, scoringCards } = detectHandTypeAndScoringCards(cards)

    // Calculate card values only from scoring cards
    const cardValues = scoringCards.reduce((sum, card) => {
      const boost = gameState.cardBoosts[`${card.suit}-${card.rank}`] || 0
      return sum + card.baseValue + boost
    }, 0)

    const handBoost = gameState.handBoosts[handType.name] || 0
    const handMultiplier = gameState.handMultipliers[handType.name] || 0

    let scoreBonus = gameState.globalScoreBonus
    let multiplierBonus = gameState.globalMultiplier

    // Apply joker effects
    gameState.jokers.forEach((joker) => {
      const effect = joker.effect(cards, handType, scoringCards)
      scoreBonus += effect.scoreBonus
      multiplierBonus += effect.multiplierBonus
    })

    const totalScore = handType.baseScore + cardValues + handBoost + scoreBonus
    const totalMultiplier = handType.baseMultiplier + handMultiplier + multiplierBonus

    return { score: totalScore * totalMultiplier, handType, scoringCards }
  }

  // UI helpers
  const getSuitIcon = (suit: Suit) => {
    switch (suit) {
      case "moon":
        return <Moon className="w-3 h-3" />
      case "sun":
        return <Sun className="w-3 h-3" />
      case "star":
        return <Star className="w-3 h-3" />
    }
  }

  const getSuitColor = (suit: Suit) => {
    switch (suit) {
      case "moon":
        return "text-blue-400"
      case "sun":
        return "text-yellow-400"
      case "star":
        return "text-purple-400"
    }
  }

  const getSuitName = (suit: Suit) => {
    switch (suit) {
      case "moon":
        return "Moon"
      case "sun":
        return "Sun"
      case "star":
        return "Star"
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400 bg-gray-100"
      case "rare":
        return "border-blue-400 bg-blue-100"
      case "legendary":
        return "border-purple-400 bg-purple-100"
      case "mythic":
        return "border-pink-400 bg-gradient-to-br from-pink-100 to-purple-100"
      default:
        return "border-gray-400 bg-gray-100"
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return <Zap className="w-4 h-4 text-gray-600" />
      case "rare":
        return <Sparkles className="w-4 h-4 text-blue-600" />
      case "legendary":
        return <Crown className="w-4 h-4 text-purple-600" />
      case "mythic":
        return <Gem className="w-4 h-4 text-pink-600" />
      default:
        return <Zap className="w-4 h-4 text-gray-600" />
    }
  }

  // Game actions
  const playCards = () => {
    if (gameState.selectedCards.length === 0) return
    if (gameState.playsUsed >= gameState.maxPlays) return

    const playedCards = gameState.hand.filter((card) => gameState.selectedCards.includes(card.id))
    const { score: roundScore } = calculateScore(playedCards)

    playSound(440 + roundScore / 10, 0.3, "triangle")

    const newScore = gameState.score + roundScore
    const newHand = gameState.hand.filter((card) => !gameState.selectedCards.includes(card.id))
    const newCards = gameState.deck.slice(0, gameState.selectedCards.length)
    const newPlaysUsed = gameState.playsUsed + 1

    setGameState((prev) => ({
      ...prev,
      score: newScore,
      hand: [...newHand, ...newCards],
      deck: prev.deck.slice(gameState.selectedCards.length),
      selectedCards: [],
      playsUsed: newPlaysUsed,
    }))

    // Check for victory
    if (newScore >= gameState.targetScore) {
      playSound(880, 0.5, "square")
      setGameState((prev) => ({ ...prev, phase: "victory" }))
      return
    }

    // Check if plays are exhausted
    if (newPlaysUsed >= gameState.maxPlays) {
      playSound(200, 0.8, "sawtooth")
      setGameState((prev) => ({ ...prev, phase: "plays_exhausted" }))
    }
  }

  const discardCards = () => {
    if (gameState.selectedCards.length === 0 || gameState.discardsUsed >= 2) return

    playSound(220, 0.2, "sawtooth")

    const discardedCards = gameState.hand.filter((card) => gameState.selectedCards.includes(card.id))
    const newHand = gameState.hand.filter((card) => !gameState.selectedCards.includes(card.id))
    const newCards = gameState.deck.slice(0, gameState.selectedCards.length)

    setGameState((prev) => ({
      ...prev,
      hand: [...newHand, ...newCards],
      deck: prev.deck.slice(gameState.selectedCards.length),
      discardPile: [...prev.discardPile, ...discardedCards],
      selectedCards: [],
      discardsUsed: prev.discardsUsed + 1,
    }))
  }

  const nextRound = () => {
    if (gameState.currentRound >= 3) {
      playSound(150, 1, "square")
      setGameState((prev) => ({ ...prev, phase: "defeat" }))
      return
    }

    setGameState((prev) => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      score: 0,
      discardsUsed: 0,
      playsUsed: 0,
      phase: "playing",
    }))
  }

  const nextOpponent = () => {
    if (gameState.currentOpponent >= 10) {
      setGameState((prev) => ({ ...prev, phase: "game_complete" }))
      return
    }

    const newOpponent = gameState.currentOpponent + 1

    setGameState((prev) => ({
      ...prev,
      currentOpponent: newOpponent,
      currentRound: 1,
      score: 0,
      discardsUsed: 0,
      playsUsed: 0,
      phase: "playing",
    }))
  }

  // Card selection
  const toggleCardSelection = (cardId: string) => {
    playSound(380, 0.1, "triangle")
    setGameState((prev) => ({
      ...prev,
      selectedCards: prev.selectedCards.includes(cardId)
        ? prev.selectedCards.filter((id) => id !== cardId)
        : prev.selectedCards.length < 3
          ? [...prev.selectedCards, cardId]
          : prev.selectedCards,
    }))
  }

  // Preview calculation
  const selectedCardsData = gameState.hand.filter((card) => gameState.selectedCards.includes(card.id))
  const {
    score: previewScore,
    handType,
    scoringCards,
  } = gameState.selectedCards.length > 0
    ? calculateScore(selectedCardsData)
    : { score: 0, handType: HAND_TYPES.high_card, scoringCards: [] }

  // Check if play button should be disabled
  const isPlayDisabled = gameState.selectedCards.length === 0 || gameState.playsUsed >= gameState.maxPlays

  // Initialize game function
  const initGame = () => {
    const newDeck = createDeck()
    setGameState({
      deck: newDeck.slice(9),
      hand: newDeck.slice(0, 9),
      discardPile: [],
      selectedCards: [],
      currentOpponent: 1,
      currentRound: 1,
      discardsUsed: 0,
      playsUsed: 0,
      maxPlays: 4,
      score: 0,
      targetScore: 100,
      phase: "playing",
      jokers: [],
      cardBoosts: {},
      handBoosts: {},
      handMultipliers: {},
      globalMultiplier: 0,
      globalScoreBonus: 0,
      appliedRewards: [],
    })
  }

  return (
    <div
      className="min-h-screen flex relative overflow-hidden transition-all duration-300"
      style={{
        background: `radial-gradient(circle at 50% 50%, 
          hsl(${backgroundHue}, 80%, 25%) 0%, 
          hsl(${(backgroundHue + 60) % 360}, 70%, 20%) 35%, 
          hsl(${(backgroundHue + 120) % 360}, 60%, 15%) 70%, 
          hsl(${(backgroundHue + 180) % 360}, 50%, 10%) 100%)`,
      }}
    >
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-white rounded-full opacity-30 pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `scale(${Math.random() * 0.5 + 0.5})`,
          }}
        />
      ))}

      {/* Main Game Area */}
      <div className="flex-1 p-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl animate-pulse">✨ ASTRAL ✨</h1>
          <div className="flex justify-center gap-6 text-white text-lg font-semibold flex-wrap">
            <div className="bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
              Opponent: {gameState.currentOpponent}/10
            </div>
            <div className="bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">Round: {gameState.currentRound}/3</div>
            <div className="bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
              Score: {gameState.score}/{gameState.targetScore}
            </div>
            <div className="bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
              Discards: {gameState.discardsUsed}/2
            </div>
            <div
              className={`px-4 py-2 rounded-lg backdrop-blur-sm ${
                gameState.playsUsed >= gameState.maxPlays
                  ? "bg-red-600/80 border-2 border-red-400"
                  : gameState.playsUsed >= gameState.maxPlays - 1
                    ? "bg-orange-600/80 border-2 border-orange-400"
                    : "bg-black/30"
              }`}
            >
              <div className="flex items-center gap-2">
                {gameState.playsUsed >= gameState.maxPlays && <AlertTriangle className="w-4 h-4 text-red-200" />}
                <span>
                  Plays: {gameState.playsUsed}/{gameState.maxPlays}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Preview */}
        {gameState.selectedCards.length > 0 && (
          <div className="text-center mb-6">
            <Card className="bg-gradient-to-r from-green-500/80 to-blue-500/80 border-2 border-white inline-block transform hover:scale-105 transition-all">
              <CardContent className="p-6">
                <div className="text-white text-xl font-bold mb-2">{handType.name}</div>
                <div className="text-white text-3xl font-bold drop-shadow-lg">{previewScore} points</div>
                {scoringCards.length > 0 && scoringCards.length < selectedCardsData.length && (
                  <div className="text-white/80 text-sm mt-2">
                    Scoring cards: {scoringCards.map((c) => `${c.rank}${c.suit}`).join(", ")}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Player Hand */}
        <div className="mb-8">
          <div className="flex justify-center gap-3 flex-wrap">
            {gameState.hand.map((card) => {
              const isScoring = scoringCards.some((sc) => sc.id === card.id)
              return (
                <Card
                  key={card.id}
                  onClick={() => toggleCardSelection(card.id)}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-4 ${
                    gameState.selectedCards.includes(card.id)
                      ? "bg-gradient-to-br from-yellow-300 to-orange-400 border-yellow-500 shadow-2xl scale-110 -translate-y-4 border-4"
                      : "bg-white border-gray-300 hover:shadow-xl border-2"
                  } ${
                    isScoring && gameState.selectedCards.includes(card.id) ? "ring-4 ring-green-400" : ""
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl font-bold ${getSuitColor(card.suit)} mb-2`}>{card.rank}</div>
                    <div className={`${getSuitColor(card.suit)} mb-2`}>{getSuitIcon(card.suit)}</div>
                    <div className="text-sm text-gray-600 font-semibold">
                      {card.baseValue + (gameState.cardBoosts[`${card.suit}-${card.rank}`] || 0)}
                    </div>
                    {isScoring && gameState.selectedCards.includes(card.id) && (
                      <div className="text-xs text-green-600 font-bold mt-1">SCORING</div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Game Controls */}
        {gameState.phase === "playing" && (
          <div className="flex justify-center gap-6 mb-8">
            <Button
              onClick={playCards}
              disabled={isPlayDisabled}
              className={`px-8 py-4 text-xl font-bold transform hover:scale-105 transition-all shadow-lg ${
                isPlayDisabled
                  ? "bg-gray-500 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              } text-white`}
            >
              {gameState.playsUsed >= gameState.maxPlays
                ? "No Plays Left"
                : `Play Cards (${gameState.selectedCards.length})`}
            </Button>
            <Button
              onClick={discardCards}
              disabled={gameState.selectedCards.length === 0 || gameState.discardsUsed >= 2}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-xl font-bold transform hover:scale-105 transition-all shadow-lg"
            >
              Discard ({gameState.selectedCards.length})
            </Button>
            <Button
              onClick={nextRound}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-xl font-bold transform hover:scale-105 transition-all shadow-lg"
            >
              Next Round
            </Button>
          </div>
        )}

        {/* Victory Screen */}
        {gameState.phase === "victory" && (
          <div className="text-center">
            <Card className="bg-gradient-to-br from-green-400/90 to-emerald-600/90 border-4 border-yellow-400 max-w-md mx-auto transform animate-bounce">
              <CardContent className="p-8">
                <Trophy className="w-20 h-20 text-yellow-300 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">VICTORY!</h2>
                <p className="text-green-100 mb-4 text-lg">You defeated opponent {gameState.currentOpponent}!</p>
                <p className="text-green-200 mb-6 text-sm">
                  Plays used: {gameState.playsUsed}/{gameState.maxPlays}
                </p>
                <Button
                  onClick={nextOpponent}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 text-lg transform hover:scale-105 transition-all"
                >
                  Continue Adventure
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Defeat Screen */}
        {gameState.phase === "defeat" && (
          <div className="text-center">
            <Card className="bg-gradient-to-br from-red-500/90 to-red-700/90 border-4 border-red-300 max-w-md mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white mb-4">DEFEAT</h2>
                <p className="text-red-100 mb-6 text-lg">You couldn't defeat opponent {gameState.currentOpponent}.</p>
                <Button
                  onClick={initGame}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 text-lg"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="bg-black/40 rounded-full h-6 overflow-hidden backdrop-blur-sm border-2 border-white/20">
            <div
              className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-full transition-all duration-1000 relative"
              style={{ width: `${Math.min((gameState.score / gameState.targetScore) * 100, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="text-center text-white mt-3 text-lg font-bold drop-shadow-lg">
            {gameState.score} / {gameState.targetScore} points
          </div>
        </div>
      </div>
    </div>
  )
}