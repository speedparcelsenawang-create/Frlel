import { useState, useEffect } from "react"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function LoadingIntro({ onEnter }: { onEnter: () => void }) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const { mode, toggleMode } = useTheme()
  const isDark = mode === "dark"

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible || exiting) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 30
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setExiting(true)
            setTimeout(onEnter, 400)
          }, 300)
          return 100
        }
        return next
      })
    }, 200)

    return () => clearInterval(interval)
  }, [visible, exiting, onEnter])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-hidden transition-opacity duration-300 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Exit overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-50 bg-black transition-opacity duration-400 ease-in-out ${exiting ? "opacity-100" : "opacity-0"}`}
      />

      {/* Gradient background */}
      <div className="absolute inset-0 bg-[hsl(var(--background))]" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-40 -left-40 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 -bottom-40 -right-40 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Theme toggle */}
      <div className="relative z-10 flex justify-between items-center px-5 sm:px-8 pt-5">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">VENDING MECHINE</div>
        <Button
          onClick={toggleMode}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          size="sm"
          variant="ghost"
          className="p-2 hover:opacity-80 transition-opacity active:scale-[0.94]"
        >
          {isDark ? <Sun className="size-5 text-foreground/80" /> : <Moon className="size-5 text-foreground/60" />}
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-md space-y-12">
          {/* Logo/Brand */}
          <div
            className={`text-center transition-all duration-700 ${visible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
            style={{ transitionDelay: visible ? "100ms" : "0ms" }}
          >
            <div className="inline-flex items-center justify-center w-28 h-28 mb-6">
              <img src="/FamilyMart.png" alt="FamilyMart" className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-[1.5rem] font-bold text-foreground">VENDING MECHINE</h1>
            <p className="text-sm text-muted-foreground mt-2">Delivery Operations</p>
          </div>

          {/* Loading indicator */}
          <div className="space-y-4">
            {/* Animated dots */}
            <div
              className={`flex items-center justify-center gap-2 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: visible ? "200ms" : "0ms" }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary/60"
                  style={{
                    animation: `pulse 1.4s infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div
              className={`space-y-2 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: visible ? "250ms" : "0ms" }}
            >
              <div className="w-full h-1 bg-border/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground/70 text-center">
                {Math.min(Math.round(progress), 100)}%
              </p>
            </div>
          </div>

          {/* Loading text */}
          <div
            className={`text-center space-y-3 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: visible ? "300ms" : "0ms" }}
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Loading your workspace</p>
              <p className="text-xs text-muted-foreground/70">Setting up delivery routes and schedules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Styles for animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
