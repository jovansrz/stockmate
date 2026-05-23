import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Send, Bot, User, ArrowLeft, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

// Will initialize inside component
const getInitialMessages = (t: any): Message[] => [
  {
    id: "1",
    role: "assistant",
    content: t("assistant.greeting")
  }
]

const getSuggestions = (t: any) => {
  // Try to access the array if it exists as a translated property, otherwise fallback to index 
  // It's a bit tricky because t returns a string normally, but in our case it returns the object if we point to "assistant.suggestions"
  // Let's rely on the raw value or use the keys.
  const suggestions = t("assistant.suggestions");
  if (Array.isArray(suggestions)) return suggestions;
  return []
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

export default function AssistantPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>(getInitialMessages(t))
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: t("assistant.replyMock").replace("{text}", text)
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1500)
  }

  return (
    <motion.div 
      className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col pt-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <Card className="flex-1 flex flex-col glass-card overflow-hidden border-primary/20 shadow-xl shadow-primary/10">
        <CardHeader className="bg-primary/5 border-b border-primary/10 p-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-muted/50 rounded-full h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {t("assistant.title")}
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              </CardTitle>
              <p className="text-xs text-muted-foreground font-medium">{t("assistant.subtitle")}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm mt-1",
                    msg.role === "user" ? "bg-muted" : "bg-primary text-primary-foreground"
                  )}>
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm md:text-base shadow-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-primary to-indigo-500 text-white rounded-tr-sm" 
                      : "bg-muted/80 backdrop-blur-sm border border-border/50 text-foreground rounded-tl-sm"
                  )}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full justify-start"
              >
                <div className="flex gap-3 max-w-[85%] flex-row">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-muted/80 backdrop-blur-sm border border-border/50 rounded-tl-sm flex items-center gap-1.5 h-[44px]">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0 border-t border-border/20 bg-background/20 backdrop-blur-md">
          {getSuggestions(t).map((sug: string, i: number) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="whitespace-nowrap text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full px-4 py-1.5 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>

        <CardFooter className="p-4 bg-background/50 backdrop-blur-md shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex w-full gap-2 items-center relative"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("assistant.placeholder") as string}
              className="flex-1 rounded-full bg-muted/50 border-border/50 focus-visible:ring-primary pl-4 pr-12 h-12 glass shadow-inner"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-transform active:scale-95"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
