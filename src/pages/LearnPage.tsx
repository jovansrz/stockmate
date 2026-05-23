import { useState } from "react"
import { Link } from "react-router-dom"
import { modulesData } from "@/mocks/data"
import { useLearningStore } from "@/store/useLearningStore"
import { useTranslation } from "@/hooks/useTranslation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Lock, Unlock, CheckCircle2, PlayCircle, ChevronDown } from "lucide-react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

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

export default function LearnPage() {
  const { progress, isUnlocked } = useLearningStore()
  const { t, language } = useTranslation()

  // Track expanded modules. Default the first one ("mod-1") to be open so the user sees it immediately.
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>("mod-1")

  const allSubModules = modulesData.flatMap(m => m.subModules)
  const completedCount = allSubModules.filter(sm => progress[sm.id]?.completed).length
  const overallProgress = allSubModules.length > 0 ? (completedCount / allSubModules.length) * 100 : 0

  const toggleModule = (moduleId: string) => {
    setExpandedModuleId(prev => (prev === moduleId ? null : moduleId))
  }

  return (
    <motion.div 
      className="space-y-8 pb-8 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={itemVariants} className="text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
            {t("learn.title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("learn.subtitle")}
          </p>
        </div>
        <div className="w-full md:w-64">
          <Card className="glass-card overflow-hidden">
            <CardContent className="pt-6 relative">
              <div className="flex justify-between items-center mb-2 relative z-10">
                <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">{t("learn.progress")}</span>
                <span className="font-black text-primary text-lg">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3 relative z-10" indicatorClassName="bg-gradient-to-r from-primary to-indigo-400" />
            </CardContent>
          </Card>
        </div>
      </motion.header>

      <motion.div variants={itemVariants} className="grid gap-6">
        {modulesData.map((moduleCategory) => {
          const totalSubs = moduleCategory.subModules.length
          const completedSubs = moduleCategory.subModules.filter(sm => progress[sm.id]?.completed).length
          
          // The category is unlocked if its first submodule is unlocked
          const firstSub = moduleCategory.subModules[0]
          const isCategoryUnlocked = isUnlocked(firstSub.id, firstSub.requiredModuleId || undefined)
          
          const isExpanded = expandedModuleId === moduleCategory.id
          const moduleProgressPercent = totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0

          return (
            <div key={moduleCategory.id} className="space-y-3">
              {/* Parent Module Card (Clickable to Expand) */}
              <Card 
                onClick={() => isCategoryUnlocked && toggleModule(moduleCategory.id)}
                className={cn(
                  "overflow-hidden relative transition-all duration-300 select-none cursor-pointer border-l-4",
                  isCategoryUnlocked 
                    ? "glass-card border-l-primary hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5" 
                    : "opacity-60 bg-muted/20 border-l-muted border-border cursor-not-allowed"
                )}
              >
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 relative z-10">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={cn(
                      "p-3 rounded-xl shrink-0 shadow-inner flex items-center justify-center transition-all",
                      completedSubs === totalSubs && totalSubs > 0
                        ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-green-500/20" 
                        : isCategoryUnlocked 
                          ? "bg-gradient-to-br from-primary/80 to-indigo-600 text-white shadow-primary/20" 
                          : "bg-muted text-muted-foreground"
                    )}>
                      {completedSubs === totalSubs && totalSubs > 0 ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : isCategoryUnlocked ? (
                        <Unlock className="h-6 w-6" />
                      ) : (
                        <Lock className="h-6 w-6" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold tracking-tight">
                          {moduleCategory.title[language as keyof typeof moduleCategory.title]}
                        </h2>
                        {completedSubs === totalSubs && totalSubs > 0 && (
                          <Badge className="bg-green-500 hover:bg-green-600 border-none font-bold text-[10px] px-2 py-0.5">
                            {t("learn.done")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                        {moduleCategory.description[language as keyof typeof moduleCategory.description]}
                      </p>
                    </div>
                  </div>

                  {/* Right side controls: status / expand button */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 shrink-0 border-t sm:border-none pt-3 sm:pt-0 border-border">
                    {isCategoryUnlocked ? (
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right sm:block hidden">
                          <span className="text-xs font-semibold text-muted-foreground block uppercase tracking-wider">
                            Progress
                          </span>
                          <span className="text-sm font-extrabold text-foreground">
                            {completedSubs} / {totalSubs} {language === "en" ? "Sub-modules" : "Sub Bab"}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary transition-transform duration-300">
                          <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", isExpanded && "rotate-180")} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground font-semibold text-sm">
                        <Lock className="h-4 w-4" />
                        <span>{t("learn.locked")}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Progress bar nested in the bottom of the card */}
                {isCategoryUnlocked && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-indigo-400 transition-all duration-500" 
                      style={{ width: `${moduleProgressPercent}%` }}
                    />
                  </div>
                )}
              </Card>

              {/* Submodules Accordion Section */}
              <AnimatePresence initial={false}>
                {isExpanded && isCategoryUnlocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 pl-4 sm:pl-8 border-l-2 border-primary/20 relative ml-6 sm:ml-8 py-3 space-y-1">
                      {moduleCategory.subModules.map((subModule, index) => {
                        const subUnlocked = isUnlocked(subModule.id, subModule.requiredModuleId || undefined)
                        const subCompleted = progress[subModule.id]?.completed

                        return (
                          <motion.div
                            key={subModule.id}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={subUnlocked ? { scale: 1.005 } : {}}
                            className="relative"
                          >
                            {/* Connecting Bullet Node on Timeline */}
                            <div className={cn(
                              "absolute -left-[25px] sm:-left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 z-10",
                              subCompleted ? "bg-green-500 border-green-500/20" : subUnlocked ? "bg-primary border-primary/20" : "bg-muted border-border"
                            )} />
                            
                            <Card className={cn(
                              "overflow-hidden relative transition-all duration-300",
                              subUnlocked ? "glass border-primary/10 hover:border-primary/30 hover:shadow-md shadow-sm" : "opacity-75 bg-muted/40 border-border/50"
                            )}>
                              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 relative z-10">
                                <div className={cn(
                                  "p-2.5 rounded-lg shrink-0 flex items-center justify-center",
                                  subCompleted 
                                    ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                                    : subUnlocked 
                                      ? "bg-primary/10 text-primary border border-primary/20" 
                                      : "bg-muted text-muted-foreground border border-border border-dashed"
                                )}>
                                  {subCompleted ? <CheckCircle2 className="h-5 w-5" /> : subUnlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                                </div>
                                
                                <div className="flex-1 space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-bold text-base tracking-tight">{subModule.title[language as keyof typeof subModule.title]}</h3>
                                    {subCompleted && <Badge className="bg-green-500 hover:bg-green-600 border-none font-bold text-[9px] px-1.5 py-0.2">{t("learn.done")}</Badge>}
                                  </div>
                                  <p className="text-muted-foreground text-xs font-medium">{subModule.description[language as keyof typeof subModule.description]}</p>
                                  <div className="pt-0.5">
                                    <Badge variant="outline" className="text-[9px] font-bold bg-primary/5 text-primary border-primary/10 px-1.5 py-0.2">
                                      +{subModule.xpReward} XP
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
                                  {subUnlocked ? (
                                    <Button asChild variant={subCompleted ? "outline" : "default"} size="sm" className={cn(
                                      "w-full sm:w-auto h-9 px-4 rounded-lg font-bold shadow-sm transition-all group text-xs",
                                      !subCompleted && "bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 shadow-primary/20",
                                      subCompleted && "glass border-primary/20 text-foreground hover:bg-primary/5"
                                    )}>
                                      <Link to={`/learn/${subModule.id}`}>
                                        {subCompleted ? t("learn.repeat") : t("learn.start")}
                                        {!subCompleted && <PlayCircle className="ml-1.5 h-3.5 w-3.5 group-hover:scale-110 transition-transform" />}
                                      </Link>
                                    </Button>
                                  ) : (
                                    <Button disabled variant="outline" size="sm" className="w-full sm:w-auto h-9 px-4 rounded-lg border-dashed text-xs">
                                      <Lock className="mr-1.5 h-3 w-3" />
                                      {t("learn.locked")}
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
