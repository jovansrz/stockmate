import { useState, useEffect } from "react"
import api from "../services/api"

// ---------- Public types ----------
export interface CandlePoint {
  day: string       // formatted date label e.g. "May 15"
  price: number     // close price (used as the chart Y value)
  open: number
  high: number
  low: number
  volume: number
  timestamp: number // unix seconds
}

export interface YahooQuoteData {
  price: number
  change: number        
  changePercent: number 
  high: number          
  low: number           
  open: number          
  previousClose: number
  companyName: string
  lastUpdated: Date
  peRatio?: number | null
  pbv?: number | null
  roe?: number | null
  dividendYield?: number | null
  currency?: string | null
  volume?: number | null
}

export type FetchStatus = "idle" | "loading" | "success" | "error"

export interface UseYahooFinanceResult {
  data: YahooQuoteData | null
  candleData: CandlePoint[]
  status: FetchStatus
  isLoading: boolean
  isError: boolean
  error: string | null
  refetch: () => void
}

const POLL_INTERVAL_MS = 1_000

// ---------- Hook ----------
export function useYahooFinance(symbol: string): UseYahooFinanceResult {
  const [data, setData] = useState<YahooQuoteData | null>(null)
  const [candleData, setCandleData] = useState<CandlePoint[]>([])
  const [status, setStatus] = useState<FetchStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  const refetch = () => setFetchKey((k) => k + 1)

  useEffect(() => {
    if (!symbol) return

    let cancelled = false

    const fetchAll = async () => {
      setStatus("loading")
      setError(null)

      try {
        const [quoteRes, chartRes] = await Promise.all([
          api.get(`/market/quote/${symbol}`),
          api.get(`/market/chart/${symbol}`)
        ])

        if (!quoteRes.data.success) {
          if (!cancelled) {
            setStatus("error")
            setError(`Failed to fetch quote data.`)
          }
          return
        }

        const quote = quoteRes.data.data
        const chartData = chartRes.data.data

        if (!quote || quote.regularMarketPrice === undefined) {
          if (!cancelled) {
            setStatus("error")
            setError(`Symbol "${symbol}" not found or no data.`)
          }
          return
        }

        if (chartData && Array.isArray(chartData) && chartData.length > 0) {
          const points: CandlePoint[] = chartData.map((c: any) => ({
            day: new Date(c.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            price: c.close,
            open: c.open,
            high: c.high,
            low: c.low,
            volume: c.volume,
            timestamp: new Date(c.date).getTime() / 1000,
          }))
          if (!cancelled) setCandleData(points)
        }

        if (!cancelled) {
          setData({
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            high: quote.regularMarketDayHigh,
            low: quote.regularMarketDayLow,
            open: quote.regularMarketOpen,
            previousClose: quote.regularMarketPreviousClose,
            companyName: quote.longName || quote.shortName || symbol,
            peRatio: quote.trailingPE,
            pbv: quote.priceToBook,
            roe: quote.returnOnEquity ? quote.returnOnEquity * 100 : null,
            dividendYield: quote.trailingAnnualDividendYield ? quote.trailingAnnualDividendYield * 100 : (quote.dividendYield ? quote.dividendYield : null),
            currency: quote.currency,
            volume: quote.regularMarketVolume,
            lastUpdated: new Date(),
          })
          setStatus("success")
        }
      } catch (err: any) {
        if (!cancelled) {
          setStatus("error")
          setError(err.message || "Network error. Please try again.")
        }
      }
    }

    fetchAll()
    return () => {
      cancelled = true
    }
  }, [symbol, fetchKey])

  // Poll for quote updates
  useEffect(() => {
    if (!symbol || status !== "success") return

    let cancelled = false

    const pollQuote = async () => {
      try {
        const quoteRes = await api.get(`/market/quote/${symbol}`)
        if (cancelled || !quoteRes.data.success) return
        
        const quote = quoteRes.data.data
        if (!quote || quote.regularMarketPrice === undefined) return
        
        if (!cancelled) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  price: quote.regularMarketPrice,
                  change: quote.regularMarketChange,
                  changePercent: quote.regularMarketChangePercent,
                  high: quote.regularMarketDayHigh,
                  low: quote.regularMarketDayLow,
                  open: quote.regularMarketOpen,
                  previousClose: quote.regularMarketPreviousClose,
                  peRatio: quote.trailingPE,
                  pbv: quote.priceToBook,
                  roe: quote.returnOnEquity ? quote.returnOnEquity * 100 : null,
                  dividendYield: quote.trailingAnnualDividendYield ? quote.trailingAnnualDividendYield * 100 : (quote.dividendYield ? quote.dividendYield : null),
                  currency: quote.currency || prev.currency,
                  volume: quote.regularMarketVolume,
                  lastUpdated: new Date(),
                }
              : prev
          )
        }
      } catch (err) {
        // Silently ignore poll errors
      }
    }

    const id = setInterval(pollQuote, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [symbol, status])

  return {
    data,
    candleData,
    status,
    isLoading: status === "loading" || status === "idle",
    isError: status === "error",
    error,
    refetch,
  }
}
