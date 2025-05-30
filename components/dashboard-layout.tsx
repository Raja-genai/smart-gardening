"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  List,
  type LucideIcon,
  NotebookPen,
  Settings,
  Bug,
  BookOpen,
  Leaf,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/use-toast"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Garden Planner",
    href: "/garden-planner",
    icon: BarChart3,
  },
  {
    title: "Gardening Methods",
    href: "/methods",
    icon: Leaf,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: List,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Harvest Calendar",
    href: "/harvest-calendar",
    icon: Calendar,
  },
  {
    title: "Notebook",
    href: "/notebook",
    icon: NotebookPen,
  },
  {
    title: "Pest Guide",
    href: "/pests",
    icon: Bug,
  },
  {
    title: "Growing Guide",
    href: "/guide",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface DashboardLayoutProps {
  children: ReactNode
}

function DashboardLayoutComponent({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [userName, setUserName] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/auth")
      return
    }

    // Get user name
    const storedName = localStorage.getItem("user_name")
    if (storedName) {
      setUserName(storedName)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user_email")
    localStorage.removeItem("user_name")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    router.push("/")
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-background hidden md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Leaf className="h-6 w-6" />
                <span>Smart Garden</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                      pathname === item.href && "bg-muted text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium">{userName ? `Hello, ${userName}` : "Welcome"}</div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </aside>
        <main className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:gap-8 md:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold md:hidden">
              <Leaf className="h-6 w-6" />
              <span>Smart Garden</span>
            </Link>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleLogout} className="md:hidden">
                Logout
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

// Export both as default and named export for backward compatibility
export default DashboardLayoutComponent
export const DashboardLayout = DashboardLayoutComponent
