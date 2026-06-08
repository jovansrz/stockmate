import { useState, useMemo, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { stocksData } from "@/mocks/data"
import { formatRupiah, formatCurrency } from "@/lib/format"
import { useUserStore } from "@/store/useUserStore"
import { useTranslation } from "@/hooks/useTranslation"
import { useYahooFinance, type CandlePoint } from "@/hooks/useYahooFinance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  Newspaper, 
  Activity, 
  Wallet, 
  Info, 
  Star, 
  Minus, 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  Coins 
} from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { cn, getSectorKey } from "@/lib/utils"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"

// --- Real-time Simulated Exchange Rates (Central IDR) ---
const EXCHANGE_RATES: Record<string, number> = {
  IDR: 1,
  USD: 16000,
  HKD: 2000,
  JPY: 100,
  EUR: 17000,
  CHF: 18000
}

const getMarketFromTicker = (ticker: string): "IDX" | "US" | "Global" => {
  if (ticker.includes('.')) {
    if (ticker.endsWith('.JK')) return "IDX"
    return "Global"
  }
  const US_TICKERS = ["AAPL", "MSFT", "TSLA", "NVDA", "AMZN", "GOOG", "META", "NFLX", "AMD", "COIN"]
  if (US_TICKERS.includes(ticker)) return "US"
  return "IDX"
}

const getCurrencyFromTicker = (ticker: string): string => {
  if (ticker.endsWith('.T')) return "JPY"
  if (ticker.endsWith('.HK')) return "HKD"
  if (ticker.endsWith('.AS')) return "EUR"
  if (ticker.endsWith('.SW')) return "CHF"
  if (ticker.endsWith('.DE')) return "EUR"
  if (getMarketFromTicker(ticker) === "US") return "USD"
  return "IDR"
}

const generateHistory = (basePrice: number, isIdr: boolean = true) => {
  let price = basePrice * 0.9
  return Array.from({ length: 30 }).map((_, i) => {
    price = price + (Math.random() - 0.45) * basePrice * 0.03
    return {
      day: `H-${30 - i}`,
      price: isIdr ? Math.round(price) : Number(price.toFixed(2))
    }
  })
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const getTabs = (t: any) => [
  { id: "fundamental", label: t("stockDetail.tabs.fundamental") },
  { id: "ai", label: t("stockDetail.tabs.ai") },
  { id: "news", label: t("stockDetail.tabs.news") }
]

interface HistoryItem {
  day: string
  price: number
}

type ChartPoint = HistoryItem | CandlePoint

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: ChartPoint
  }>
  isPositive?: boolean
  currency?: string
}

const CustomTooltip = ({ active, payload, isPositive, currency = "IDR" }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const pt = payload[0].payload as CandlePoint
    const hasCandleData = "open" in pt && pt.open > 0
    const color = isPositive ? "#10b981" : "#ef4444"
    return (
      <div className="glass-card p-3 rounded-xl border border-white/10 shadow-xl min-w-[140px]">
        <p className="text-xs text-muted-foreground mb-2 font-medium">{pt.day}</p>
        <p className="font-black text-base mb-1" style={{ color }}>
          {formatCurrency(payload[0].value, currency)}
        </p>
        {hasCandleData && (
          <div className="border-t border-white/10 pt-2 mt-1 space-y-0.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Open</span>
              <span className="font-semibold">{formatCurrency(pt.open, currency)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-green-500">High</span>
              <span className="font-semibold text-green-500">{formatCurrency(pt.high, currency)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-red-500">Low</span>
              <span className="font-semibold text-red-500">{formatCurrency(pt.low, currency)}</span>
            </div>
          </div>
        )}
      </div>
    )
  }
  return null
}

export default function StockDetailPage() {
  const { ticker } = useParams()
  const navigate = useNavigate()
  const { balance, buyStock, sellStock, portfolio, watchlist = [], toggleWatchlist, profile } = useUserStore()
  const { t, language } = useTranslation()
  const TABS = getTabs(t)

  // --- Yahoo Finance live data ---
  const { data: yfData, candleData, isLoading: yfLoading, isError: yfError, error: yfErrorInfo, refetch: yfRefetch } = useYahooFinance(ticker ?? "")

  const baseStock = useMemo(() => {
    const found = stocksData.find((s) => s.ticker === ticker)
    if (found) return found

    if (yfLoading || yfData) {
      return {
        ticker: ticker || "",
        name: yfData?.companyName || ticker || "",
        sector: "Lainnya",
        price: yfData?.price || 0,
        changePercent: yfData?.changePercent || 0,
        volume: yfData?.volume || 0,
        avgVolume: yfData?.volume || 0,
        peRatio: yfData?.peRatio || null,
        pbv: yfData?.pbv || null,
        roe: yfData?.roe || null,
        dividendYield: yfData?.dividendYield || null,
        market: getMarketFromTicker(ticker || ""),
        currency: yfData?.currency || getCurrencyFromTicker(ticker || ""),
        trend: (yfData?.changePercent || 0) >= 0 ? "up" : "down",
        isSharia: false,
        board: "Utama",
        healthScore: 50,
        matchScore: 50,
        fundamentalSummary: { id: "Data analitik berbasis cloud dari Yahoo Finance.", en: "Cloud-based analytics data from Yahoo Finance." },
        description: { id: "Data saham global yang di-load secara dinamis. Informasi harga dan grafik bersifat real-time sesuai pasar.", en: "Dynamically loaded global stock data. Price and chart info are real-time based on the market." }
      }
    }
    return undefined
  }, [ticker, yfData, yfLoading])

  const stock = useMemo(() => {
    if (!baseStock) return undefined
    
    const peRatio = yfData?.peRatio ?? baseStock.peRatio
    const pbv = yfData?.pbv ?? baseStock.pbv
    const roe = yfData?.roe ?? baseStock.roe
    const dividendYield = yfData?.dividendYield ?? baseStock.dividendYield
    
    let hs = baseStock.healthScore
    if (yfData) {
      let s = 50
      if (peRatio > 0 && peRatio < 15) s += 15
      else if (peRatio >= 15 && peRatio < 25) s += 5
      if (pbv > 0 && pbv < 2) s += 15
      else if (pbv >= 2 && pbv < 5) s += 5
      if (roe && roe > 15) s += 15
      else if (roe && roe > 5) s += 5
      if (dividendYield && dividendYield > 3) s += 5
      hs = Math.min(100, s)
    }

    return {
      ...baseStock,
      peRatio,
      pbv,
      roe,
      dividendYield,
      healthScore: hs
    }
  }, [baseStock, yfData])

  // Native Currency Definitions
  const currency = yfData?.currency ?? getCurrencyFromTicker(ticker ?? "")
  const isIdr = currency === "IDR"
  const exchangeRate = EXCHANGE_RATES[currency.toUpperCase()] || 1

  // Live price: prefer Yahoo Finance, fallback to mock
  const livePrice = yfData?.price ?? stock?.price ?? 0
  const liveChangePercent = yfData?.changePercent ?? stock?.changePercent ?? 0
  const liveCompanyName = yfData?.companyName ?? stock?.name ?? ""
  const isPositive = liveChangePercent >= 0

  // Chart colors: green when up, red when down
  const chartColor = isPositive ? "#10b981" : "#ef4444"

  // Elapsed time since last quote update
  const [elapsedSec, setElapsedSec] = useState(0)
  useEffect(() => {
    if (!yfData?.lastUpdated) return
    setElapsedSec(0)
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [yfData?.lastUpdated])

  useEffect(() => {
    const mainElement = document.querySelector("main")
    if (mainElement) {
      mainElement.scrollTop = 0
    }
    window.scrollTo(0, 0)
  }, [ticker])

  // Calculate dynamic match score if profile exists
  const dynamicMatchScore = useMemo(() => {
    if (!stock) return 0
    if (!profile) return stock.matchScore

    const mappedPreferredSector = 
      profile.preferredSectors?.[0] === "Finance" ? "Perbankan" :
      profile.preferredSectors?.[0] === "Technology" ? "Teknologi" :
      profile.preferredSectors?.[0] === "Consumer Goods" ? "Consumer" :
      profile.preferredSectors?.[0] === "Energy" ? "Energi" : ""

    let score = 40

    if (stock.sector === mappedPreferredSector) {
      score += 35
    }

    if (profile.riskTolerance === "low") {
      if (stock.healthScore >= 85) score += 15
      else if (stock.healthScore >= 75) score += 8
    } else if (profile.riskTolerance === "medium") {
      if (stock.healthScore >= 75) score += 15
    } else if (profile.riskTolerance === "high") {
      if (stock.sector === "Teknologi" || stock.healthScore < 70 || stock.volume > stock.avgVolume) {
        score += 15
      }
    }

    if (profile.investmentGoal === "income") {
      if (stock.dividendYield >= 4) score += 10
      else if (stock.dividendYield >= 2) score += 5
    } else if (profile.investmentGoal === "growth") {
      if (stock.roe >= 15) score += 10
    } else if (profile.investmentGoal === "speculation") {
      if (stock.volume > stock.avgVolume || stock.trend === "up") score += 10
    }

    return Math.min(100, score)
  }, [profile, stock])

  const isWatchlisted = stock ? watchlist.includes(stock.ticker) : false

  const handleWatchlistToggle = () => {
    if (!stock) return
    toggleWatchlist(stock.ticker)
    const isAdding = !isWatchlisted
    if (isAdding) {
      toast.success(
        language === "id" 
          ? `Ditambahkan ke Watchlist ⭐` 
          : `Added to Watchlist ⭐`,
        { description: `${stock.ticker} berhasil disimpan.` }
      )
    } else {
      toast.info(
        language === "id" 
          ? `Dihapus dari Watchlist ❌` 
          : `Removed from Watchlist ❌`,
        { description: `${stock.ticker} dihapus dari pantauan.` }
      )
    }
  }

  const [history, setHistory] = useState<HistoryItem[]>(() =>
    stock ? generateHistory(stock.price, isIdr) : []
  )
  const [activeTab, setActiveTab] = useState("fundamental")
  const [prevTicker, setPrevTicker] = useState(ticker)

  if (ticker !== prevTicker) {
    setPrevTicker(ticker)
    if (stock) {
      setHistory(generateHistory(stock.price, isIdr))
    }
  }

  const chartData: ChartPoint[] = candleData.length > 0 ? candleData : (yfLoading ? [] : history)

  if (!stock) {
    return (
      <div className="flex flex-col items-center justify-center py-32 h-full text-center space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight">{t("stockDetail.notFound")}</h1>
        <Button onClick={() => navigate(-1)} variant="outline" className="glass">{t("common.back")}</Button>
      </div>
    )
  }

  const [lotCount, setLotCount] = useState(1)
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy")

  const ownedLots = stock ? (portfolio[stock.ticker] || 0) : 0

  // Simulated Buying / Selling Logic with Currency Conversion
  const nativeCost = livePrice * 100 * lotCount
  const idrEquivalent = nativeCost * exchangeRate

  const handleBuy = async () => {
    const currentBalance = isNaN(Number(balance)) ? 10000000 : Number(balance);
    if (currentBalance >= idrEquivalent) {
      // Pass the fully converted Rupiah price as the third parameter to ensure correct deduction
      const success = await buyStock(stock.ticker, lotCount, idrEquivalent)
      if (success) {
        toast.success(
          (t("stockDetail.buySuccess") as string)
            .replace("{ticker}", stock.ticker)
            .replace("{lotCount}", lotCount.toString()), 
          {
            description: language === "id"
              ? `Saldo virtual dipotong ${formatRupiah(idrEquivalent)} (${formatCurrency(nativeCost, currency)})`
              : `Balance deducted by ${formatRupiah(idrEquivalent)} (${formatCurrency(nativeCost, currency)})`
          }
        )
      } else {
        toast.error(language === "id" ? "Gagal memproses transaksi. Cek koneksi Anda." : "Transaction failed. Please check your connection.")
      }
    } else {
      toast.error(t("stockDetail.insufficientBalance"), {
        description: (t("stockDetail.needAmount") as string)
          .replace("{amount}", formatRupiah(idrEquivalent))
          .replace("{lotCount}", lotCount.toString())
      })
    }
  }

  const handleSell = async () => {
    if (ownedLots < lotCount) {
      toast.error(language === "id" ? "Lot tidak cukup untuk dijual" : "Not enough lots to sell")
      return
    }
    const success = await sellStock(stock.ticker, lotCount, idrEquivalent)
    if (success) {
      toast.success(
        (t("stockDetail.sellSuccess") as string)
          .replace("{ticker}", stock.ticker)
          .replace("{lotCount}", lotCount.toString()), 
        {
          description: language === "id"
            ? `Saldo virtual bertambah ${formatRupiah(idrEquivalent)} (${formatCurrency(nativeCost, currency)})`
            : `Balance increased by ${formatRupiah(idrEquivalent)} (${formatCurrency(nativeCost, currency)})`
        }
      )
    } else {
      toast.error(language === "id" ? "Gagal menjual saham" : "Failed to sell stock")
    }
  }

  return (
    <motion.div 
      className="space-y-6 pb-8 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-muted/50 glass">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              {stock.ticker}
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-3">
                {(t(`screener.sectors.${getSectorKey(stock.sector)}`) as string) || stock.sector}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold border-muted/50 text-muted-foreground uppercase">
                {getMarketFromTicker(stock.ticker)} Market
              </Badge>
            </h1>
            <p className="text-muted-foreground font-medium text-sm md:text-base">{liveCompanyName || stock.name}</p>
          </div>
        </div>

        {/* Watchlist Toggle */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleWatchlistToggle} 
          className={cn("glass font-bold flex items-center gap-2", isWatchlisted && "border-primary text-primary")}
        >
          <Star className={cn("h-4.5 w-4.5", isWatchlisted && "fill-primary text-primary")} />
          <span>{isWatchlisted ? (language === "id" ? "Terpantau" : "Watchlisted") : (language === "id" ? "Pantau" : "Watch")}</span>
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="glass-card overflow-hidden">
              <CardHeader className="pb-0 border-b border-white/5 bg-muted/10">

                {/* --- Yahoo Finance error banner --- */}
                {yfError && yfErrorInfo && (
                  <div className="flex items-start gap-3 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="font-semibold block">
                        {(language === "id" ? "Gagal mengambil data dari Yahoo Finance" : "Failed to fetch data from Yahoo Finance")}
                      </span>
                      <span className="text-red-400/70 text-xs">{yfErrorInfo}</span>
                    </div>
                    <button
                      onClick={yfRefetch}
                      className="shrink-0 p-1 rounded hover:bg-red-500/20 transition-colors cursor-pointer"
                      title="Retry"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-end pb-4">
                  <div>
                    <CardDescription className="text-xs uppercase tracking-wider font-semibold mb-1">
                      {t("stockDetail.lastPrice")}
                      {yfLoading && (
                        <span className="ml-2 inline-flex items-center gap-1 text-primary/70 normal-case font-normal">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          {language === "id" ? "Memuat..." : "Loading..."}
                        </span>
                      )}
                      {!yfLoading && yfData && (
                        <span className="ml-2 text-emerald-500/80 normal-case font-normal text-[10px]">
                          ● Live
                        </span>
                      )}
                    </CardDescription>

                    {/* Price in Native Currency */}
                    {yfLoading ? (
                      <div className="h-10 w-48 rounded-lg bg-muted/50 animate-pulse mt-1" />
                    ) : (
                      <CardTitle className="text-4xl font-black tracking-tight flex items-baseline gap-2">
                        <span>{formatCurrency(livePrice, currency)}</span>
                        {!isIdr && (
                          <span className="text-sm font-semibold text-muted-foreground">
                            ≈ {formatRupiah(livePrice * exchangeRate)}
                          </span>
                        )}
                      </CardTitle>
                    )}
                  </div>

                  {/* Change percent badge */}
                  {yfLoading ? (
                    <div className="h-8 w-20 rounded-lg bg-muted/50 animate-pulse" />
                  ) : (
                    <div className={cn(
                      "flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg backdrop-blur-md",
                      isPositive ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
                    )}>
                      {isPositive
                        ? <TrendingUp className="h-5 w-5" />
                        : <TrendingDown className="h-5 w-5" />}
                      <span>
                        {isPositive ? "+" : ""}{liveChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* --- Last updated / live indicator strip --- */}
                {yfData && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 pt-3 pb-0 gap-2">
                    <div className="flex items-center gap-3">
                      {/* OHLC quick stats in Native Currency */}
                      <div className="flex items-center gap-3.5 text-xs flex-wrap">
                        <span className="text-muted-foreground">
                          O <span className="text-foreground font-semibold">{formatCurrency(yfData.open, currency)}</span>
                        </span>
                        <span className="text-green-500">
                          H <span className="font-semibold">{formatCurrency(yfData.high, currency)}</span>
                        </span>
                        <span className="text-red-500">
                          L <span className="font-semibold">{formatCurrency(yfData.low, currency)}</span>
                        </span>
                        <span className="text-muted-foreground">
                          PC <span className="text-foreground font-semibold">{formatCurrency(yfData.previousClose, currency)}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-1.5 text-xs text-muted-foreground">
                      <span className="relative flex h-2 w-2">
                        <span className={cn(
                          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                          isPositive ? "bg-green-500" : "bg-red-500"
                        )} />
                        <span className={cn(
                          "relative inline-flex rounded-full h-2 w-2",
                          isPositive ? "bg-green-500" : "bg-red-500"
                        )} />
                      </span>
                      <Clock className="h-3 w-3" />
                      <span>
                        {elapsedSec < 5 ? "Just updated" : `${elapsedSec}s ago`}
                      </span>
                    </div>
                  </div>
                )}

                {/* --- Area Chart --- */}
                <div className="h-[310px] w-full pt-4 pr-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.4}
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        tickFormatter={(v) => {
                          if (isIdr) {
                            return v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
                          }
                          return `${v.toFixed(1)}`
                        }}
                        width={48}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={
                          <CustomTooltip isPositive={isPositive} currency={currency} />
                        }
                        cursor={{
                          stroke: chartColor,
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                          opacity: 0.6,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={chartColor}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: chartColor,
                          stroke: "hsl(var(--background))",
                          strokeWidth: 2,
                        }}
                        fillOpacity={1}
                        fill={`url(#${isPositive ? "colorGreen" : "colorRed"})`}
                        isAnimationActive={candleData.length === 0}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex space-x-1 p-1 bg-muted/30 glass rounded-xl mb-4 relative z-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative px-4 py-2.5 text-sm font-semibold transition-colors rounded-lg flex-1 z-10 outline-none cursor-pointer",
                    activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-md shadow-primary/20"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="min-h-[250px] relative">
              <AnimatePresence mode="wait">
                {activeTab === "fundamental" && (
                  <motion.div
                    key="fundamental"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 absolute inset-0"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "P/E Ratio", value: stock.peRatio !== null && stock.peRatio !== undefined ? `${stock.peRatio.toFixed(2)}x` : "-" },
                        { label: "PBV", value: stock.pbv !== null && stock.pbv !== undefined ? `${stock.pbv.toFixed(2)}x` : "-" },
                        { label: "ROE", value: stock.roe !== null && stock.roe !== undefined ? `${stock.roe.toFixed(2)}%` : "-" },
                        { label: "Yield", value: stock.dividendYield !== null && stock.dividendYield !== undefined ? `${stock.dividendYield.toFixed(2)}%` : "-" }
                      ].map((stat, i) => (
                        <Card key={i} className="glass-card text-center hover:bg-primary/5 transition-colors">
                          <CardContent className="p-4">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</div>
                            <div className="text-xl font-bold">{stat.value}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Card className="glass-card">
                      <CardContent className="p-5 text-sm leading-relaxed text-muted-foreground">
                        <strong className="text-foreground font-semibold mr-2">{t("stockDetail.description")}</strong>
                        {stock.description[language as keyof typeof stock.description]}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                
                {activeTab === "ai" && (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <Card className="glass-card border-primary/30 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-primary">
                          <Lightbulb className="h-5 w-5" />
                          {t("stockDetail.aiAnalysis")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm relative z-10">
                        <p className="leading-relaxed">{stock.fundamentalSummary[language as keyof typeof stock.fundamentalSummary]}</p>
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                          <span className="font-medium">{t("stockDetail.profileMatch")}</span>
                          <span className="font-bold text-primary text-lg">{dynamicMatchScore}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground/70 italic flex items-start gap-2">
                          <Info className="h-4 w-4 shrink-0" />
                          <span>{t("stockDetail.disclaimer")}</span>
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "news" && (
                  <motion.div
                    key="news"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 absolute inset-0"
                  >
                    <Card className="glass-card hover:border-primary/30 transition-colors cursor-pointer group">
                      <CardContent className="p-4 flex gap-4 items-center">
                        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                          <Newspaper className="h-6 w-6 text-primary shrink-0" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-base group-hover:text-primary transition-colors">{(t("stockDetail.news1Title") as string).replace("{ticker}", stock.ticker)}</h4>
                          <p className="text-xs font-medium text-muted-foreground mt-1">{t("stockDetail.news1Time")}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="glass-card hover:border-primary/30 transition-colors cursor-pointer group">
                      <CardContent className="p-4 flex gap-4 items-center">
                        <div className="p-3 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-colors">
                          <Activity className="h-6 w-6 text-orange-500 shrink-0" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                            {(t("stockDetail.news2Title") as string).replace("{sector}", (t(`screener.sectors.${getSectorKey(stock.sector)}`) as string) || stock.sector)}
                          </h4>
                          <p className="text-xs font-medium text-muted-foreground mt-1">{t("stockDetail.news2Time")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* --- Sidebar Simulated Trading Column --- */}
        <div className="lg:sticky lg:top-6 lg:self-start z-10">
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-primary/20 shadow-xl shadow-primary/5">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    {t("stockDetail.tradingSim")}
                  </CardTitle>
                </div>
                
                <div className="flex bg-muted/50 p-1 rounded-xl glass border border-border/50">
                  <button
                    onClick={() => setTradeMode("buy")}
                    className={cn(
                      "flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer",
                      tradeMode === "buy" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t("stockDetail.buyTab")}
                  </button>
                  <button
                    onClick={() => setTradeMode("sell")}
                    className={cn(
                      "flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer",
                      tradeMode === "sell" ? "bg-red-500 text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t("stockDetail.sellTab")}
                  </button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  {tradeMode === "buy" ? (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">{t("dashboard.virtualBalance")}</span>
                      <span className="font-black text-base">{formatRupiah(balance)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">{t("stockDetail.ownedLots")}</span>
                      <span className={cn("font-black text-base", ownedLots > 0 ? "text-primary" : "")}>{ownedLots} Lot</span>
                    </div>
                  )}

                  {/* Lot Native Price Stat */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-medium">{t("stockDetail.pricePerLot")} <span className="text-[9px] font-semibold">(100 lbr)</span></span>
                      <span className="font-bold text-foreground">{formatCurrency(livePrice * 100, currency)}</span>
                    </div>
                    {!isIdr && (
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold border-t border-border/10 pt-1 mt-1">
                        <span>Konversi IDR</span>
                        <span>≈ {formatRupiah(livePrice * 100 * exchangeRate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity selector */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-muted-foreground">{t("stockDetail.lotAmount")}</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full cursor-pointer"
                        onClick={() => setLotCount(Math.max(1, lotCount - 1))}
                        disabled={lotCount <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-black w-6 text-center text-sm">{lotCount}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full cursor-pointer"
                        onClick={() => setLotCount(lotCount + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Multi-currency Conversion Summary Info */}
                  <div className="flex flex-col gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-muted-foreground">{language === "id" ? "Total Harga" : "Total Cost"}</span>
                      <span className="font-black text-foreground text-sm">{formatCurrency(nativeCost, currency)}</span>
                    </div>
                    {!isIdr && (
                      <>
                        <div className="flex justify-between items-center text-xs border-t border-border/20 pt-1.5 mt-0.5">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Coins className="h-3.5 w-3.5 text-primary shrink-0" />
                            {language === "id" ? "Konversi (IDR)" : "Converted (IDR)"}
                          </span>
                          <span className="font-black text-primary text-base">{formatRupiah(idrEquivalent)}</span>
                        </div>
                        <div className="text-[9px] text-muted-foreground/80 text-right italic font-medium">
                          {language === "id" 
                            ? `Estimasi Kurs: 1 ${currency} = ${formatRupiah(exchangeRate)}`
                            : `Estimated Rate: 1 ${currency} = ${formatRupiah(exchangeRate)}`}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {tradeMode === "buy" ? (
                  <Button 
                    className="w-full h-12 text-md font-extrabold bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 shadow-md shadow-primary/30 cursor-pointer" 
                    onClick={handleBuy}
                  >
                    {(t("stockDetail.buyLot") as string).replace("{lotCount}", lotCount.toString())}
                  </Button>
                ) : (
                  <Button 
                    className={cn(
                      "w-full h-12 text-md font-extrabold shadow-md transition-all duration-200 cursor-pointer",
                      ownedLots < lotCount 
                        ? "bg-muted text-muted-foreground cursor-not-allowed border-none" 
                        : "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30"
                    )}
                    onClick={handleSell}
                    disabled={ownedLots < lotCount}
                  >
                    {(t("stockDetail.sellLot") as string).replace("{lotCount}", lotCount.toString())}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
