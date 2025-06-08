"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Flame, Coins, Receipt, Zap, Users } from "lucide-react"

export default function TokenDistribution() {
  return (
    <Card className="bg-[#0B1211]/60 border-[#9FFFE0]/30 backdrop-blur-sm w-full">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Total Supply */}
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#9FFFE0] flex items-center justify-center flex-shrink-0">
              <Coins className="h-5 w-5 text-[#0B1211]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#9FFFE0] mb-1">Total Supply</h3>
              <p className="text-2xl font-bold text-[#9FFFE0]">1,000,000,000 $HYPER NEUROX</p>
              <p className="text-[#9FFFE0]/70 mt-1">
                Fixed supply with no additional tokens being minted, ensuring scarcity and long-term value.
              </p>
            </div>
          </div>

          <div className="border-t border-[#9FFFE0]/30 my-4"></div>

          {/* Liquidity */}
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#9FFFE0] flex items-center justify-center flex-shrink-0">
              <Flame className="h-5 w-5 text-[#0B1211]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#9FFFE0] mb-1">Liquidity</h3>
              <p className="text-2xl font-bold text-[#9FFFE0]">Pool 100% Burned</p>
              <p className="text-[#9FFFE0]/70 mt-1">
                Liquidity tokens are permanently removed from circulation, creating a stable price floor and preventing
                rug pulls.
              </p>
            </div>
          </div>

          <div className="border-t border-[#9FFFE0]/30 my-4"></div>

          {/* Transaction Tax */}
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#9FFFE0] flex items-center justify-center flex-shrink-0">
              <Receipt className="h-5 w-5 text-[#0B1211]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#9FFFE0] mb-1">Transaction Tax</h3>
              <p className="text-2xl font-bold text-[#9FFFE0]">0% Buy / 0% Sell</p>
              <p className="text-[#9FFFE0]/70 mt-1">
                Zero tax policy ensures that 100% of transactions go directly to buying or selling HYPER NEUROX tokens,
                maximizing value for holders.
              </p>
            </div>
          </div>

          <div className="border-t border-[#9FFFE0]/30 my-4"></div>

          {/* Community Incentives */}
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#9FFFE0] flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-[#0B1211]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#9FFFE0] mb-1">Community Incentives</h3>
              <p className="text-[#9FFFE0]/70">
                Earn rewards through active participation and engagement in the HYPER NEUROX ecosystem. Community members are
                rewarded for contributing to platform growth and development. (coming soon)
              </p>
            </div>
          </div>

          <div className="border-t border-[#9FFFE0]/30 my-4"></div>

          {/* Staking & Rewards */}
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#9FFFE0] flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-[#0B1211]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#9FFFE0] mb-1">Staking & Rewards</h3>
              <p className="text-[#9FFFE0]/70">
                Users can stake $HYPER NEUROX tokens to earn passive income through our staking program. Longer staking
                periods yield higher rewards, incentivizing long-term holding. (Coming Soon)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

