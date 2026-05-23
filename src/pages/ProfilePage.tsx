import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import { useUserStore } from "@/store/useUserStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency, getSectorKey } from "@/lib/utils"
import { useTranslation } from "@/hooks/useTranslation"
import { LogOut, RefreshCw, Settings, Trophy, Target, Briefcase, Moon, Sun, Languages, Shield, Clock } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { profile, balance, xp, level, streak } = useUserStore()
  const { t, language, setLanguage } = useTranslation()
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate("/")
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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto space-y-6 pt-4 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t("nav.profile")} & {t("nav.settings")}</h1>
          <p className="text-muted-foreground mt-1">
            {language === "id" ? "Kelola informasi akun dan preferensi aplikasi Anda." : "Manage your account information and application preferences."}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Stats Card */}
        <motion.div variants={itemVariants} className="md:col-span-1">
          <Card className="glass-card border-primary/20 shadow-lg shadow-primary/5 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <CardContent className="pt-8 flex flex-col items-center text-center">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl mb-4">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{user?.nama || user?.username}</h2>
              <p className="text-muted-foreground mb-4">@{user?.username}</p>
              
              <div className="flex gap-2 mb-6">
                <Badge variant="default" className="px-3 py-1 bg-primary/20 text-primary hover:bg-primary/30 shadow-none">
                  <Trophy className="w-3 h-3 mr-1" /> Level {level}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/10">
                  🔥 {streak} {language === "id" ? "Hari" : "Days"}
                </Badge>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 mt-2">
                <div className="bg-muted/50 rounded-xl p-3 text-center border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Total XP</div>
                  <div className="font-bold text-lg text-primary">{xp}</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">{t("dashboard.virtualBalance")}</div>
                  <div className="font-bold text-[15px] truncate" title={formatCurrency(balance)}>
                    {formatCurrency(balance)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: Profile & Settings */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Investment Profile Summary */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card shadow-md">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{language === "id" ? "Profil Investasi" : "Investment Profile"}</CardTitle>
                      <CardDescription>{language === "id" ? "Gaya dan preferensi investasi Anda" : "Your investment style and preferences"}</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate("/onboarding")} className="h-8 text-xs font-semibold">
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    {language === "id" ? "Ubah Profil" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {!profile ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      {language === "id" ? "Profil investasi Anda belum diisi." : "Your investment profile has not been completed."}
                    </p>
                    <Button onClick={() => navigate("/onboarding")}>
                      {language === "id" ? "Isi Profil Sekarang" : "Complete Profile Now"}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-background/50">
                      <Shield className="h-5 w-5 text-indigo-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {language === "id" ? "Profil Risiko" : "Risk Profile"}
                        </div>
                        <div className="font-semibold capitalize">
                          {profile.riskTolerance === 'low' 
                            ? (language === "id" ? 'Konservatif (Rendah)' : 'Conservative (Low)') 
                            : profile.riskTolerance === 'medium' 
                              ? (language === "id" ? 'Moderat (Menengah)' : 'Moderate (Medium)') 
                              : (language === "id" ? 'Agresif (Tinggi)' : 'Aggressive (High)')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-background/50">
                      <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {language === "id" ? "Jangka Waktu" : "Time Horizon"}
                        </div>
                        <div className="font-semibold capitalize">
                          {profile.investmentHorizon === 'short' 
                            ? (language === "id" ? 'Pendek (< 1 Thn)' : 'Short-Term (< 1 Yr)') 
                            : profile.investmentHorizon === 'medium' 
                              ? (language === "id" ? 'Menengah (1-5 Thn)' : 'Medium-Term (1-5 Yrs)') 
                              : (language === "id" ? 'Panjang (> 5 Thn)' : 'Long-Term (> 5 Yrs)')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-background/50">
                      <Target className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {language === "id" ? "Tujuan Utama" : "Investment Goal"}
                        </div>
                        <div className="font-semibold capitalize">
                          {profile.investmentGoal === 'income' 
                            ? (language === "id" ? 'Dividen (Passive Income)' : 'Dividends (Passive Income)') 
                            : profile.investmentGoal === 'growth' 
                              ? (language === "id" ? 'Pertumbuhan (Capital Gain)' : 'Growth (Capital Gain)') 
                              : (language === "id" ? 'Spekulasi/Trading' : 'Speculation/Trading')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-background/50">
                      <Briefcase className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {language === "id" ? "Sektor Favorit" : "Favorite Sector"}
                        </div>
                        <div className="font-semibold capitalize">
                          {profile.preferredSectors?.[0]
                            ? (t(`screener.sectors.${getSectorKey(profile.preferredSectors[0])}`) as string) || profile.preferredSectors[0]
                            : (language === "id" ? 'Semua Sektor' : 'All Sectors')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card shadow-md">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-500/10 rounded-lg">
                    <Settings className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t("nav.settings")}</CardTitle>
                    <CardDescription>{language === "id" ? "Preferensi aplikasi" : "Application preferences"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="divide-y divide-border/50">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <Languages className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{t("common.language")}</div>
                        <div className="text-xs text-muted-foreground">
                          {language === "id" ? "Pilih bahasa antarmuka" : "Select interface language"}
                        </div>
                      </div>
                    </div>
                    <div className="flex bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setLanguage("id")}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                          language === "id" 
                            ? "bg-background text-foreground shadow-sm font-medium" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        ID
                      </button>
                      <button
                        onClick={() => setLanguage("en")}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                          language === "en" 
                            ? "bg-background text-foreground shadow-sm font-medium" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      {theme === "dark" ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
                      <div>
                        <div className="font-medium">
                          {language === "id" ? "Tema Tampilan" : "Appearance Theme"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {language === "id" ? "Sesuaikan dengan kenyamanan mata Anda" : "Adjust for your viewing comfort"}
                        </div>
                      </div>
                    </div>
                    <div className="flex bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setTheme("light")}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                          theme === "light" 
                            ? "bg-background text-foreground shadow-sm font-medium" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Sun className="h-3.5 w-3.5" /> Light
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                          theme === "dark" 
                            ? "bg-background text-foreground shadow-sm font-medium" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Moon className="h-3.5 w-3.5" /> Dark
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {t("nav.logout")}
            </Button>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}
