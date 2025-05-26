"use client"

import React, { useEffect, useState } from "react"

interface NewsItem {
  id: string
  title: string
  url: string
  body: string
  imageurl: string
  published_on: number
  source_info: {
    name: string
    img: string
  }
}

export default function TrendingMemes() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    fetch("https://min-api.cryptocompare.com/data/v2/news/")
      .then(res => res.json())
      .then(data => setNews(data.Data.slice(0, 5))) // Show top 5
  }, [])

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <div
          key={item.id}
          className="bg-[#0B1211]/60 border border-[#9FFFE0]/30 rounded-lg p-4 flex flex-col md:flex-row gap-4"
        >
              <img
            src={item.imageurl}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
              />
          <div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#9FFFE0] hover:underline"
            >
              {item.title}
            </a>
            <div className="text-xs text-[#9FFFE0]/70 mt-1">
              {new Date(item.published_on * 1000).toLocaleString()} | {item.source_info.name}
            </div>
            <div className="text-[#9FFFE0]/80 mt-2 line-clamp-3">{item.body}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

