import { useState, useEffect, useRef } from "react"

// TODO: d8687f1r01qnvdehds2gd8687f1r01qnvdehds30
const FINNHUB_TOKEN = "d8687f1r01qnvdehds2gd8687f1r01qnvdehds30"

const QUOTE_URL = (symbol: string) =>
  `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_TOKEN}`

const PROFILE_URL = (symbol: string) =>
  `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_TOKEN}`

const CANDLE_URL = (symbol: string, from: number, to: number) =>
  `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_TOKEN}`

// How often to poll for a live quote update (30 seconds)
const POLL_INTERVAL_MS = 30_000

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

export interface FinnhubQuoteData {
  price: number
  change: number        // absolute change (d)
  changePercent: number // percent change (dp)
  high: number          // day high
  low: number           // day low
  open: number          // day open
  previousClose: number
  companyName: string
  lastUpdated: Date
}

export type FinnhubErrorType = "invalid_symbol" | "invalid_token" | "network" | "unknown"

export interface FinnhubError {
  type: FinnhubErrorType
  message: string
}

export type FinnhubStatus = "idle" | "loading" | "success" | "error"

export interface UseFinnhubQuoteResult {
  data: FinnhubQuoteData | null
  candleData: CandlePoint[]
  status: FinnhubStatus
  isLoading: boolean
  isError: boolean
  error: FinnhubError | null
  refetch: () => void
}

// ---------- Hook ----------

export function useFinnhubQuote(symbol: string): UseFinnhubQuoteResult {
  const [data, setData] = useState<FinnhubQuoteData | null>(null)
  const [candleData, setCandleData] = useState<CandlePoint[]>([])
  const [status, setStatus] = useState<FinnhubStatus>("idle")
  const [error, setError] = useState<FinnhubError | null>(null)
  const [fetchKey, setFetchKey] = useState(0)
  // Cache the company name so we don't lose it on poll refreshes
  const cachedCompanyName = useRef<string>("")

  const refetch = () => setFetchKey((k) => k + 1)

  // ── Initial full fetch: quote + profile + 90-day candles ──
  useEffect(() => {
    if (!symbol) return

    let cancelled = false

    const fetchAll = async () => {
      setStatus("loading")
      setError(null)

      try {
        const toTs = Math.floor(Date.now() / 1000)
        const fromTs = toTs - 90 * 24 * 60 * 60 // 90 days ago

        const [quoteRes, profileRes, candleRes] = await Promise.all([
          fetch(QUOTE_URL(symbol)),
          fetch(PROFILE_URL(symbol)),
          fetch(CANDLE_URL(symbol, fromTs, toTs)),
        ])

        // 401 / 403 → bad API key
        if (quoteRes.status === 401 || quoteRes.status === 403) {
          if (!cancelled) {
            setStatus("error")
            setError({
              type: "invalid_token",
              message: "Invalid API key. Please check your Finnhub token.",
            })
          }
          return
        }

        if (!quoteRes.ok) {
          if (!cancelled) {
            setStatus("error")
            setError({
              type: "network",
              message: `Failed to fetch data (HTTP ${quoteRes.status}). Please try again.`,
            })
          }
          return
        }

        const quote = await quoteRes.json()
        const profile: { name?: string } = profileRes.ok ? await profileRes.json() : {}
        const candle = candleRes.ok ? await candleRes.json() : null

        // All-zero quote → symbol not found on Finnhub
        if (quote.c === 0 && quote.h === 0 && quote.l === 0 && quote.pc === 0) {
          if (!cancelled) {
            setStatus("error")
            setError({
              type: "invalid_symbol",
              message: `Symbol "${symbol}" was not found on Finnhub. It may be unavailable or delisted.`,
            })
          }
          return
        }

        const companyName = profile.name ?? cachedCompanyName.current ?? symbol
        cachedCompanyName.current = companyName

        // Parse candle history (s === "ok" means data is present)
        if (candle && candle.s === "ok" && Array.isArray(candle.c) && candle.c.length > 0) {
          const points: CandlePoint[] = (candle.t as number[]).map((ts, i) => ({
            day: new Date(ts * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            price: candle.c[i],
            open: candle.o[i],
            high: candle.h[i],
            low: candle.l[i],
            volume: candle.v[i],
            timestamp: ts,
          }))
          if (!cancelled) setCandleData(points)
        }

        if (!cancelled) {
          setData({
            price: quote.c,
            change: quote.d ?? 0,
            changePercent: quote.dp ?? 0,
            high: quote.h,
            low: quote.l,
            open: quote.o,
            previousClose: quote.pc,
            companyName,
            lastUpdated: new Date(),
          })
          setStatus("success")
        }
      } catch {
        if (!cancelled) {
          setStatus("error")
          setError({
            type: "network",
            message: "Network error. Please check your internet connection.",
          })
        }
      }
    }

    fetchAll()
    return () => {
      cancelled = true
    }
  }, [symbol, fetchKey])

  // ── Live poll: refresh only the quote every 30 seconds ──
  useEffect(() => {
    if (!symbol || status !== "success") return

    let cancelled = false

    const pollQuote = async () => {
      try {
        const res = await fetch(QUOTE_URL(symbol))
        if (!res.ok || cancelled) return
        const quote = await res.json()
        // Ignore all-zero (market closed / no data)
        if (quote.c === 0 && quote.h === 0) return
        if (!cancelled) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  price: quote.c,
                  change: quote.d ?? 0,
                  changePercent: quote.dp ?? 0,
                  high: quote.h,
                  low: quote.l,
                  open: quote.o,
                  previousClose: quote.pc,
                  lastUpdated: new Date(),
                }
              : prev
          )
        }
      } catch {
        // Silently ignore poll errors — fallback data is still shown
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
    isLoading: status === "loading",
    isError: status === "error",
    error,
    refetch,
  }
}
