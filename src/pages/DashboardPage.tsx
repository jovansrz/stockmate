import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useUserStore } from "@/store/useUserStore"
import { useTranslation } from "@/hooks/useTranslation"
import { formatRupiah, formatPercent } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, TrendingDown, BookOpen, BarChart3, Flame, Award, ArrowRight, Smile, Frown, Meh, Sparkles, RefreshCw, AlertCircle } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import api from "@/services/api"
import { getSectorKey } from "@/lib/utils"

// --- Types ---
interface MarketStock {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface MarketOverview {
  ihsg: number
  ihsgChange: number
  topGainers: MarketStock[]
  topLosers: MarketStock[]
  marketMood: string
  activeSector: string
  aiInsight: { id: string; en: string }
}

const POLL_INTERVAL_MS = 60_000 // Refresh market overview every 60 seconds

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

export default function DashboardPage() {
  const { balance, xp, level, streak, checkStreak } = useUserStore()
  const { t, language } = useTranslation()

  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [sparklineData, setSparklineData] = useState<{ value: number }[]>([])

  const fetchOverview = async () => {
    try {
      setIsError(false)
      const [res, chartRes] = await Promise.allSettled([
        api.get("/market/overview"),
        api.get("/market/chart/^JKSE")
      ])
      
      if (res.status === "fulfilled" && res.value.data.success) {
        const data: MarketOverview = res.value.data.data
        setMarketOverview(data)
        
        let loadedRealChart = false
        if (chartRes.status === "fulfilled" && chartRes.value.data.success) {
          const chartPoints = chartRes.value.data.data
          if (Array.isArray(chartPoints) && chartPoints.length > 0) {
            setSparklineData(chartPoints.map((c: any) => ({ value: c.close })))
            loadedRealChart = true
          }
        }
        
        if (!loadedRealChart) {
          // Fallback to random visual points if chart is not available
          const base = data.ihsg
          setSparklineData(
            Array.from({ length: 8 }, (_, i) => ({
              value: Math.round(base + (Math.random() - 0.5) * base * 0.002 * i)
            }))
          )
        }
      } else {
        setIsError(true)
      }
    } catch (err) {
      console.error("Failed to fetch market overview:", err)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStreak()
    fetchOverview()
    const id = setInterval(fetchOverview, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const ihsgPositive = (marketOverview?.ihsgChange ?? 0) >= 0
  const moodIcon = marketOverview?.marketMood?.includes("Positif") ? (
    <Smile className="h-6 w-6 text-green-500" />
  ) : marketOverview?.marketMood?.includes("Negatif") ? (
    <Frown className="h-6 w-6 text-red-500" />
  ) : (
    <Meh className="h-6 w-6 text-yellow-500" />
  )
  const moodColor = marketOverview?.marketMood?.includes("Positif")
    ? "text-green-500"
    : marketOverview?.marketMood?.includes("Negatif")
    ? "text-red-500"
    : "text-yellow-500"
  const moodBg = marketOverview?.marketMood?.includes("Positif")
    ? "bg-green-500/10"
    : marketOverview?.marketMood?.includes("Negatif")
    ? "bg-red-500/10"
    : "bg-yellow-500/10"

  return (
    <motion.div 
      className="space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={itemVariants} className="flex flex-col gap-2 relative">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
          {t("dashboard.greeting")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("dashboard.welcomeMsg")}
        </p>
      </motion.header>

      {/* Saldo & Progress */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <Card className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground border-none shadow-xl shadow-primary/20 overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary-foreground/80 uppercase tracking-wider">
                <Wallet className="h-4 w-4" />
                {t("dashboard.virtualBalance")}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black tracking-tight">{formatRupiah(balance)}</div>
              <p className="text-sm mt-3 text-primary-foreground/80 bg-black/10 inline-block px-3 py-1 rounded-full backdrop-blur-md">
                {t("dashboard.useBalance")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                <Award className="h-4 w-4 text-primary" />
                {t("dashboard.level")} {level}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">{xp} XP</span>
                <Badge variant="secondary" className="flex gap-1 items-center bg-orange-500/10 text-orange-500 border-none px-3 py-1">
                  <Flame className="h-4 w-4" />
                  {streak} {t("dashboard.streak")}
                </Badge>
              </div>
              <Progress value={(xp % 100)} className="h-3 rounded-full bg-muted/50 overflow-hidden" indicatorClassName="bg-gradient-to-r from-primary to-indigo-400" />
              <p className="text-xs mt-3 text-muted-foreground font-medium text-right">
                {100 - (xp % 100)} {t("dashboard.xpToNextLevel")} {level + 1}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1 h-14 text-md group shadow-lg shadow-primary/20" size="lg">
          <Link to="/screener">
            <BarChart3 className="mr-2 h-5 w-5" />
            {t("nav.market")}
            <ArrowRight className="ml-auto h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 h-14 text-md glass group hover:bg-primary/5 hover:text-primary border-primary/20" size="lg">
          <Link to="/learn">
            <BookOpen className="mr-2 h-5 w-5 text-primary" />
            {t("dashboard.continueLearning")}
            <ArrowRight className="ml-auto h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
          </Link>
        </Button>
      </motion.div>

      {/* Combined Market Overview Section */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mt-8 mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{t("dashboard.marketOverview")}</h2>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{t("common.today")}</Badge>
            {isLoading ? (
              <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/20 flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Loading...
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 hidden sm:flex items-center gap-1">
                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                {t("common.live")}
              </Badge>
            )}
          </div>
        </div>

        {/* Error state */}
        {isError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{language === "id" ? "Gagal memuat data pasar real-time." : "Failed to load real-time market data."}</span>
            <button onClick={fetchOverview} className="p-1 rounded hover:bg-red-500/20 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-9">
          {/* IHSG Card (With Sparkline) */}
          <Card className="glass-card overflow-hidden lg:col-span-3">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("dashboard.ihsgIndex")}</p>
                {isLoading ? (
                  <div className="h-9 w-36 rounded-lg bg-muted/50 animate-pulse" />
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tight">
                      {marketOverview?.ihsg?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "—"}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${ihsgPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {marketOverview ? formatPercent(marketOverview.ihsgChange) : "—"}
                    </span>
                  </div>
                )}
              </div>
              <div className="h-10 w-full mt-4 -mx-2">
                {sparklineData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={ihsgPositive ? "#22c55e" : "#ef4444"} 
                        strokeWidth={2} 
                        dot={false} 
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Market Mood Card */}
          <Card className="glass-card border-border/50 lg:col-span-2">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider">{t("dashboard.marketMood")}</p>
                  {isLoading ? (
                    <div className="h-7 w-24 rounded-lg bg-muted/50 animate-pulse" />
                  ) : (
                    <h3 className={`text-2xl font-black ${moodColor}`}>
                      {language === "id"
                        ? marketOverview?.marketMood ?? "—"
                        : (marketOverview?.marketMood?.includes("Sangat Positif") ? "Very Positive"
                          : marketOverview?.marketMood?.includes("Positif") ? "Positive"
                          : marketOverview?.marketMood?.includes("Sangat Negatif") ? "Very Negative"
                          : marketOverview?.marketMood?.includes("Negatif") ? "Negative"
                          : "Neutral")}
                    </h3>
                  )}
                </div>
                <div className={`${moodBg} p-3 rounded-full`}>
                  {moodIcon}
                </div>
              </div>
              <div className="pt-3 border-t border-border/10 flex justify-between items-center gap-4 flex-wrap">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-[9px] uppercase tracking-wider">{t("dashboard.activeSector")}</p>
                {isLoading ? (
                  <div className="h-5 w-16 rounded bg-muted/50 animate-pulse" />
                ) : (
                  <p className="text-md font-black">
                    {marketOverview?.activeSector 
                      ? (t(`screener.sectors.${getSectorKey(marketOverview.activeSector)}`) as string) || marketOverview.activeSector
                      : "—"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Gainers */}
          <Card className="glass-card lg:col-span-2">
            <CardContent className="p-5 flex flex-col h-full">
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-4 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {t("dashboard.topGainers")}
              </p>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-4 rounded bg-muted/50 animate-pulse" />
                  ))
                ) : (
                  (marketOverview?.topGainers ?? []).slice(0, 3).map((stock) => (
                    <div key={stock.ticker} className="flex justify-between items-center text-xs">
                      <span className="font-bold">{stock.ticker}</span>
                      <span className="font-bold text-green-500">+{stock.changePercent?.toFixed(2)}%</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Losers */}
          <Card className="glass-card lg:col-span-2">
            <CardContent className="p-5 flex flex-col h-full">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-4 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                {t("dashboard.topLosers")}
              </p>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-4 rounded bg-muted/50 animate-pulse" />
                  ))
                ) : (
                  (marketOverview?.topLosers ?? []).slice(0, 3).map((stock) => (
                    <div key={stock.ticker} className="flex justify-between items-center text-xs">
                      <span className="font-bold">{stock.ticker}</span>
                      <span className="font-bold text-red-500">{stock.changePercent?.toFixed(2)}%</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* AI Prediction Insight Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-none bg-gradient-to-r from-indigo-500/10 via-primary/5 to-transparent overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="h-24 w-24 text-primary" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{t("dashboard.insightToday")}</h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black tracking-widest">
                {t("dashboard.aiPrediction")}
              </Badge>
            </div>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted/50 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-muted/50 animate-pulse" />
              </div>
            ) : (
              <p className="text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4 py-1 italic">
                "{marketOverview?.aiInsight?.[language as "id" | "en"] ?? (language === "id" ? "Data pasar sedang dimuat..." : "Loading market insight...")}"
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              <div className="flex h-1.5 w-1.5 rounded-full bg-primary"></div>
              {t("dashboard.aiBasedOn")}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
