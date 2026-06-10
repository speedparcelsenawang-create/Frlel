import { useState, useEffect } from "react"
import { ArrowRight, CalendarDays, MapPin, Package, Layers, Users, Sun, Moon } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Route Calendar",
    description: "Plan and track daily delivery routes with colour-coded schedules.",
    number: "01",
  },
  {
    icon: MapPin,
    title: "Location Tracking",
    description: "Log delivery locations and manage stop records efficiently.",
    number: "02",
  },
  {
    icon: Package,
    title: "VM Management",
    description: "Monitor vending machine stock, planograms, and movements.",
    number: "03",
  },
  {
    icon: Users,
    title: "Rooster",
    description: "View shift schedules in weekly or monthly calendar view.",
    number: "04",
  },
  {
    icon: Layers,
    title: "Gallery",
    description: "Store and browse VM photo albums organised by album.",
    number: "05",
  },
]

const STATS = [
  { label: "Routes Managed", value: "1000+" },
  { label: "Active Users", value: "500+" },
  { label: "Locations Tracked", value: "50K+" },
]

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const { mode, toggleMode } = useTheme()
  const isDark = mode === "dark"

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible) return
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [visible])

  const handleEnter = () => {
    setExiting(true)
    setTimeout(onEnter, 450)
  }

  const currentFeature = FEATURES[activeFeature]
  const CurrentIcon = currentFeature.icon

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto transition-opacity duration-300 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Exit overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-50 bg-black transition-opacity duration-400 ease-in-out ${exiting ? "opacity-100" : "opacity-0"}`}
      />

      {/* Animated background with gradient mesh */}
      <div className="absolute inset-0 bg-[hsl(var(--background))]" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-40 -left-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 -bottom-40 -right-40 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Theme toggle */}
      <div className="relative z-10 flex justify-between items-center px-5 sm:px-8 pt-5">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">PLANO</div>
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
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Hero section */}
        <div className="px-4 sm:px-8 py-10 sm:py-16 flex-1 flex flex-col justify-center">
          <div className="max-w-6xl mx-auto w-full">
            {/* Animated badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm text-xs font-medium text-muted-foreground mb-6 transition-all duration-700 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
              style={{ transitionDelay: visible ? "100ms" : "0ms" }}
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Next-gen delivery management</span>
            </div>

            {/* Main heading with split design */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1
                  className={`text-[clamp(2rem,7vw,4rem)] font-bold tracking-tight leading-tight [text-wrap:balance] text-foreground transition-all duration-700 ${visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
                  style={{ transitionDelay: visible ? "150ms" : "0ms" }}
                >
                  Delivery{" "}
                  <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    excellence
                  </span>{" "}
                  made simple
                </h1>

                <p
                  className={`text-base sm:text-lg text-muted-foreground/90 leading-relaxed max-w-lg transition-all duration-700 ${visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
                  style={{ transitionDelay: visible ? "200ms" : "0ms" }}
                >
                  Complete platform for route planning, location tracking, inventory management, and scheduling. Designed for teams that demand precision.
                </p>

                {/* Stats */}
                <div
                  className={`flex flex-wrap gap-6 sm:gap-8 pt-4 transition-all duration-700 ${visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
                  style={{ transitionDelay: visible ? "250ms" : "0ms" }}
                >
                  {STATS.map((stat, i) => (
                    <div key={i}>
                      <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div
                  className={`flex flex-col sm:flex-row items-start gap-3 pt-4 transition-all duration-700 ${visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
                  style={{ transitionDelay: visible ? "300ms" : "0ms" }}
                >
                  <Button
                    onClick={handleEnter}
                    className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl px-7 py-3 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97] hover:scale-[1.02]"
                  >
                    <span>Launch App</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl px-6 py-3 font-semibold text-sm"
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Feature showcase card */}
              <div
                className={`transition-all duration-700 ${visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
                style={{ transitionDelay: visible ? "350ms" : "0ms" }}
              >
                <div className="relative group">
                  {/* Card background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                  
                  {/* Main card */}
                  <div className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/30 rounded-3xl p-8 overflow-hidden hover:border-border/60 transition-all duration-500">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                      <div className="absolute w-40 h-40 bg-primary/10 rounded-full -top-20 -right-20 group-hover:scale-150 transition-transform duration-500" />
                      <div className="absolute w-32 h-32 bg-primary/5 rounded-full -bottom-10 -left-10" />
                    </div>

                    {/* Content */}
                    <div className="relative space-y-6">
                      {/* Icon with animation */}
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                        <CurrentIcon className="size-8 text-primary transition-transform duration-500 group-hover:scale-110" />
                      </div>

                      {/* Feature name */}
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Feature {currentFeature.number}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">{currentFeature.title}</h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground/80 leading-relaxed">
                        {currentFeature.description}
                      </p>

                      {/* Carousel dots */}
                      <div className="flex items-center gap-2 pt-4">
                        {FEATURES.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveFeature(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              i === activeFeature
                                ? "w-8 bg-primary"
                                : "w-1.5 bg-border/60 hover:bg-border"
                            }`}
                            aria-label={`Feature ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid section */}
        <div className="px-4 sm:px-8 py-16 sm:py-20 border-t border-border/30">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Complete Feature Set</h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                Everything you need to manage deliveries efficiently in one powerful platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {FEATURES.map(({ icon: Icon, title, description, number }, index) => (
                <div
                  key={title}
                  className={`group transition-all duration-500 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
                  style={{ transitionDelay: visible ? `${400 + index * 50}ms` : "0ms" }}
                >
                  <div className="relative h-full p-6 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm hover:border-border/60 hover:bg-card/80 transition-all duration-300 overflow-hidden group">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="relative space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                          <Icon className="size-6 text-primary" />
                        </div>
                        <span className="text-3xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors duration-300">
                          {number}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-foreground mb-2">{title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
                          {description}
                        </p>
                      </div>

                      {/* Hover indicator */}
                      <div className="pt-2 flex items-center gap-2 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Learn more</span>
                        <ArrowRight className="size-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-4 sm:px-8 py-12 sm:py-16 border-t border-border/30 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Ready to transform your deliveries?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Join teams that are already optimizing their delivery operations
              </p>
            </div>
            <Button
              onClick={handleEnter}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97]"
            >
              <span>Get Started Now</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
