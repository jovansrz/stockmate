import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AppLayout } from "@/components/layout/AppLayout"
import { Toaster } from "@/components/ui/sonner"
import ProtectedRoute from "@/components/layout/ProtectedRoute"

import DashboardPage from "@/pages/DashboardPage"
import ProfilePage from "@/pages/ProfilePage"
import OnboardingPage from "@/pages/OnboardingPage"
import ScreenerPage from "@/pages/ScreenerPage"
import LearnPage from "@/pages/LearnPage"
import ModulePage from "@/pages/ModulePage"
import StockDetailPage from "@/pages/StockDetailPage"
import AssistantPage from "@/pages/AssistantPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import LandingPage from "@/pages/LandingPage"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/screener" element={<ScreenerPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/learn/:moduleId" element={<ModulePage />} />
              <Route path="/stocks/:ticker" element={<StockDetailPage />} />
              <Route path="/chat" element={<AssistantPage />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
