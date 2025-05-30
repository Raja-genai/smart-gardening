"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { Moon, Sun, Bell, User, Palette, Save, Trash2, LogOut } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    profile: {
      name: "",
      email: "",
      location: "",
    },
    notifications: {
      taskReminders: true,
      eventReminders: true,
      weatherAlerts: true,
      plantingTips: true,
    },
    appearance: {
      theme: "light",
      primaryColor: "green",
    },
  })

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/auth")
    } else {
      // Load settings from localStorage
      const savedSettings = localStorage.getItem("userSettings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      } else {
        // Set default profile info
        setSettings({
          ...settings,
          profile: {
            name: "Garden Enthusiast",
            email: "user@example.com",
            location: "New Delhi, India",
          },
        })
      }
    }
  }, [router])

  useEffect(() => {
    // Update theme when settings change
    if (isClient && settings.appearance.theme) {
      setTheme(settings.appearance.theme)
    }
  }, [settings.appearance.theme, isClient, setTheme])

  useEffect(() => {
    // Save settings to localStorage whenever they change
    if (isClient) {
      localStorage.setItem("userSettings", JSON.stringify(settings))
    }
  }, [settings, isClient])

  const handleProfileChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      profile: {
        ...settings.profile,
        [field]: value,
      },
    })
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value,
      },
    })
  }

  const handleAppearanceChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [field]: value,
      },
    })
  }

  const saveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings))

    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    })
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the user's account
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userSettings")
    localStorage.removeItem("gardenTasks")
    localStorage.removeItem("gardenEvents")
    localStorage.removeItem("gardenNotes")
    localStorage.removeItem("gardens")

    toast({
      title: "Account Deleted",
      description: "Your account and all associated data have been deleted",
      variant: "destructive",
    })

    router.push("/")
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/")
  }

  const colorOptions = [
    { name: "Green", value: "green" },
    { name: "Blue", value: "blue" },
    { name: "Purple", value: "purple" },
    { name: "Orange", value: "orange" },
    { name: "Red", value: "red" },
  ]

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={settings.profile.location}
                    onChange={(e) => handleProfileChange("location", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Your location helps us provide weather data and plant recommendations specific to your region in
                    India.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete your account? This action cannot be undone and all your data
                        will be permanently deleted.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-reminders">Task Reminders</Label>
                    <p className="text-sm text-gray-500">Receive reminders for upcoming garden tasks</p>
                  </div>
                  <Switch
                    id="task-reminders"
                    checked={settings.notifications.taskReminders}
                    onCheckedChange={(checked) => handleNotificationChange("taskReminders", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="event-reminders">Event Reminders</Label>
                    <p className="text-sm text-gray-500">Receive reminders for scheduled garden events</p>
                  </div>
                  <Switch
                    id="event-reminders"
                    checked={settings.notifications.eventReminders}
                    onCheckedChange={(checked) => handleNotificationChange("eventReminders", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weather-alerts">Weather Alerts</Label>
                    <p className="text-sm text-gray-500">Receive alerts for extreme weather conditions</p>
                  </div>
                  <Switch
                    id="weather-alerts"
                    checked={settings.notifications.weatherAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("weatherAlerts", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="planting-tips">Planting Tips</Label>
                    <p className="text-sm text-gray-500">Receive seasonal planting tips and suggestions</p>
                  </div>
                  <Switch
                    id="planting-tips"
                    checked={settings.notifications.plantingTips}
                    onCheckedChange={(checked) => handleNotificationChange("plantingTips", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your garden planner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={settings.appearance.theme === "light" ? "default" : "outline"}
                      className={`flex items-center gap-2 ${settings.appearance.theme === "light" ? "bg-green-600 hover:bg-green-700" : ""}`}
                      onClick={() => handleAppearanceChange("theme", "light")}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      type="button"
                      variant={settings.appearance.theme === "dark" ? "default" : "outline"}
                      className={`flex items-center gap-2 ${settings.appearance.theme === "dark" ? "bg-green-600 hover:bg-green-700" : ""}`}
                      onClick={() => handleAppearanceChange("theme", "dark")}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      type="button"
                      variant={settings.appearance.theme === "system" ? "default" : "outline"}
                      className={`flex items-center gap-2 ${settings.appearance.theme === "system" ? "bg-green-600 hover:bg-green-700" : ""}`}
                      onClick={() => handleAppearanceChange("theme", "system")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      System
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        className={`h-10 rounded-md border-2 ${
                          settings.appearance.primaryColor === color.value
                            ? "border-black dark:border-white"
                            : "border-transparent"
                        }`}
                        style={{
                          backgroundColor: `var(--${color.value}-600)`,
                          color: "white",
                        }}
                        onClick={() => handleAppearanceChange("primaryColor", color.value)}
                      >
                        {settings.appearance.primaryColor === color.value && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Note: Color changes will be applied after saving and refreshing the page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
