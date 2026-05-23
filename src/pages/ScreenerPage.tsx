import { useState, useMemo, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "@/hooks/useTranslation"
import { stocksData } from "@/mocks/data"
import { useUserStore } from "@/store/useUserStore"
import { formatCurrency } from "@/lib/format"
import api from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Brain, 
  CheckCircle,
  HelpCircle,
  Star,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getSectorKey } from "@/lib/utils"

// --- Helper to determine market from ticker ---
const getMarketFromTicker = (ticker: string): "IDX" | "US" | "Global" => {
  if (ticker.includes('.')) {
    if (ticker.endsWith('.JK')) return "IDX"
    return "Global"
  }
  const US_TICKERS = ["AAPL", "MSFT", "TSLA", "NVDA", "AMZN", "GOOG", "META", "NFLX", "AMD", "COIN"]
  if (US_TICKERS.includes(ticker)) return "US"
  return "IDX"
}

// --- Helper to get default currency from ticker ---
const getCurrencyFromTicker = (ticker: string): string => {
  if (ticker.endsWith('.T')) return "JPY"
  if (ticker.endsWith('.HK')) return "HKD"
  if (ticker.endsWith('.AS')) return "EUR"
  if (ticker.endsWith('.SW')) return "CHF"
  if (ticker.endsWith('.DE')) return "EUR"
  if (getMarketFromTicker(ticker) === "US") return "USD"
  return "IDR"
}

// --- Skeleton components for premium initial loading experience ---
const StockCardSkeleton = () => (
  <Card className="glass-card h-full flex flex-col justify-between border border-border/20 shadow-lg relative overflow-hidden animate-pulse">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-6 w-16 bg-muted/60 rounded animate-pulse" />
          <div className="h-4 w-24 bg-muted/40 rounded animate-pulse" />
        </div>
        <div className="space-y-2 text-right flex flex-col items-end">
          <div className="h-3 w-16 bg-muted/30 rounded animate-pulse" />
          <div className="h-6 w-10 bg-muted/50 rounded animate-pulse mt-1" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-muted/30 rounded animate-pulse" />
      </div>
      <Separator className="bg-border/30" />
      <div className="flex justify-between items-center">
        <div className="h-4 w-20 bg-muted/40 rounded animate-pulse" />
        <div className="h-5 w-24 bg-muted/50 rounded animate-pulse" />
      </div>
      <div className="h-9 w-full bg-muted/40 rounded-lg animate-pulse" />
    </CardContent>
  </Card>
)

const TableRowSkeleton = () => (
  <tr className="border-b border-border/20 animate-pulse">
    <td className="py-4 px-4"><div className="h-5 w-16 bg-muted/40 rounded" /></td>
    <td className="py-4 px-4 hidden sm:table-cell"><div className="h-4 w-32 bg-muted/30 rounded" /></td>
    <td className="py-4 px-4"><div className="h-5 w-20 bg-muted/40 rounded ml-auto" /></td>
    <td className="py-4 px-4"><div className="h-5 w-12 bg-muted/40 rounded ml-auto" /></td>
    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-12 bg-muted/30 rounded mx-auto" /></td>
    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-10 bg-muted/30 rounded mx-auto" /></td>
    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-10 bg-muted/30 rounded mx-auto" /></td>
    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-10 bg-muted/30 rounded mx-auto" /></td>
    <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-12 bg-muted/30 rounded mx-auto" /></td>
    <td className="py-4 px-4"><div className="h-6 w-6 bg-muted/40 rounded-full ml-auto" /></td>
  </tr>
)

export default function ScreenerPage() {
  const { t, language } = useTranslation()
  const { profile, watchlist = [] } = useUserStore()
  
  // Custom Controls State
  const [searchQuery, setSearchQuery] = useState("")
  const [activeMarket, setActiveMarket] = useState<"all" | "IDX" | "US" | "Global">("IDX")
  const [viewMode, setViewMode] = useState<"table" | "card">("table")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Live price & ratio data map
  const [livePrices, setLivePrices] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const res = await api.get("/market/screener")
        if (res.data.success) {
          const map: Record<string, any> = {}
          res.data.data.forEach((q: any) => {
            map[q.ticker] = {
              price: q.price,
              changePercent: q.changePercent,
              volume: q.volume,
              peRatio: q.peRatio,
              pbv: q.pbv,
              roe: q.roe,
              dividendYield: q.dividendYield,
              market: q.market,
              currency: q.currency
            }
          })
          setLivePrices(map)
        }
      } catch (e) {
        // Silently fallback to mock data
      } finally {
        setIsLoading(false)
      }
    }
    fetchLivePrices()
    const id = setInterval(fetchLivePrices, 30_000)
    return () => clearInterval(id)
  }, [])

  // Click-and-drag horizontal scroll handlers for category pills
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDown, setIsDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDown(true)
    setIsDragging(false)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDown(false)
  }

  const handleMouseUp = () => {
    setTimeout(() => {
      setIsDown(false)
    }, 50)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
    if (Math.abs(x - startX) > 5) {
      setIsDragging(true)
    }
  }

  // List of categories (sectors + all + watchlist)
  const categories = useMemo(() => [
    { id: "all", label: t("screener.allSectors") || "Semua Sektor" },
    { id: "watchlist", label: `${t("screener.watchlistTab") || "Watchlist"} (${watchlist.length})` },
    { id: "Perbankan", label: t("screener.sectors.perbankan") || "Perbankan" },
    { id: "Consumer", label: t("screener.sectors.consumer") || "Consumer Goods" },
    { id: "Energi", label: t("screener.sectors.energi") || "Energi" },
    { id: "Telekomunikasi", label: t("screener.sectors.telekomunikasi") || "Telekomunikasi" },
    { id: "Teknologi", label: t("screener.sectors.teknologi") || "Teknologi" },
    { id: "Kesehatan", label: t("screener.sectors.kesehatan") || "Kesehatan" },
    { id: "Properti", label: t("screener.sectors.properti") || "Properti" },
    { id: "Industri", label: t("screener.sectors.industri") || "Industri" },
    { id: "Lainnya", label: t("screener.sectors.lainnya") || "Lainnya" }
  ], [watchlist.length, t])

  // Map live data into stocksData
  const liveStocksData = useMemo(() => {
    return stocksData.map(stock => {
      const live = livePrices[stock.ticker]
      
      const peRatio = live ? (live.peRatio ?? stock.peRatio) : stock.peRatio
      const pbv = live ? (live.pbv ?? stock.pbv) : stock.pbv
      const roe = live ? (live.roe ?? stock.roe) : stock.roe
      const dividendYield = live ? (live.dividendYield ?? stock.dividendYield) : stock.dividendYield
      const market = live ? (live.market ?? getMarketFromTicker(stock.ticker)) : getMarketFromTicker(stock.ticker)
      const currency = live ? (live.currency ?? getCurrencyFromTicker(stock.ticker)) : getCurrencyFromTicker(stock.ticker)

      let hs = stock.healthScore
      if (live) {
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
        ...stock,
        price: live ? (live.price ?? stock.price) : stock.price,
        changePercent: live ? (live.changePercent ?? stock.changePercent) : stock.changePercent,
        volume: live ? (live.volume ?? stock.volume) : stock.volume,
        peRatio,
        pbv,
        roe,
        dividendYield,
        healthScore: hs,
        market,
        currency
      }
    })
  }, [livePrices])

  // Custom Match Score calculation based on investment profile
  const recommendedStocks = useMemo(() => {
    if (!profile) {
      return liveStocksData
        .filter(s => ["BBCA", "ICBP", "TLKM"].includes(s.ticker))
        .map(stock => ({
          ...stock,
          customMatchScore: 90,
          matchReasons: language === "id" 
            ? ["Sangat defensif untuk pemula", "Fundamental sangat stabil", "Likuiditas tinggi"]
            : ["Highly defensive for beginners", "Extremely stable fundamentals", "High liquidity"]
        }))
    }

    const mappedPreferredSector = 
      profile.preferredSectors?.[0] === "Finance" ? "Perbankan" :
      profile.preferredSectors?.[0] === "Technology" ? "Teknologi" :
      profile.preferredSectors?.[0] === "Consumer Goods" ? "Consumer" :
      profile.preferredSectors?.[0] === "Energy" ? "Energi" : ""

    return liveStocksData.map(stock => {
      let score = 40
      const reasons: string[] = []

      if (stock.sector === mappedPreferredSector) {
        score += 35
        reasons.push(language === "id" ? "Sektor pilihan Anda" : "Your preferred sector")
      }

      if (profile.riskTolerance === "low") {
        if (stock.healthScore >= 85) {
          score += 15
          reasons.push(language === "id" ? "Defensif & sangat aman" : "Defensive & very safe")
        } else if (stock.healthScore >= 75) {
          score += 8
        }
      } else if (profile.riskTolerance === "medium") {
        if (stock.healthScore >= 75) {
          score += 15
          reasons.push(language === "id" ? "Keseimbangan risiko moderat" : "Moderate risk balance")
        }
      } else if (profile.riskTolerance === "high") {
        if (stock.sector === "Teknologi" || stock.healthScore < 70 || stock.volume > stock.avgVolume) {
          score += 15
          reasons.push(language === "id" ? "Potensi pertumbuhan tinggi" : "High growth potential")
        }
      }

      if (profile.investmentGoal === "income") {
        if (stock.dividendYield >= 4) {
          score += 10
          reasons.push(language === "id" ? "Dividen tinggi untuk passive income" : "High dividend for passive income")
        } else if (stock.dividendYield >= 2) {
          score += 5
        }
      } else if (profile.investmentGoal === "growth") {
        if (stock.roe >= 15) {
          score += 10
          reasons.push(language === "id" ? "Profitabilitas (ROE) sangat kuat" : "Strong profitability (ROE)")
        }
      } else if (profile.investmentGoal === "speculation") {
        if (stock.volume > stock.avgVolume || stock.trend === "up") {
          score += 10
          reasons.push(language === "id" ? "Momentum volume & tren naik" : "Upward trend & volume momentum")
        }
      }

      return {
        ...stock,
        customMatchScore: Math.min(100, score),
        matchReasons: reasons.length > 0 ? reasons.slice(0, 3) : [language === "id" ? "Fundamental solid" : "Solid fundamentals"]
      }
    })
    .sort((a, b) => b.customMatchScore - a.customMatchScore)
    .slice(0, 3)
  }, [profile, language, liveStocksData])

  // Filter stocks by active category + active market segment + search
  const filteredStocks = useMemo(() => {
    let list = liveStocksData

    // 1. Filter by Market Segment
    if (activeMarket !== "all") {
      list = list.filter(s => s.market === activeMarket)
    }

    // 2. Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(s => 
        s.ticker.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q)
      )
    }

    // 3. Filter by Category Pill
    if (selectedCategory === "watchlist") {
      list = list.filter(s => watchlist.includes(s.ticker))
    } else if (selectedCategory !== "all") {
      list = list.filter(s => s.sector === selectedCategory)
    }

    return list
  }, [activeMarket, searchQuery, selectedCategory, watchlist, liveStocksData])

  return (
    <motion.div 
      className="pb-16 max-w-6xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-primary via-indigo-400 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            {t("screener.title")}
          </h1>
          <p className="text-muted-foreground font-medium mt-1 text-sm md:text-base">
            {language === "id" 
              ? "Analisis fundamental real-time, rekomendasi AI personal, dan screening multi-negara." 
              : "Real-time fundamental analysis, personalized AI matching, and global market screening."}
          </p>
        </div>
      </header>

      {/* AI Recommendation Banner */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h2 className="text-xl font-bold tracking-tight">
            {t("screener.recTitle") || "Rekomendasi Teratas Untuk Anda"}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            <StockCardSkeleton />
            <StockCardSkeleton />
            <StockCardSkeleton />
          </div>
        ) : !profile ? (
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className="glass-card bg-gradient-to-r from-primary/10 via-indigo-500/5 to-background border border-primary/20 p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6 justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <Badge className="bg-primary/20 text-primary border-none font-bold uppercase tracking-wider text-[10px] px-2.5 py-1">
                AI MATCHMAKING
              </Badge>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                {t("screener.profileEmpty") || "Temukan Saham Terbaik Sesuai Profil Anda"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("screener.profileEmptyDesc") || "Lengkapi profil investasi Anda dan AI kami akan menghitung skor kecocokan personal dari fundamental emiten terdaftar."}
              </p>
            </div>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/95 hover:to-indigo-500/95 font-bold shadow-lg shadow-primary/25 shrink-0 w-full md:w-auto">
              <Link to="/profile" className="flex items-center gap-2 justify-center">
                <Brain className="h-5 w-5" />
                {t("screener.fillProfile") || "Lengkapi Profil"}
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {recommendedStocks.map((stock) => (
              <motion.div
                key={stock.ticker}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="glass-card h-full flex flex-col justify-between border-primary/25 shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-indigo-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="pb-3 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <CardTitle className="text-xl font-black tracking-tight">
                            {stock.ticker}
                          </CardTitle>
                          {stock.isSharia && <ShieldCheck className="h-4.5 w-4.5 text-green-500 shrink-0" />}
                          <Badge className="bg-muted/80 text-muted-foreground border-none font-bold text-[9px] px-1.5 py-0.5 ml-1">
                            {stock.market}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs font-semibold mt-0.5 truncate max-w-[150px]">{stock.name}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-muted-foreground font-semibold">{t("screener.profileMatch") || "Kecocokan"}</div>
                        <Badge className="bg-primary/20 text-primary border-none font-bold text-xs px-2 mt-0.5">
                          {stock.customMatchScore}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      {stock.matchReasons.map((reason, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-border/30" />

                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-muted-foreground">{t("stockDetail.lastPrice") || "Harga Terakhir"}</span>
                      <span className="font-bold">
                        {formatCurrency(livePrices[stock.ticker]?.price ?? stock.price, stock.currency)}
                      </span>
                    </div>

                    <Button asChild size="sm" className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border-none font-bold group/btn">
                      <Link to={`/stocks/${stock.ticker}`} className="flex items-center justify-center gap-1.5">
                        {t("screener.viewDetail") || "Lihat Detail"}
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform animate-none" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Modern Stockbit Control Hub */}
      <section className="space-y-4">
        <div className="glass p-4.5 rounded-2xl border border-border/40 shadow-md space-y-4">
          
          {/* Row 1: Market Tabs + View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            
            {/* Market Tabs */}
            <div className="flex gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/30 w-full sm:w-auto overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveMarket("IDX")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeMarket === "IDX" 
                    ? "bg-background text-foreground shadow-sm scale-102"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🇮🇩 Indonesia (IDX)
              </button>
              <button
                onClick={() => setActiveMarket("US")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeMarket === "US" 
                    ? "bg-background text-foreground shadow-sm scale-102"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🇺🇸 Amerika Serikat (US)
              </button>
              <button
                onClick={() => setActiveMarket("Global")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeMarket === "Global" 
                    ? "bg-background text-foreground shadow-sm scale-102"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🌐 Global Market
              </button>
              <button
                onClick={() => setActiveMarket("all")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeMarket === "all" 
                    ? "bg-background text-foreground shadow-sm scale-102"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🌎 Semua Pasar
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/30 self-end sm:self-auto">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === "table" 
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table View"
              >
                <List className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === "card" 
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Card View"
              >
                <LayoutGrid className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Row 2: Search + Info */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder={language === "id" ? "Cari kode saham atau nama emiten..." : "Search ticker or company name..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border/40 bg-background/50 focus:bg-background focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/30 px-3 py-2 rounded-xl border border-border/20 shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{language === "id" ? `Ditemukan: ${filteredStocks.length} Saham` : `Found: ${filteredStocks.length} Stocks`}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Sector Category Pill Hub */}
      <section className="space-y-6">
        {/* Scrollable Categories Row */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto gap-2 pb-3 pt-1 scrollbar-none scroll-fade-edges -mx-4 px-4 md:mx-0 md:px-0 select-none ${
            isDown ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollBehavior: isDown ? 'auto' : 'smooth' }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={(e) => {
                  if (isDragging) {
                    e.preventDefault()
                    e.stopPropagation()
                    return
                  }
                  setSelectedCategory(cat.id)
                }}
                className={`flex items-center px-4 py-2.5 rounded-full text-xs font-bold border transition-all shrink-0 cursor-pointer ${
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-102"
                    : "bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/60 glass"
                }`}
              >
                {cat.id === "watchlist" && <Star className={`h-3.5 w-3.5 mr-1 shrink-0 ${isSelected ? "fill-primary-foreground" : "fill-none"}`} />}
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Display Panel */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${selectedCategory}-${activeMarket}-${viewMode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {isLoading ? (
              viewMode === "table" ? (
                <div className="glass border border-border/40 rounded-2xl overflow-hidden shadow-lg">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/20 text-left">
                        <th className="py-3 px-4 h-6 w-16" />
                        <th className="py-3 px-4 hidden sm:table-cell h-6 w-32" />
                        <th className="py-3 px-4 h-6 w-20" />
                        <th className="py-3 px-4 h-6 w-12" />
                        <th className="py-3 px-4 hidden md:table-cell" />
                        <th className="py-3 px-4 hidden md:table-cell" />
                        <th className="py-3 px-4 hidden md:table-cell" />
                        <th className="py-3 px-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <TableRowSkeleton key={i} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <StockCardSkeleton key={i} />
                  ))}
                </div>
              )
            ) : filteredStocks.length > 0 ? (
              viewMode === "table" ? (
                /* Sleek Stockbit-style Table Layout */
                <div className="glass border border-border/30 rounded-2xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full border-collapse text-left text-sm font-medium">
                      <thead>
                        <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground font-semibold text-[10px] uppercase tracking-wider select-none">
                          <th className="py-3.5 px-4 font-bold">{language === "id" ? "Kode Saham" : "Ticker"}</th>
                          <th className="py-3.5 px-4 font-bold hidden sm:table-cell">{language === "id" ? "Nama Emiten" : "Company Name"}</th>
                          <th className="py-3.5 px-4 font-bold text-right">{language === "id" ? "Harga" : "Price"}</th>
                          <th className="py-3.5 px-4 font-bold text-right">{language === "id" ? "Perubahan" : "Change"}</th>
                          <th className="py-3.5 px-4 font-bold text-center hidden md:table-cell">Health</th>
                          <th className="py-3.5 px-4 font-bold text-center hidden md:table-cell">PE Ratio</th>
                          <th className="py-3.5 px-4 font-bold text-center hidden md:table-cell">PBV</th>
                          <th className="py-3.5 px-4 font-bold text-center hidden md:table-cell">ROE</th>
                          <th className="py-3.5 px-4 font-bold text-center hidden lg:table-cell">Yield</th>
                          <th className="py-3.5 px-4 font-bold text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {filteredStocks.map((stock) => {
                          const live = livePrices[stock.ticker]
                          const price = live?.price ?? stock.price
                          const change = live?.changePercent ?? stock.changePercent
                          const currency = stock.currency || "IDR"

                          return (
                            <tr 
                              key={stock.ticker} 
                              className="hover:bg-muted/15 transition-colors group cursor-pointer border-b border-border/10 last:border-none"
                              onClick={(e) => {
                                const target = e.target as HTMLElement
                                if (target.closest('a') || target.closest('button')) return
                                window.location.href = `/stocks/${stock.ticker}`
                              }}
                            >
                              {/* Ticker Symbol */}
                              <td className="py-4 px-4 font-black text-foreground text-sm tracking-tight">
                                <div className="flex items-center gap-1.5">
                                  <Link to={`/stocks/${stock.ticker}`} className="hover:text-primary transition-colors">
                                    {stock.ticker}
                                  </Link>
                                  {stock.isSharia && <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />}
                                </div>
                                <span className="block sm:hidden text-[10px] text-muted-foreground font-semibold truncate max-w-[90px] mt-0.5">{stock.name}</span>
                              </td>

                              {/* Company Name */}
                              <td className="py-4 px-4 text-xs font-semibold text-muted-foreground hidden sm:table-cell truncate max-w-[200px]">
                                {stock.name}
                              </td>

                              {/* Price */}
                              <td className="py-4 px-4 font-black text-right text-foreground">
                                {formatCurrency(price, currency)}
                              </td>

                              {/* % Change */}
                              <td className="py-4 px-4 text-right">
                                <div className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full ${
                                  change > 0 
                                    ? "bg-green-500/10 text-green-400" 
                                    : change < 0 
                                      ? "bg-red-500/10 text-red-400" 
                                      : "bg-muted text-muted-foreground"
                                }`}>
                                  {change > 0 ? <TrendingUp className="h-3 w-3 shrink-0" /> : change < 0 ? <TrendingDown className="h-3 w-3 shrink-0" /> : null}
                                  {change > 0 ? "+" : ""}{change.toFixed(2)}%
                                </div>
                              </td>

                              {/* Health Score */}
                              <td className="py-4 px-4 text-center hidden md:table-cell">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-extrabold ${
                                  stock.healthScore >= 80 
                                    ? "text-green-400 bg-green-500/5 border border-green-500/10" 
                                    : stock.healthScore >= 60 
                                      ? "text-yellow-400 bg-yellow-500/5 border border-yellow-500/10" 
                                      : "text-red-400 bg-red-500/5 border border-red-500/10"
                                }`}>
                                  {stock.healthScore}
                                </span>
                              </td>

                              {/* PE Ratio */}
                              <td className="py-4 px-4 text-center font-bold text-xs hidden md:table-cell">
                                {stock.peRatio !== null && stock.peRatio !== undefined ? `${stock.peRatio.toFixed(1)}x` : "-"}
                              </td>

                              {/* PBV */}
                              <td className="py-4 px-4 text-center font-bold text-xs hidden md:table-cell">
                                {stock.pbv !== null && stock.pbv !== undefined ? `${stock.pbv.toFixed(2)}x` : "-"}
                              </td>

                              {/* ROE */}
                              <td className="py-4 px-4 text-center font-bold text-xs hidden md:table-cell">
                                {stock.roe !== null && stock.roe !== undefined ? `${stock.roe.toFixed(1)}%` : "-"}
                              </td>

                              {/* Dividend Yield */}
                              <td className="py-4 px-4 text-center font-bold text-xs hidden lg:table-cell text-emerald-400">
                                {stock.dividendYield !== null && stock.dividendYield !== undefined ? `${stock.dividendYield.toFixed(1)}%` : "-"}
                              </td>

                              {/* Details Button */}
                              <td className="py-4 px-4 text-right">
                                <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full group-hover:translate-x-0.5 transition-transform duration-300">
                                  <Link to={`/stocks/${stock.ticker}`}>
                                    <ChevronRight className="h-4.5 w-4.5" />
                                  </Link>
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Card Listing Grid Layout */
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredStocks.map((stock) => {
                    const live = livePrices[stock.ticker]
                    const price = live?.price ?? stock.price
                    const change = live?.changePercent ?? stock.changePercent
                    const currency = stock.currency || "IDR"

                    return (
                      <motion.div
                        key={stock.ticker}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Card className="glass-card h-full flex flex-col justify-between group overflow-hidden relative border border-border/50">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          
                          <CardHeader className="pb-3 relative">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-2xl font-black flex items-center gap-2 tracking-tight">
                                  <Link to={`/stocks/${stock.ticker}`} className="hover:text-primary transition-colors">
                                    {stock.ticker}
                                  </Link>
                                  {stock.isSharia && <ShieldCheck className="h-5 w-5 text-green-500 shrink-0" />}
                                  <Badge className="bg-muted/60 text-muted-foreground border-none font-bold text-[9px] px-1.5">
                                    {stock.market}
                                  </Badge>
                                </CardTitle>
                                <CardDescription className="mt-1 font-semibold text-xs text-muted-foreground max-w-[150px] truncate">{stock.name}</CardDescription>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-black tracking-tight">
                                  {formatCurrency(price, currency)}
                                </div>
                                <div className={`text-xs flex items-center justify-end gap-1 font-bold mt-1 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {change > 0 ? <TrendingUp className="h-3.5 w-3.5 shrink-0" /> : <TrendingDown className="h-3.5 w-3.5 shrink-0" />}
                                  {change > 0 ? '+' : ''}{change.toFixed(2)}%
                                </div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                              <div className="flex gap-1.5 flex-wrap">
                                <Badge variant="secondary" className="text-[10px] font-bold bg-muted/60">{stock.board}</Badge>
                                <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary">
                                 {(t(`screener.sectors.${getSectorKey(stock.sector)}`) as string) || stock.sector}
                                </Badge>
                                {stock.rsi <= 30 && <Badge className="text-[10px] bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-none font-bold">Oversold</Badge>}
                                {stock.rsi >= 70 && <Badge className="text-[10px] bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-none font-bold">Overbought</Badge>}
                                {stock.dividendYield > 4 && <Badge className="text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-none font-bold">High Yield</Badge>}
                              </div>

                              {/* Health Score */}
                              <div className="bg-muted/20 p-3.5 rounded-xl border border-white/5 text-xs">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold flex items-center gap-1"><Activity className="h-3.5 w-3.5 text-primary shrink-0"/> Health Score</span>
                                  <span className={`font-black ${stock.healthScore >= 80 ? 'text-green-400' : stock.healthScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {stock.healthScore}/100
                                  </span>
                                </div>
                                <Progress value={stock.healthScore} className="h-1.5" indicatorClassName={stock.healthScore >= 80 ? "bg-green-500" : stock.healthScore >= 60 ? "bg-yellow-500" : "bg-red-500"} />
                              </div>

                              {/* Ratios Grid */}
                              <div className="grid grid-cols-4 gap-1 text-center text-xs bg-background/20 p-2.5 rounded-xl border border-white/5">
                                <div>
                                  <div className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 font-bold">PER</div>
                                  <div className="font-black text-xs">{stock.peRatio !== null && stock.peRatio !== undefined ? `${stock.peRatio.toFixed(1)}x` : '-'}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 font-bold">PBV</div>
                                  <div className="font-black text-xs">{stock.pbv !== null && stock.pbv !== undefined ? `${stock.pbv.toFixed(2)}x` : '-'}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 font-bold">ROE</div>
                                  <div className="font-black text-xs">{stock.roe !== null && stock.roe !== undefined ? `${stock.roe.toFixed(1)}%` : '-'}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 font-bold">Yield</div>
                                  <div className="font-black text-xs">{stock.dividendYield !== null && stock.dividendYield !== undefined ? `${stock.dividendYield.toFixed(1)}%` : '-'}</div>
                                </div>
                              </div>
                            </div>

                            <Button asChild className="w-full mt-4 group/btn font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all" variant="default">
                              <Link to={`/stocks/${stock.ticker}`}>
                                {t("screener.viewDetail") || "Lihat Detail"}
                                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              )
            ) : (
              /* Empty State */
              <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed rounded-2xl glass bg-background/30 max-w-md mx-auto p-6 space-y-4">
                {selectedCategory === "watchlist" ? (
                  <>
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                      <Star className="h-10 w-10 shrink-0" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">{t("screener.watchlistEmpty") || "Watchlist Anda Kosong"}</h3>
                    <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                      {t("screener.watchlistEmptyDesc") || "Tambahkan saham ke watchlist Anda dari halaman detail saham untuk memantau pergerakan harga mereka secara terpusat."}
                    </p>
                    <Button variant="outline" className="glass font-bold" onClick={() => setSelectedCategory("all")}>
                      {language === "id" ? "Eksplor Semua Saham" : "Explore All Stocks"}
                    </Button>
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-12 w-12 text-muted-foreground opacity-50 shrink-0" />
                    <h3 className="text-lg font-semibold">{language === "id" ? "Tidak ada saham" : "No stocks found"}</h3>
                    <p className="text-muted-foreground text-xs">
                      {language === "id" 
                        ? "Tidak ada saham yang cocok dengan pencarian dan filter Anda di pasar ini." 
                        : "There are no stocks matching your search and filter criteria in this market."}
                    </p>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </motion.div>
  )
}
