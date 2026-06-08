import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Send, Bot, User, Sparkles, Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import api from "@/services/api"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useUserStore } from "@/store/useUserStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useChatStore, type ChatMessage } from "@/store/useChatStore"

const getSuggestions = (t: any) => {
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
  const { t } = useTranslation()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // User data
  const { balance, xp, level, streak, profile, watchlist, portfolio } = useUserStore()
  const { user } = useAuthStore()

  // Chat history store
  const {
    sessions,
    activeSessionId,
    createSession,
    setActiveSession,
    addMessage,
    deleteSession,
    getActiveSession,
  } = useChatStore()

  // On mount: ensure there is an active session
  useEffect(() => {
    if (!activeSessionId || !sessions.find(s => s.id === activeSessionId)) {
      createSession(t("assistant.greeting"))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const activeSession = getActiveSession()
  const messages = activeSession?.messages || []

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleNewChat = () => {
    createSession(t("assistant.greeting"))
    setSidebarOpen(false)
  }

  const handleSelectSession = (id: string) => {
    setActiveSession(id)
    setSidebarOpen(false)
  }

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteSession(id)
    // If all sessions are deleted, create a new one
    if (sessions.length <= 1) {
      createSession(t("assistant.greeting"))
    }
  }

  const handleSend = async (text: string) => {
    if (!text.trim() || !activeSessionId) return

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text }
    addMessage(activeSessionId, userMsg)
    setInput("")
    setIsTyping(true)

    try {
      const currentMessages = getActiveSession()?.messages || []
      const response = await api.post('/chat', {
        message: text,
        history: currentMessages,
        userContext: {
          username: user?.username || 'Guest',
          balance,
          xp,
          level,
          streak,
          profile,
          watchlist,
          portfolio
        }
      })

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.reply
      }
      addMessage(activeSessionId, aiMsg)
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I am having trouble connecting to the server right now."
      }
      addMessage(activeSessionId, errorMsg)
    } finally {
      setIsTyping(false)
    }
  }

  // Format date for sidebar
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHrs = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHrs < 24) return `${diffHrs}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      className="w-full h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Sidebar - Chat History */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 overflow-hidden"
          >
            <Card className="h-full flex flex-col glass-card border-primary/20 shadow-lg">
              <div className="p-3 border-b border-border/30 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Chat History</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNewChat}
                  className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary"
                  title="New Chat"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {sessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No conversations yet</p>
                ) : (
                  sessions.map((session) => (
                    <motion.button
                      key={session.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleSelectSession(session.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl transition-all duration-150 group flex items-start gap-2.5 relative",
                        session.id === activeSessionId
                          ? "bg-primary/15 border border-primary/30 shadow-sm"
                          : "hover:bg-muted/60 border border-transparent"
                      )}
                    >
                      <MessageSquare className={cn(
                        "h-4 w-4 mt-0.5 shrink-0",
                        session.id === activeSessionId ? "text-primary" : "text-muted-foreground"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          session.id === activeSessionId ? "text-primary" : "text-foreground"
                        )}>
                          {session.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {formatDate(session.updatedAt)}
                        </p>
                      </div>
                      {sessions.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteSession(e, session.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive shrink-0"
                          title="Delete chat"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col glass-card overflow-hidden border-primary/20 shadow-xl shadow-primary/10">
        <CardHeader className="bg-primary/5 border-b border-primary/10 p-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-muted/50 rounded-full h-8 w-8"
              title={sidebarOpen ? "Close history" : "Open history"}
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {t("assistant.title")}
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              </CardTitle>
              <p className="text-xs text-muted-foreground font-medium">{t("assistant.subtitle")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              className="rounded-full text-xs gap-1.5 border-primary/20 hover:bg-primary/10 text-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              New Chat
            </Button>
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
                  "flex gap-3 max-w-[90%] md:max-w-4xl",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm mt-1",
                    msg.role === "user" ? "bg-muted" : "bg-primary text-primary-foreground"
                  )}>
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                    "rounded-2xl text-sm md:text-base shadow-sm",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-primary to-indigo-500 text-white rounded-tr-sm px-4 py-3"
                      : "bg-muted/80 backdrop-blur-sm border border-border/50 text-foreground rounded-tl-sm px-5 py-4"
                  )}>
                    {msg.role === "user" ? (
                      <span className="leading-relaxed">{msg.content}</span>
                    ) : (
                      <div className="chat-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
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
                <div className="flex gap-3 max-w-[90%] md:max-w-4xl flex-row">
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

        {messages.length <= 1 && (
          <div className="px-4 py-1.5 flex gap-2 overflow-x-auto no-scrollbar shrink-0 border-t border-border/20 bg-background/20 backdrop-blur-md">
            {getSuggestions(t).map((sug: string, i: number) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="whitespace-nowrap text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full px-4 py-1 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        <CardFooter className="p-3 pb-4 bg-background/50 backdrop-blur-md shrink-0">
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
