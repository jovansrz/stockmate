import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/useTranslation"

export function AssistantBubble() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Hooks must be called before any early returns (Rules of Hooks)
  useEffect(() => {
    if (location.pathname === "/chat") return
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [location.pathname])

  // Hide the bubble entirely if we are already on the chat page
  if (location.pathname === "/chat") {
    return null
  }

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-4 mr-2"
          >
            <div 
              className="glass-card bg-primary/10 border-primary/20 p-4 rounded-2xl shadow-xl shadow-primary/20 relative cursor-pointer group flex items-center gap-3 w-64"
              onClick={() => {
                setIsOpen(false)
                navigate("/chat")
              }}
            >
              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-background border-b border-r border-border/50 rotate-45 transform translate-y-1/2 -z-10" />
              <div className="p-2 bg-primary/20 rounded-full text-primary group-hover:scale-110 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-foreground">StockMate AI</p>
                <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">{t("assistant.bubblePrompt")}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full hover:bg-muted absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-primary to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 focus:outline-none relative"
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Pulsing ring effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" style={{ animationDuration: '3s' }} />
        )}
      </motion.button>
    </div>
  )
}
