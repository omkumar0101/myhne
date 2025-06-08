import type { NextApiRequest, NextApiResponse } from 'next'
import Parser from 'rss-parser'

const parser = new Parser()
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const feed = await parser.parseURL('https://www.coindesk.com/arc/outboundfeeds/rss')
  res.status(200).json({ items: feed.items.slice(0, 5) })
} 