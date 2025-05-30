"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Cloud, Sun, CloudRain, Droplets, Wind, Info, AlertTriangle, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiKeyDialog } from "@/components/api-key-dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface WeatherWidgetProps {
  className?: string
}

interface WeatherAlert {
  sender_name: string
  event: string
  start: number
  end: number
  description: string
  tags?: string[]
}

interface WeatherData {
  location: string
  temperature: number
  condition: string
  description: string
  humidity: number
  rainfall: number
  windSpeed: number
  icon: string
  timestamp: string
  season: string
  alerts?: WeatherAlert[]
  isMockData?: boolean
}

interface ForecastData {
  location: string
  country: string
  forecast: Array<{
    date: string
    temperature: number
    condition: string
    description: string
    humidity: number
    rainfall: number
    windSpeed: number
    icon: string
  }>
  timestamp: string
  season: string
  alerts?: WeatherAlert[]
  isMockData?: boolean
}

// Default cities for India
const DEFAULT_CITIES = [
  { name: "Delhi", state: "Delhi" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Bangalore", state: "Karnataka" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Jaipur", state: "Rajasthan" },
]

export function WeatherWidget({ className }: WeatherWidgetProps) {
  const [city, setCity] = useState<string>("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("current")
  const [useMockData, setUseMockData] = useState(true) // Default to true since we don't have a valid API key
  const { toast } = useToast()

  const [apiKey, setApiKey] = useState<string | null>(null)
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)

  // Function to get current weather data
  const getCurrentWeather = async (cityName: string) => {
    if (!cityName) return

    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching weather for:", cityName)

      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}${useMockData ? "&mock=true" : ""}`,
        {
          cache: "no-store",
          headers: apiKey && !useMockData ? { "X-API-Key": apiKey } : {},
        },
      )

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error response:", errorData)
        throw new Error(errorData.error || `Weather API error: ${response.statusText}`)
      }

      const weatherData = await response.json()
      console.log("Weather data received:", weatherData)

      setWeather(weatherData)

      // Save to localStorage for future reference
      localStorage.setItem("last-weather-city", cityName)

      // Clear any previous errors
      setError(null)

      // Show toast for active alerts
      if (weatherData.alerts && weatherData.alerts.length > 0) {
        const activeAlerts = weatherData.alerts.filter((alert: WeatherAlert) => {
          const now = Date.now()
          return alert.start <= now && alert.end >= now
        })

        if (activeAlerts.length > 0) {
          toast({
            title: "Weather Alert",
            description: `${activeAlerts.length} active weather alert(s) for ${cityName}`,
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      console.error("Error fetching current weather data:", error)
      setError(error.message || "Failed to fetch weather data. Please try again later.")

      toast({
        title: "Weather Error",
        description: error.message || "Failed to fetch weather data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get forecast weather data
  const getForecastWeather = async (cityName: string) => {
    if (!cityName) return

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}&forecast=true${useMockData ? "&mock=true" : ""}`,
        {
          cache: "no-store",
          headers: apiKey && !useMockData ? { "X-API-Key": apiKey } : {},
        },
      )

      if (response.ok) {
        const forecastData = await response.json()
        setForecast(forecastData)
      }
    } catch (error: any) {
      console.error("Error fetching forecast data:", error)
      // Don't show error for forecast as it's secondary
    }
  }

  // Handle API key submission
  const handleApiKeySubmit = async (newApiKey: string) => {
    setApiKey(newApiKey)
    localStorage.setItem("openweather-api-key", newApiKey)
    setShowApiKeyDialog(false)
    setError(null)
    setUseMockData(false) // Switch to real data when API key is provided

    // Retry fetching weather with the new API key
    if (city) {
      getWeather(city)
    }

    toast({
      title: "API Key Saved",
      description: "Your OpenWeather API key has been saved. Switching to real-time data.",
    })
  }

  // Function to get both current and forecast weather
  const getWeather = async (cityName: string) => {
    await getCurrentWeather(cityName)
    await getForecastWeather(cityName)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      getWeather(city)
    } else {
      setError("Please enter a city name")
    }
  }

  // Handle quick city selection
  const handleQuickCitySelect = (cityName: string) => {
    setCity(cityName)
    getWeather(cityName)
  }

  // Toggle mock data
  const handleToggleMockData = (checked: boolean) => {
    setUseMockData(checked)
    if (city) {
      getWeather(city)
    }
  }

  // Load weather on component mount
  useEffect(() => {
    // Check for environment variable first (for Next.js public env vars)
    if (process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
      setApiKey(process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY)
      setUseMockData(false) // Use real data if we have an environment variable
    } else {
      // Fall back to localStorage if no environment variable
      const savedApiKey = localStorage.getItem("openweather-api-key")
      if (savedApiKey && savedApiKey.length === 32) {
        setApiKey(savedApiKey)
        setUseMockData(false) // Use real data if we have a valid saved key
      } else {
        // Remove invalid API key from localStorage
        localStorage.removeItem("openweather-api-key")
        setUseMockData(true) // Default to mock data
      }
    }

    // Try to get the last used city from localStorage
    const lastCity = localStorage.getItem("last-weather-city")

    if (lastCity) {
      setCity(lastCity)
      getWeather(lastCity)
    } else if (DEFAULT_CITIES.length > 0) {
      // If no last city, use the first default city
      const defaultCity = DEFAULT_CITIES[0].name
      setCity(defaultCity)
      getWeather(defaultCity)
    }
  }, [])

  // Get weather tip based on temperature
  const getWeatherTip = () => {
    if (!weather) return ""

    const temp = weather.temperature
    const condition = weather.condition.toLowerCase()

    if (temp > 30) {
      return "High temperatures today. Your plants will need extra water - consider watering in the evening to reduce evaporation."
    } else if (condition.includes("rain")) {
      return "Rainy conditions today. Skip watering and check for any drainage issues in your garden."
    } else if (temp < 10) {
      return "Cold temperatures expected. Consider covering sensitive plants to protect from frost damage."
    } else if (temp > 25 && temp <= 30) {
      return "Warm weather today. Water deeply in the morning to help plants withstand the heat."
    } else {
      return "Ideal growing conditions today. A great day for garden maintenance and planting."
    }
  }

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()

    if (conditionLower.includes("rain") || conditionLower.includes("drizzle") || conditionLower.includes("shower")) {
      return <CloudRain className="h-10 w-10 text-blue-500" />
    } else if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
      return <Sun className="h-10 w-10 text-amber-500" />
    } else {
      return <Cloud className="h-10 w-10 text-blue-500" />
    }
  }

  // Format date for forecast display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
  }

  // Format alert time
  const formatAlertTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get alert severity color
  const getAlertSeverity = (event: string) => {
    const eventLower = event.toLowerCase()
    if (eventLower.includes("warning") || eventLower.includes("severe") || eventLower.includes("extreme")) {
      return "destructive"
    } else if (eventLower.includes("watch") || eventLower.includes("advisory")) {
      return "secondary"
    }
    return "default"
  }

  // Filter active and upcoming alerts
  const getActiveAlerts = () => {
    if (!weather?.alerts) return []
    const now = Date.now()
    return weather.alerts.filter((alert) => alert.end >= now)
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Weather Conditions</h2>
        </div>
        <p className="text-muted-foreground mb-4">{weather ? weather.location : "Enter a city to check the weather"}</p>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </form>

        {/* Mock data toggle */}
        <div className="flex items-center space-x-2 mb-4">
          <Switch id="use-mock-data" checked={useMockData} onCheckedChange={handleToggleMockData} />
          <Label htmlFor="use-mock-data">Use simulated weather data</Label>
        </div>

        {/* Quick city selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {DEFAULT_CITIES.map((city) => (
            <Button
              key={city.name}
              variant="outline"
              size="sm"
              onClick={() => handleQuickCitySelect(city.name)}
              className="text-xs"
            >
              {city.name}
            </Button>
          ))}
        </div>

        {/* Weather Alerts */}
        {getActiveAlerts().length > 0 && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="font-medium text-sm">Weather Alerts</h3>
            </div>
            {getActiveAlerts().map((alert, index) => (
              <div
                key={index}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getAlertSeverity(alert.event) as any} className="text-xs">
                      {alert.event}
                    </Badge>
                    {alert.tags &&
                      alert.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatAlertTime(alert.start)} - {formatAlertTime(alert.end)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-red-800 dark:text-red-300 mb-1">{alert.description}</p>
                <p className="text-xs text-muted-foreground">Source: {alert.sender_name}</p>
              </div>
            ))}
          </div>
        )}

        {/* Mock data notice */}
        {useMockData && (
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-3 rounded-md mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <p>Using simulated weather data. For real-time data, configure a valid OpenWeather API key.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowApiKeyDialog(true)} className="mt-2">
              Configure API Key
            </Button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md mb-4 text-sm">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={() => setShowApiKeyDialog(true)} className="mt-2">
              Configure API Key
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading weather data...</p>
          </div>
        ) : !weather && !error ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Enter a city name to see weather information</p>
          </div>
        ) : null}

        {weather && !isLoading && (
          <div className="mt-4">
            <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(weather.condition)}
                    <div>
                      <p className="text-3xl font-bold">{Math.round(weather.temperature)}°C</p>
                      <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Humidity: {weather.humidity}%</p>
                    <p className="text-sm">Wind: {weather.windSpeed} m/s</p>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
                  <p className="font-medium mb-1">Weather Tip:</p>
                  <p className="text-sm">{getWeatherTip()}</p>
                </div>
              </TabsContent>

              <TabsContent value="forecast" className="pt-4">
                {forecast ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                      {forecast.forecast.map((day, index) => (
                        <div key={index} className="bg-muted p-3 rounded-lg flex flex-col items-center">
                          <p className="font-medium text-sm mb-1">{formatDate(day.date)}</p>
                          <div className="my-2">{getWeatherIcon(day.condition)}</div>
                          <p className="text-xl font-bold">{Math.round(day.temperature)}°C</p>
                          <p className="text-xs text-muted-foreground capitalize">{day.description}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Droplets className="h-3 w-3 text-blue-500" />
                            <span className="text-xs">{day.humidity}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Wind className="h-3 w-3 text-gray-500" />
                            <span className="text-xs">{day.windSpeed} m/s</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      Plan your gardening activities based on the upcoming weather conditions
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Forecast data not available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
        <ApiKeyDialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog} onSubmit={handleApiKeySubmit} />
      </CardContent>
    </Card>
  )
}
