import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { modulesData } from "@/mocks/data"
import { useLearningStore } from "@/store/useLearningStore"
import { useUserStore } from "@/store/useUserStore"
import { useTranslation } from "@/hooks/useTranslation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, CheckCircle2, Trophy, BookOpen, AlertCircle, 
  ChevronLeft, ChevronRight, Building, TrendingUp, BarChart3, Users, 
  ShieldCheck, Landmark, Coins, FileText, Layers, Activity, HelpCircle,
  GraduationCap, Sparkles
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function ModulePage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  
  const { markCompleted, progress } = useLearningStore()
  const { addXp, interactWithModule } = useUserStore()
  const { t, language } = useTranslation()
  
  const [showQuiz, setShowQuiz] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeInstrumentTab, setActiveInstrumentTab] = useState(0)

  // Quiz states supporting multiple questions
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})

  const allSubModules = modulesData.flatMap(m => m.subModules)
  const module = allSubModules.find(m => m.id === moduleId)
  const isCompleted = progress[moduleId || ""]?.completed

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground opacity-50" />
        <h1 className="text-3xl font-extrabold tracking-tight">{t("module.notFound")}</h1>
        <Button onClick={() => navigate("/learn")} variant="outline" className="glass">{t("module.backToLearn")}</Button>
      </div>
    )
  }

  // Support both single-question and multi-question schemas dynamically
  const questions = (module.quiz as any).questions || [
    {
      question: (module.quiz as any).question,
      options: (module.quiz as any).options,
      correctAnswer: (module.quiz as any).correctAnswer
    }
  ]

  const handleQuizSubmit = () => {
    if (selectedAnswers[activeQuestionIdx] === undefined) {
      toast.error(t("module.selectAnswer") || "Pilih jawaban terlebih dahulu", {
        description: t("module.mustSelectDesc") || "Anda harus memilih salah satu jawaban."
      })
      return
    }

    // Grade all questions
    let allCorrect = true
    const wrongQuestions: number[] = []

    questions.forEach((q: any, idx: number) => {
      if (selectedAnswers[idx] !== q.correctAnswer) {
        allCorrect = false
        wrongQuestions.push(idx + 1)
      }
    })

    if (allCorrect) {
      toast.success(language === "en" ? "Perfect! All answers are correct!" : "Luar biasa! Semua jawaban benar!", {
        description: t("module.earnedXp").replace("{xp}", module.xpReward.toString())
      })
      
      if (!isCompleted) {
        markCompleted(module.id, 100)
        addXp(module.xpReward)
        interactWithModule()
      }
      
      setTimeout(() => {
        navigate("/learn")
      }, 2500)
    } else {
      toast.error(
        language === "en" 
          ? `Oops! Questions ${wrongQuestions.join(", ")} are incorrect.` 
          : `Ups! Pertanyaan nomor ${wrongQuestions.join(", ")} masih kurang tepat.`,
        {
          description: language === "en" ? "Please review your options and try again!" : "Silakan periksa kembali jawaban Anda!"
        }
      )
    }
  }

  // DEFINING BESPOKE INTERACTIVE SLIDES FOR THE FIRST CHAPTER ("Pengenalan Pasar Modal")
  const renderBespokeSlides = () => {
    const slideData = [
      {
        title: language === "en" ? "What is the Capital Market?" : "Apa itu Pasar Modal?",
        subtitle: language === "en" ? "The meeting point of opportunities and dreams" : "Tempat bertemunya peluang dan impian",
        render: () => (
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-foreground/80 font-medium">
              {language === "en" 
                ? "The capital market is a meeting place for those who need funds (companies or governments) and those who have funds (investors), through transactions of financial instruments such as stocks and bonds."
                : "Pasar modal adalah tempat bertemunya pihak yang membutuhkan dana (perusahaan atau pemerintah) dengan pihak yang memiliki dana (investor), melalui transaksi instrumen keuangan seperti saham dan obligasi."}
            </p>
            
            {/* Interactive Flow Visualizer */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-indigo-500/5 border border-primary/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-around gap-6 mt-4">
              <div className="flex flex-col items-center p-4 bg-glass border border-white/10 rounded-xl text-center w-full md:w-1/3 shadow-sm">
                <div className="p-3 bg-red-500/10 text-red-500 rounded-lg mb-2">
                  <Building className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-sm text-foreground">
                  {language === "en" ? "Need Funds" : "Membutuhkan Dana"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "en" ? "Companies or Governments" : "Perusahaan / Pemerintah"}
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="flex items-center gap-1 text-primary animate-pulse font-black text-sm uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <Sparkles className="h-4 w-4" />
                  {language === "en" ? "Capital Market" : "Pasar Modal"}
                </div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent md:block hidden my-2" />
              </div>

              <div className="flex flex-col items-center p-4 bg-glass border border-white/10 rounded-xl text-center w-full md:w-1/3 shadow-sm">
                <div className="p-3 bg-green-500/10 text-green-500 rounded-lg mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-sm text-foreground">
                  {language === "en" ? "Have Funds" : "Memiliki Dana"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "en" ? "Investors (Community)" : "Investor (Masyarakat)"}
                </p>
              </div>
            </div>
            <p className="text-base text-muted-foreground text-center font-medium italic mt-4">
              {language === "en" 
                ? "💡 It acts as a funding engine for business expansion and an wealth accelerator for the public." 
                : "💡 Berperan sebagai roda penggerak dana bisnis sekaligus tempat melipatgandakan kekayaan publik."}
            </p>
          </div>
        )
      },
      {
        title: language === "en" ? "Key Functions" : "Fungsi Utama Pasar Modal",
        subtitle: language === "en" ? "The vital organs of a country's economic system" : "Organ vital dalam sistem ekonomi negara",
        render: () => (
          <div className="grid gap-4 mt-2">
            {[
              {
                title: language === "en" ? "a. Funding Sources" : "a. Sumber Pendanaan",
                desc: language === "en" 
                  ? "Companies can obtain funds to develop their business by issuing shares or bonds to the public." 
                  : "Perusahaan dapat memperoleh dana segar untuk ekspansi atau inovasi dengan menerbitkan saham atau obligasi.",
                icon: <Building className="h-5 w-5" />,
                color: "from-blue-500/15 to-indigo-500/15 border-blue-500/30 text-blue-500"
              },
              {
                title: language === "en" ? "b. Investment Facilities" : "b. Sarana Investasi",
                desc: language === "en" 
                  ? "Allows the general public to invest their savings, gain returns, and grow their wealth over time." 
                  : "Masyarakat dapat memutarkan uang dingin mereka untuk meraup dividen atau capital gain demi mengalahkan inflasi.",
                icon: <TrendingUp className="h-5 w-5" />,
                color: "from-green-500/15 to-emerald-500/15 border-green-500/30 text-green-500"
              },
              {
                title: language === "en" ? "c. Economic Growth" : "c. Mendorong Pertumbuhan Ekonomi",
                desc: language === "en" 
                  ? "Investments expand businesses, create jobs, boost tax revenue, and vitalize the entire economy." 
                  : "Investasi memicu penciptaan lapangan kerja, menaikkan omzet pajak, dan menghidupkan ekosistem perdagangan nasional.",
                icon: <BarChart3 className="h-5 w-5" />,
                color: "from-orange-500/15 to-amber-500/15 border-orange-500/30 text-orange-500"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.01 }}
                className={cn("p-5 rounded-2xl border bg-gradient-to-br flex items-start gap-4 transition-all shadow-sm", item.color)}
              >
                <div className="p-3 bg-background/80 rounded-xl shadow-inner shrink-0">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-lg text-foreground">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )
      },
      {
        title: language === "en" ? "Key Parties Involved" : "Pihak yang Terlibat",
        subtitle: language === "en" ? "The key actors working behind the scenes" : "Aktor-aktor utama di balik panggung bursa",
        render: () => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {[
              {
                role: language === "en" ? "Investor" : "Investor",
                desc: language === "en" ? "Parties who invest capital expecting a financial return (profit)." : "Pihak yang menaruh modal/dananya dengan tujuan mendapatkan profit.",
                icon: <Users className="h-5 w-5" />,
                bg: "bg-blue-500/10 text-blue-500"
              },
              {
                role: language === "en" ? "Issuers (Emiten)" : "Emiten",
                desc: language === "en" ? "Companies or governments that sell stocks or bonds to raise capital." : "Perusahaan terbuka yang menjual lembar kepemilikan saham kepada masyarakat.",
                icon: <Building className="h-5 w-5" />,
                bg: "bg-purple-500/10 text-purple-500"
              },
              {
                role: language === "en" ? "Securities Company" : "Perusahaan Sekuritas",
                desc: language === "en" ? "Registered brokers who facilitate the buying and selling of securities." : "Perantara resmi (broker) yang menyediakan platform jual-beli saham.",
                icon: <ShieldCheck className="h-5 w-5" />,
                bg: "bg-emerald-500/10 text-emerald-500"
              },
              {
                role: language === "en" ? "Regulator" : "Regulator",
                desc: language === "en" ? "Independent bodies (like OJK) that supervise and keep bourses fair." : "Lembaga pengawas (seperti OJK) yang memastikan transaksi berjalan adil dan transparan.",
                icon: <Landmark className="h-5 w-5" />,
                bg: "bg-amber-500/10 text-amber-500"
              }
            ].map((party, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl border border-white/10 bg-glass shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("p-2.5 rounded-lg shrink-0", party.bg)}>
                    {party.icon}
                  </div>
                  <h4 className="font-extrabold text-base text-foreground">{party.role}</h4>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">{party.desc}</p>
              </motion.div>
            ))}
          </div>
        )
      },
      {
        title: language === "en" ? "Capital Market Instruments" : "Instrumen Pasar Modal",
        subtitle: language === "en" ? "Explore the products you can trade" : "Kenali produk-produk yang bisa Anda beli",
        render: () => {
          const instruments = [
            {
              name: language === "en" ? "Stock" : "Saham",
              desc: language === "en" 
                ? "Proof of ownership of a company. When you own stocks, you are technically a co-owner of that business." 
                : "Bukti kepemilikan sah atas porsi tertentu dari suatu perusahaan. Anda menjadi 'pemilik' kecil dari bisnis tersebut.",
              icon: <Coins className="h-5 w-5" />,
              details: language === "en" ? "Returns from: Dividends or Stock price increase (Capital Gain)" : "Imbal hasil: Dividen atau Kenaikan harga saham (Capital Gain)"
            },
            {
              name: language === "en" ? "Bonds" : "Obligasi",
              desc: language === "en" 
                ? "Debt securities. You lend money to a company or government, and they promise to pay back with interest." 
                : "Surat utang. Anda meminjamkan dana kepada emiten (korporasi/negara) dan mereka wajib membayar bunga berkala.",
              icon: <FileText className="h-5 w-5" />,
              details: language === "en" ? "Returns from: Periodic interest payments (Coupons)" : "Imbal hasil: Bunga/Kupon berkala"
            },
            {
              name: language === "en" ? "Mutual Funds" : "Reksa Dana",
              desc: language === "en" 
                ? "Investment pools managed by professional Fund Managers. Perfect for beginners who don't have time to research." 
                : "Wadah dana kolektif masyarakat yang diracik dan dikelola secara aman oleh Manajer Investasi (MI) profesional.",
              icon: <Layers className="h-5 w-5" />,
              details: language === "en" ? "Best for: Diversification & Low effort" : "Sangat cocok untuk: Diversifikasi otomatis & Pemula"
            },
            {
              name: language === "en" ? "ETF (Exchange Traded Fund)" : "ETF",
              desc: language === "en" 
                ? "Mutual fund products that are traded live on the stock exchange index, exactly like normal stocks." 
                : "Reksa dana modern berbentuk kontrak investasi kolektif yang unit penyertaannya diperdagangkan di bursa layaknya saham.",
              icon: <Activity className="h-5 w-5" />,
              details: language === "en" ? "Feature: Traded in real-time on index" : "Kelebihan: Likuiditas tinggi & Bisa ditransaksikan real-time"
            }
          ]

          return (
            <div className="space-y-4">
              {/* Tab headers */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-muted/50 border border-border rounded-xl">
                {instruments.map((ins, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveInstrumentTab(idx)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all",
                      activeInstrumentTab === idx 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    {ins.icon}
                    {ins.name}
                  </button>
                ))}
              </div>

              {/* Tab body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeInstrumentTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/5 border border-primary/10 relative"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                      {instruments[activeInstrumentTab].icon}
                    </div>
                    <h4 className="font-extrabold text-lg text-foreground">
                      {instruments[activeInstrumentTab].name}
                    </h4>
                  </div>
                  <p className="text-foreground/90 text-sm leading-relaxed mb-4 font-medium">
                    {instruments[activeInstrumentTab].desc}
                  </p>
                  <div className="text-xs font-bold bg-primary/10 text-primary px-3 py-2 rounded-lg border border-primary/20 w-fit">
                    {instruments[activeInstrumentTab].details}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )
        }
      },
      {
        title: language === "en" ? "Case Scenario & Summary" : "Contoh Kasus & Ringkasan",
        subtitle: language === "en" ? "Let's put everything into context" : "Menghubungkan teori ke dalam dunia nyata",
        render: () => (
          <div className="space-y-6">
            {/* Case Scenario Bubble */}
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 relative">
              <h4 className="font-extrabold text-sm text-amber-500 flex items-center gap-2 mb-2 uppercase tracking-wide">
                <HelpCircle className="h-4 w-4" />
                {language === "en" ? "Real Case Example" : "Contoh Penerapan"}
              </h4>
              <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                {language === "en"
                  ? "A company wants to expand its business but doesn't have enough funds. The company then sells shares to the public through the capital market. Investors who buy the stock expect to benefit from an increase in stock prices or dividends."
                  : "Sebuah perusahaan ingin memperluas pabriknya namun tidak memiliki modal yang cukup. Perusahaan tersebut kemudian memutuskan untuk menjual sebagian kepemilikan sahamnya kepada publik melalui Pasar Modal. Investor yang membeli saham tersebut akan memegang bukti kepemilikan dan berhak menikmati keuntungan (seperti dividen) saat perusahaan berkembang."}
              </p>
            </div>

            {/* Checklist summary */}
            <div className="space-y-3">
              <h4 className="font-black text-sm text-muted-foreground uppercase tracking-widest">
                {language === "en" ? "Core Takeaways" : "Ringkasan Bab"}
              </h4>
              <div className="grid gap-2">
                {[
                  language === "en" ? "The capital market is a meeting place for investors and those who need funds." : "Pasar modal mempertemukan emiten yang butuh dana dengan investor pemilik dana.",
                  language === "en" ? "Its main functions are facilitating funding and investments." : "Fungsi utama pasar modal mencakup sarana pendanaan dan fasilitas investasi.",
                  language === "en" ? "Key parties include investors, issuers, securities, and regulators." : "Aktor yang terlibat adalah investor, emiten, perusahaan sekuritas, dan regulator.",
                  language === "en" ? "Instruments traded include stocks, bonds, mutual funds, and ETFs." : "Aset yang diperdagangkan meliputi saham, obligasi, reksa dana, dan ETF.",
                  language === "en" ? "The market plays a crucial role in overall economic growth." : "Pasar modal memegang peran yang sangat penting dalam memutar roda ekonomi nasional."
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-foreground/90 font-semibold">
                    <CheckCircle2 className="h-4 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
    ]

    const currentSlide = slideData[activeSlide]

    return (
      <Card className="glass-card overflow-hidden relative border-primary/20 shadow-xl shadow-primary/5">
        {/* Stepper Progress Indicator at top */}
        <div className="flex h-1.5 w-full bg-muted">
          {slideData.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-full flex-1 transition-all duration-300",
                idx <= activeSlide ? "bg-gradient-to-r from-primary to-indigo-400" : "bg-transparent"
              )}
            />
          ))}
        </div>

        <CardHeader className="bg-primary/5 border-b border-white/5 p-6 relative z-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 font-black text-[10px] tracking-wider uppercase">
              {language === "en" ? `Slide ${activeSlide + 1} of ${slideData.length}` : `Bab ${activeSlide + 1} dari ${slideData.length}`}
            </Badge>
            <CardTitle className="flex items-center gap-2 text-foreground text-2xl font-black tracking-tight">
              {currentSlide.title}
            </CardTitle>
            <p className="text-muted-foreground text-xs font-semibold leading-none">{currentSlide.subtitle}</p>
          </div>
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0 self-start sm:self-center">
            <GraduationCap className="h-6 w-6" />
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 min-h-[320px] relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentSlide.render()}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-6 bg-muted/10 border-t border-border/50 relative z-10">
          <Button
            variant="outline"
            disabled={activeSlide === 0}
            onClick={() => setActiveSlide(prev => prev - 1)}
            className="glass"
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            {language === "en" ? "Previous" : "Kembali"}
          </Button>

          {activeSlide === slideData.length - 1 ? (
            <Button 
              onClick={() => setShowQuiz(true)} 
              className="px-6 font-black bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/95 hover:to-indigo-500/95 shadow-md shadow-primary/20 rounded-xl"
            >
              {t("module.startQuiz")}
              <Trophy className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => setActiveSlide(prev => prev + 1)}
              className="px-6 font-black"
            >
              {language === "en" ? "Next Slide" : "Lanjut"}
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  // FALLBACK GENERIC CAROUSEL SLIDES FOR OTHER CHAPTERS
  const renderFallbackSlides = () => {
    const paragraphs = module.material[language as keyof typeof module.material].split('\n\n')
    const totalSlides = paragraphs.length

    return (
      <Card className="glass-card overflow-hidden relative border-primary/20 shadow-xl shadow-primary/5">
        {/* Stepper Progress Indicator at top */}
        <div className="flex h-1.5 w-full bg-muted">
          {paragraphs.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-full flex-1 transition-all duration-300",
                idx <= activeSlide ? "bg-gradient-to-r from-primary to-indigo-400" : "bg-transparent"
              )}
            />
          ))}
        </div>

        <CardHeader className="bg-primary/5 border-b border-white/5 p-6 relative z-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 font-black text-[10px] tracking-wider uppercase">
              {language === "en" ? `Card ${activeSlide + 1} of ${totalSlides}` : `Slide ${activeSlide + 1} dari ${totalSlides}`}
            </Badge>
            <CardTitle className="flex items-center gap-2 text-foreground text-2xl font-black tracking-tight">
              {t("module.material")}
            </CardTitle>
          </div>
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0 self-start sm:self-center">
            <BookOpen className="h-6 w-6" />
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 min-h-[220px] relative z-10 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="text-foreground/95 text-lg leading-loose font-medium w-full"
            >
              {paragraphs[activeSlide].split('\n').map((line, i) => {
                const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim())
                return (
                  <p 
                    key={i} 
                    className={cn(
                      "mb-3",
                      isBullet ? "pl-4 text-primary/90 font-bold border-l-2 border-primary/30 py-0.5 bg-primary/5 rounded-r-lg" : ""
                    )}
                  >
                    {line}
                  </p>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-6 bg-muted/10 border-t border-border/50 relative z-10">
          <Button
            variant="outline"
            disabled={activeSlide === 0}
            onClick={() => setActiveSlide(prev => prev - 1)}
            className="glass"
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            {language === "en" ? "Previous" : "Kembali"}
          </Button>

          {activeSlide === totalSlides - 1 ? (
            <Button 
              onClick={() => setShowQuiz(true)} 
              className="px-6 font-black bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/95 hover:to-indigo-500/95 shadow-md shadow-primary/20 rounded-xl"
            >
              {t("module.startQuiz")}
              <Trophy className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => setActiveSlide(prev => prev + 1)}
              className="px-6 font-black"
            >
              {language === "en" ? "Next" : "Lanjut"}
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  // Active question details
  const currentQuestion = questions[activeQuestionIdx]
  const isLastQuestion = activeQuestionIdx === questions.length - 1

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-8 pt-2 pb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate("/learn")} 
        className="mb-2 glass hover:bg-muted/50 rounded-full pr-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("module.backToLearn")}
      </Button>

      <header className="mb-4">
        <h1 className="text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
          {module.title[language as keyof typeof module.title]}
        </h1>
        <p className="text-xl text-muted-foreground font-medium">{module.description[language as keyof typeof module.description]}</p>
      </header>

      <AnimatePresence mode="wait">
        {!showQuiz ? (
          <motion.div
            key="material"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {moduleId === "mod-1-1" ? renderBespokeSlides() : renderFallbackSlides()}
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="glass-card shadow-xl shadow-primary/10 border-primary/30 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* segmented indicator for multiple questions */}
              <div className="flex h-1.5 w-full bg-muted">
                {questions.map((_: any, idx: number) => (
                  <div 
                    key={idx}
                    className={cn(
                      "h-full flex-1 transition-all duration-300",
                      idx <= activeQuestionIdx ? "bg-gradient-to-r from-primary to-indigo-400" : "bg-transparent"
                    )}
                  />
                ))}
              </div>

              <CardHeader className="bg-primary/5 border-b border-primary/10 relative z-10">
                <CardTitle className="text-primary flex items-center justify-between text-2xl font-bold">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6" />
                    <span>
                      {language === "en" 
                        ? `Question ${activeQuestionIdx + 1} of ${questions.length}` 
                        : `Pertanyaan ${activeQuestionIdx + 1} dari ${questions.length}`}
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                      <CheckCircle2 className="h-4 w-4" />
                      {t("learn.done")}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-8 p-6 sm:p-8 relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold leading-relaxed">
                  {currentQuestion.question[language as keyof typeof currentQuestion.question]}
                </h2>
                
                <div className="space-y-4">
                  {currentQuestion.options[language as keyof typeof currentQuestion.options].map((opt: string, idx: number) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setSelectedAnswers(prev => ({
                          ...prev,
                          [activeQuestionIdx]: idx
                        }))
                      }}
                      className={cn(
                        "border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 shadow-sm",
                        selectedAnswers[activeQuestionIdx] === idx 
                          ? "border-primary bg-primary/10 shadow-md shadow-primary/20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background" 
                          : "border-border hover:border-primary/50 hover:bg-muted/50 glass"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold shrink-0 transition-colors",
                          selectedAnswers[activeQuestionIdx] === idx 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "border-muted-foreground/30 text-muted-foreground"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-lg font-medium">{opt}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6 bg-muted/20 border-t border-border/50 relative z-10">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="glass hover:bg-muted"
                  disabled={activeQuestionIdx === 0}
                  onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1.5" />
                  {language === "en" ? "Back" : "Sebelumnya"}
                </Button>
                
                {isLastQuestion ? (
                  <Button 
                    onClick={handleQuizSubmit} 
                    size="lg"
                    className="font-bold shadow-md bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/95 hover:to-indigo-500/95"
                  >
                    {language === "en" ? "Submit Quiz" : "Kumpulkan Kuis"}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      if (selectedAnswers[activeQuestionIdx] === undefined) {
                        toast.error(t("module.selectAnswer") || "Pilih jawaban terlebih dahulu", {
                          description: t("module.mustSelectDesc") || "Anda harus memilih salah satu jawaban."
                        })
                        return
                      }
                      setActiveQuestionIdx(prev => prev + 1)
                    }} 
                    size="lg"
                    className="font-bold shadow-md"
                  >
                    {language === "en" ? "Next" : "Lanjut"}
                    <ChevronRight className="h-4 w-4 ml-1.5" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
