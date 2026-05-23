import { useState, useEffect } from "react"
import { Link, useLocation, Outlet } from "react-router-dom"
import { Home, BookOpen, BarChart3, User, Settings, LogOut, Menu, Moon, Sun, Languages } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { AssistantBubble } from "@/components/AssistantBubble"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/hooks/useTranslation"
import { useLanguageStore } from "@/store/useLanguageStore"
import { useAuthStore } from "@/store/useAuthStore"

// Removed LanguageToggle as we're moving it into the sidebar layout

export function AppLayout() {
  const location = useLocation()
  const pathname = location.pathname
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { language, toggleLanguage } = useLanguageStore()
  const { logout } = useAuthStore()

  // Reset scroll position of the main layout container on page navigation
  useEffect(() => {
    const mainEl = document.querySelector("main")
    if (mainEl) {
      mainEl.scrollTop = 0
    }
  }, [pathname])

  const navItems = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: Home },
    { name: t("nav.learn"), href: "/learn", icon: BookOpen },
    { name: t("nav.market"), href: "/screener", icon: BarChart3 },
    { name: t("nav.profile"), href: "/profile", icon: User },
  ]

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-background/50 relative overflow-hidden">
      {/* Background blobs for aesthetics */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[80px]" />
      </div>

      {/* Desktop Sidebar (Glassmorphism) */}
      {/* Desktop Sidebar (Glassmorphism) */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 88 : 256 }}
        className="hidden md:flex flex-col glass border-r border-white/10 px-4 py-6 sticky top-0 h-screen z-20 overflow-hidden"
      >
        <div className={cn("mb-8 flex items-center justify-between px-2", isSidebarCollapsed ? "justify-center" : "")}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="StockMate" className="h-9 w-9 shrink-0" />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-black dark:text-white">Stock</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">Mate</span>
              </span>
            </div>
          )}
          {isSidebarCollapsed && (
            <img src="/logo.png" alt="StockMate" className="h-8 w-8 shrink-0" />
          )}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-300 overflow-hidden group",
                  isActive
                    ? "text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  isSidebarCollapsed && "justify-center px-0"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110 shrink-0", isActive && "text-primary-foreground")} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-4 border-t border-border/10 flex flex-col gap-2">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group",
              isSidebarCollapsed && "justify-center px-0",
              isSettingsOpen && "text-foreground bg-muted/30"
            )}
          >
            <Settings className="h-5 w-5 transition-transform group-hover:scale-110 shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">{t("nav.settings")}</span>}
          </button>
          
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden flex flex-col gap-2", !isSidebarCollapsed && "pl-4")}
              >
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group",
                    isSidebarCollapsed && "justify-center px-0"
                  )}
                >
                  {theme === "light" ? (
                    <Sun className="h-4 w-4 transition-transform group-hover:scale-110 shrink-0" />
                  ) : (
                    <Moon className="h-4 w-4 transition-transform group-hover:scale-110 shrink-0" />
                  )}
                  {!isSidebarCollapsed && <span className="whitespace-nowrap">{theme === "light" ? t("common.darkMode") : t("common.lightMode")}</span>}
                </button>
                <button
                  onClick={toggleLanguage}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group",
                    isSidebarCollapsed && "justify-center px-0"
                  )}
                >
                  <Languages className="h-4 w-4 transition-transform group-hover:scale-110 shrink-0" />
                  {!isSidebarCollapsed && <span className="whitespace-nowrap">{language === 'id' ? t("common.english") : t("common.indonesian")}</span>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group",
              isSidebarCollapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:scale-110 shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">{t("nav.logout")}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto z-10">
        <div className="md:hidden flex justify-between items-center p-4 glass sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="StockMate" className="h-8 w-8 shrink-0" />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-black dark:text-white">Stock</span>
                <span className="text-primary">Mate</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
          </div>
        </div>
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 glass border-r border-white/10 p-6 z-50 flex flex-col md:hidden"
            >
              <div className="mb-8 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="StockMate" className="h-9 w-9 shrink-0" />
                  <span className="text-xl font-bold tracking-tight">
                    <span className="text-black dark:text-white">Stock</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">Mate</span>
                  </span>
                </div>
              </div>
              <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-300 overflow-hidden group",
                        isActive
                          ? "text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-lg -z-10" />
                      )}
                      <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110 shrink-0", isActive && "text-primary-foreground")} />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="mt-auto pt-4 border-t border-border/10 flex flex-col gap-2">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group",
                    isSettingsOpen && "text-foreground bg-muted/30"
                  )}
                >
                  <Settings className="h-5 w-5 transition-transform group-hover:scale-110 shrink-0" />
                  <span className="whitespace-nowrap">{t("nav.settings")}</span>
                </button>

                <AnimatePresence>
                  {isSettingsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-2 pl-4"
                    >
                      <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group"
                      >
                        {theme === "light" ? (
                          <Sun className="h-4 w-4 transition-transform group-hover:scale-110 shrink-0" />
                        ) : (
                          <Moon className="h-4 w-4 transition-transform group-hover:scale-110 shrink-0" />
                        )}
                        <span className="whitespace-nowrap">{theme === "light" ? t("common.darkMode") : t("common.lightMode")}</span>
                      </button>
                      <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group"
                      >
                        <Languages className="h-4 w-4 transition-transform group-hover:scale-110 shrink-0" />
                        <span className="whitespace-nowrap">{language === 'id' ? t("common.english") : t("common.indonesian")}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
                >
                  <LogOut className="h-5 w-5 transition-transform group-hover:scale-110 shrink-0" />
                  <span className="whitespace-nowrap">{t("nav.logout")}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AssistantBubble />
    </div>
  )
}
