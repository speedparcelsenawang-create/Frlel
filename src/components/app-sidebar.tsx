"use client"

import * as React from "react"
import { CalendarDays, ChevronsUpDown, Cog, House, Images, Moon, Package, Pencil, Search, Sun, X, Zap } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useEditMode } from "@/contexts/EditModeContext"
import { useTheme } from "@/hooks/use-theme"
import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function matchesSearch(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase())
}

function getOpenSectionForPage(page: string | undefined): string | null {
  if (!page) return null
  if (["route-list", "deliveries", "custom"].includes(page)) return "Operations"
  if (page === "rooster") return "Schedule"
  if (["plano-vm", "gallery-album", "gallery-site-images"].includes(page)) return "Gallery"
  return null
}

// ─── Nav item definitions ────────────────────────────────────────────────────

const ALL_NAV_ITEMS = [
  {
    title: "Operations",
    url: "#",
    icon: Package,
    color: "hsl(var(--accent-emerald))",
    items: [
      { title: "Route List", url: "#", page: "route-list" },
      { title: "Location",   url: "#", page: "deliveries" },
      { title: "Custom",     url: "#", page: "custom" },
    ],
  },
  {
    title: "Schedule",
    url: "#",
    icon: CalendarDays,
    color: "hsl(var(--accent-indigo))",
    items: [
      { title: "Rooster", url: "#", page: "rooster" },
    ],
  },
  {
    title: "Gallery",
    url: "#",
    icon: Images,
    color: "hsl(var(--accent-pink))",
    items: [
      { title: "Plano VM",    url: "#", page: "plano-vm" },
      { title: "Site Images", url: "#", page: "gallery-site-images" },
    ],
  },
] as const

// ─── Main component ───────────────────────────────────────────────────────────

export function AppSidebar({
  onNavigate,
  currentPage,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onNavigate?: (page: string) => void
  currentPage?: string
}) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [actionOpen, setActionOpen] = React.useState(false)
  const actionRef = React.useRef<HTMLDivElement>(null)
  const sidebarRef = React.useRef<HTMLDivElement>(null)
  const touchStartYRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!actionOpen) return
    const handler = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setActionOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [actionOpen])
  const [unsavedDialogOpen, setUnsavedDialogOpen] = React.useState(false)
  const [isEditModeTransitioning, setIsEditModeTransitioning] = React.useState(false)
  const [openItem, setOpenItem] = React.useState<string | null>(
    () => getOpenSectionForPage(currentPage)
  )

  const { setOpenMobile } = useSidebar()
  const { isEditMode, setIsEditMode, hasUnsavedChanges, saveChanges, isSaving, discardChanges } = useEditMode()
  const { mode, toggleMode } = useTheme()

  const q = searchQuery.trim()

  // Auto-open the section that contains the current page
  React.useEffect(() => {
    const section = getOpenSectionForPage(currentPage)
    if (section) setOpenItem(section)
  }, [currentPage])

  // Close open submenu when clicking outside the sidebar
  React.useEffect(() => {
    if (!openItem) return
    const handler = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpenItem(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [openItem])

  // ── Navigation handler ─────────────────────────────────────────────────────
  const navigate = React.useCallback(
    (page: string) => {
      onNavigate?.(page)
      setOpenMobile(false)
    },
    [onNavigate, setOpenMobile]
  )

  // ── Edit mode ──────────────────────────────────────────────────────────────
  const applyEditModeChange = (next: boolean) => {
    setIsEditModeTransitioning(true)
    window.setTimeout(() => {
      setIsEditMode(next)
      setIsEditModeTransitioning(false)
    }, 260)
  }

  const handleEditModeToggle = () => {
    if (isEditModeTransitioning) return
    if (isEditMode && hasUnsavedChanges) {
      setUnsavedDialogOpen(true)
    } else {
      applyEditModeChange(!isEditMode)
    }
  }

  // ── Build filtered nav items ───────────────────────────────────────────────
  type NavItemDef = {
    title: string
    url: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    color: string
    isActive?: boolean
    page?: string
    items?: { title: string; url: string; page?: string }[]
  }

  const navItems: NavItemDef[] = React.useMemo(() => {
    const withActive = ALL_NAV_ITEMS.map(section => ({
      ...section,
      isActive: section.items.some(i => i.page === currentPage),
      items: [...section.items],
    }))

    if (!q) return withActive

    return withActive
      .map(section => {
        const parentMatch = matchesSearch(section.title, q)
        const filteredChildren = section.items.filter(sub =>
          matchesSearch(sub.title, q)
        )
        if (parentMatch) return { ...section }
        if (filteredChildren.length > 0) return { ...section, items: filteredChildren }
        return null
      })
      .filter((s): s is NonNullable<typeof s> => s !== null)
  }, [currentPage, q])

  const showHome   = !q || matchesSearch("Home", q)
  const showSettings = !q || matchesSearch("Settings", q)
  const noResults  = q.length > 0 && !showHome && navItems.length === 0 && !showSettings
  const isSettingsActive = currentPage?.startsWith("settings") ?? false

  return (
    <>
      <Sidebar {...props} variant="floating">
        <div ref={sidebarRef} className="flex flex-col h-full min-h-0">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <SidebarHeader className="p-0 shrink-0">
            <div className="relative overflow-hidden h-[108px] rounded-t-[18px]">
              <img
                src="/icon/IMG_0011.jpeg"
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${
                  mode === "light" ? "opacity-75" : "opacity-30"
                }`}
              />
              {/* gradient — light: gentle tint, dark: deep fade */}
              <div className={`absolute inset-0 bg-gradient-to-b ${
                mode === "light"
                  ? "from-white/10 via-background/30 to-background/80"
                  : "from-black/20 via-background/20 to-background/90"
              }`} />
              {/* App name overlay */}
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 flex items-end gap-2">
                <img src="/FamilyMart.png" alt="FM" className="size-8 object-contain shrink-0" />
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold leading-tight drop-shadow-sm truncate ${
                    mode === "light" ? "text-foreground/80" : "text-white"
                  }`}>Vending Machine</p>
                  <p className={`text-[9px] font-medium leading-tight drop-shadow-sm ${
                    mode === "light" ? "text-muted-foreground" : "text-white/60"
                  }`}>Delivery Operations</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative px-3 pt-2.5 pb-1">
              <Search className="pointer-events-none absolute left-6 top-1/2 size-[13px] text-muted-foreground/60" style={{ transform: 'translateY(calc(-50% + 2px))' }} />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-8 w-full rounded-lg border border-input/60 bg-muted/30 pl-8 pr-7 text-[12px] outline-none ring-0 transition-all duration-150 placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-ring focus:bg-background focus:border-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </SidebarHeader>

          {/* ── Content ─────────────────────────────────────────────────── */}
          <SidebarContent className="px-2 py-1 gap-0 overflow-y-auto min-h-0">

            {/* Home */}
            {showHome && (
              <SidebarGroup className="py-0 pt-2 pb-1">
                <SidebarGroupLabel className="text-[9.5px] font-bold uppercase tracking-widest text-muted-foreground/50 px-1 mb-0.5">Navigation</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Home"
                      isActive={currentPage === "home"}
                      className="transition-all duration-150 rounded-lg"
                      onClick={() => navigate("home")}
                    >
                      <House
                        className="size-[14px] shrink-0"
                        style={{ color: "hsl(var(--accent-indigo))" }}
                      />
                      <span className="text-[12px] font-medium text-foreground leading-tight">Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )}

            {/* Main menu with submenus */}
            {navItems.length > 0 && (
              <NavMain
                items={navItems as Parameters<typeof NavMain>[0]["items"]}
                onSubItemClick={navigate}
                searchQuery={q}
                currentPage={currentPage}
                openItem={openItem}
                onOpenItemChange={setOpenItem}
                label="Workspace"
              />
            )}

            {/* Settings */}
            {showSettings && (
              <SidebarGroup className="py-0 pt-1 pb-2">
                <SidebarGroupLabel className="text-[9.5px] font-bold uppercase tracking-widest text-muted-foreground/50 px-1 mb-0.5">General</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Settings"
                      isActive={isSettingsActive}
                      className="transition-all duration-150 rounded-lg"
                      onClick={() => navigate("settings")}
                    >
                      <Cog
                        className="size-[14px] shrink-0"
                        style={{ color: "hsl(var(--accent-amber))" }}
                      />
                      <span className="text-[12px] font-medium text-foreground leading-tight">Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )}

            {/* No results */}
            {noResults && (
              <div className="flex flex-col items-center gap-1.5 py-8 text-center animate-in fade-in duration-200">
                <p className="text-xs font-medium text-muted-foreground">No results</p>
                <p className="text-[11px] text-muted-foreground/50">Try a different keyword</p>
              </div>
            )}
          </SidebarContent>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <SidebarFooter className="px-2 pb-3 pt-1 shrink-0">

            {/* Action slide-up panel */}
            <div className="relative" ref={actionRef}>
              {/* Slide-up panel */}
              <div
                className="absolute bottom-full left-0 right-0 mb-2 z-[70] overflow-hidden rounded-xl border border-sidebar-border/60 bg-popover/95 backdrop-blur-sm shadow-xl shadow-black/20"
                style={{
                  transition: 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)',
                  opacity: actionOpen ? 1 : 0,
                  transform: actionOpen ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
                  pointerEvents: actionOpen ? 'auto' : 'none',
                }}
                onTouchStart={e => { touchStartYRef.current = e.touches[0].clientY }}
                onTouchEnd={e => {
                  if (touchStartYRef.current === null) return
                  const delta = e.changedTouches[0].clientY - touchStartYRef.current
                  touchStartYRef.current = null
                  if (delta > 50) setActionOpen(false)
                }}
              >
                <div className="px-3 pt-2.5 pb-1.5 flex items-center gap-2">
                  <Zap className="size-3 text-amber-400 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quick Actions</span>
                </div>
                <div className="border-t border-border/40 mx-3 mb-1" />

                {/* Theme */}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer rounded-lg mx-0"
                >
                  {mode === "dark"
                    ? <Moon className="size-3.5 shrink-0 text-indigo-400" />
                    : <Sun className="size-3.5 shrink-0 text-amber-400" />}
                  <span className="flex-1 text-[12px] font-medium text-foreground text-left">
                    {mode === "dark" ? "Dark Mode" : "Light Mode"}
                  </span>
                  <span onClick={e => e.stopPropagation()}>
                    <Switch
                      size="sm"
                      className="fcal-switch-sidebar"
                      checked={mode === "dark"}
                      onCheckedChange={toggleMode}
                    />
                  </span>
                </button>

                {/* Edit mode */}
                <button
                  type="button"
                  onClick={handleEditModeToggle}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer rounded-lg"
                >
                  {isEditModeTransitioning
                    ? <LoadingSpinner size={14} className="text-primary" />
                    : <Pencil className={`size-3.5 shrink-0 ${isEditMode ? "text-emerald-400" : "text-muted-foreground"}`} />}
                  <span className="flex-1 text-[12px] font-medium text-foreground text-left">
                    {isEditModeTransitioning ? "Switching…" : "Edit Mode"}
                  </span>
                  {!isEditModeTransitioning && (
                    <span onClick={e => e.stopPropagation()}>
                      <Switch
                        size="sm"
                        className="fcal-switch-sidebar"
                        checked={isEditMode}
                        onCheckedChange={handleEditModeToggle}
                      />
                    </span>
                  )}
                </button>
                <div className="pb-1" />
              </div>

              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setActionOpen(v => !v)}
                className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[12px] font-medium transition-all duration-150 ${actionOpen ? 'bg-sidebar-accent/40 border border-sidebar-border/30' : 'border border-transparent'}`}
              >
                <Zap className={`size-[14px] shrink-0 transition-colors ${actionOpen ? 'text-amber-400' : 'text-amber-400/70'}`} />
                <span className="flex-1 text-sidebar-foreground">Quick Actions</span>
                <ChevronsUpDown
                  className="size-3 shrink-0 text-muted-foreground transition-transform duration-200"
                  style={{ transform: actionOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
            </div>

            {/* App version */}
            <div className="mt-2 flex items-center justify-center gap-1.5 opacity-70">
              <span className="text-[9.5px] font-medium text-muted-foreground tracking-wide">Dbrutals</span>
              <span className="text-[9px] text-muted-foreground/60">·</span>
              <span className="text-[9.5px] text-muted-foreground/70">v1.0.0</span>
            </div>
          </SidebarFooter>

        </div>
      </Sidebar>


      {/* Unsaved changes dialog */}
      <Dialog open={unsavedDialogOpen} onOpenChange={setUnsavedDialogOpen}>
        <DialogContent className="sm:max-w-md" style={{ zIndex: 300 }}>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. What would you like to do before turning off Edit Mode?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                discardChanges()
                setUnsavedDialogOpen(false)
                setIsEditMode(false)
              }}
            >
              Discard Changes
            </Button>
            <Button
              onClick={async () => {
                await saveChanges()
                setUnsavedDialogOpen(false)
                setIsEditMode(false)
              }}
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Save & Turn Off"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
