import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore, type UserProfile } from "@/store/useUserStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, ChevronRight, ChevronLeft, Target } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/useTranslation"

// Questions have been moved to locales/index.ts

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { profile, setProfile, addXp } = useUserStore()
  const { t } = useTranslation()
  const questions = t("profile.questions") as unknown as any[]
  
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<UserProfile>>(profile || {})

  const handleSelect = (value: string) => {
    const currentQ = questions[step]
    let newAnswers = { ...answers }
    
    if (currentQ.id === "preferredSectors") {
      newAnswers.preferredSectors = [value]
    } else {
      newAnswers = { ...newAnswers, [currentQ.id]: value }
    }
    
    setAnswers(newAnswers)
    
    // Auto-advance after small delay for better UX
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1)
      }
    }, 400)
  }

  const handleComplete = () => {
    setProfile(answers as UserProfile)
    if (!profile) {
      addXp(50) // Reward for first time completion
      toast.success(t("profile.successSave") as string)
    } else {
      toast.success(t("profile.successUpdate") as string)
    }
    navigate("/profile")
  }

  const progress = ((step + 1) / questions.length) * 100
  const currentQ = questions[step]
  const currentAnswer = currentQ.id === "preferredSectors" ? answers.preferredSectors?.[0] : answers[currentQ.id as keyof UserProfile]

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  }
  
  const [direction, setDirection] = useState(1)

  const goToStep = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1)
    setStep(newStep)
  }

  return (
    <motion.div 
      className="max-w-2xl mx-auto space-y-6 pt-4 pb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="text-center mb-8">
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t("profile.title")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("profile.subtitle")}
        </p>
      </header>

      <Card className="glass-card overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1">
          <Progress value={progress} className="h-full rounded-none" indicatorClassName="bg-gradient-to-r from-primary to-indigo-400" />
        </div>
        
        <CardHeader className="pt-8">
          <CardDescription className="text-primary font-semibold tracking-wider uppercase text-xs">
            {t("profile.step")} {step + 1} {t("profile.from")} {questions.length}
          </CardDescription>
          <CardTitle className="text-2xl mt-2">{currentQ?.title}</CardTitle>
          <CardDescription className="text-base">{currentQ?.description}</CardDescription>
        </CardHeader>

        <CardContent className="relative pb-8">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="space-y-4"
            >
              {currentQ?.options?.map((opt: any) => {
                const isSelected = currentAnswer === opt.value
                return (
                  <motion.div
                    key={opt.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "border-2 rounded-xl p-4 cursor-pointer transition-all duration-200",
                      isSelected 
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/20" 
                        : "border-border hover:border-primary/50 hover:bg-muted/50 glass"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg">{opt.label}</div>
                        <div className={cn("text-sm mt-1", isSelected ? "text-primary" : "text-muted-foreground")}>{opt.sub}</div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-border/50 bg-muted/20 pt-4">
          <Button 
            variant="ghost" 
            onClick={() => goToStep(step - 1)}
            disabled={step === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("common.prev")}
          </Button>
          
          {step === questions.length - 1 ? (
            <Button 
              onClick={handleComplete} 
              disabled={!currentAnswer}
              className="bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 shadow-md shadow-primary/20"
            >
              {t("common.save")}
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => goToStep(step + 1)} 
              disabled={!currentAnswer}
              variant="outline"
              className="glass hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              {t("common.next")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
