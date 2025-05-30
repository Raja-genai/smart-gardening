"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf, Calendar, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { type Season, getCurrentSeason, getRegionFromState, getRecommendedCrops } from "@/utils/season-utils"
import { useWeather } from "@/hooks/use-weather"

interface SeasonalCropRecommendationsProps {
  lat?: string
  lon?: string
  className?: string
}

export function SeasonalCropRecommendations({ lat, lon, className }: SeasonalCropRecommendationsProps) {
  const [currentSeason, setCurrentSeason] = useState<Season>("Summer")
  const [recommendedCrops, setRecommendedCrops] = useState<{ name: string; type: string }[]>([])
  const [region, setRegion] = useState<string>("North")
  const router = useRouter()
  const { weather } = useWeather(lat, lon)
  const weatherProcessed = useRef(false)
  const seasonInitialized = useRef(false)

  // Initialize season based on current month and region
  useEffect(() => {
    if (seasonInitialized.current) return

    // Determine season based on month and region
    const currentMonth = new Date().getMonth() + 1 // 1-12
    const season = getCurrentSeason(currentMonth, region)
    setCurrentSeason(season)

    // Get recommended crops for the season
    const crops = getRecommendedCrops(season)
    setRecommendedCrops(crops)

    seasonInitialized.current = true
  }, [region])

  // Update region when weather data is available
  useEffect(() => {
    if (!weather || weatherProcessed.current) return

    // Try to determine region from location name
    const locationParts = weather.location.split(",")
    const state = locationParts.length > 1 ? locationParts[1].trim() : "Delhi"
    const newRegion = getRegionFromState(state)

    if (newRegion !== region) {
      setRegion(newRegion)

      // Reset the season initialization flag to recalculate with the new region
      seasonInitialized.current = false
    }

    weatherProcessed.current = true
  }, [weather, region])

  // Get season color
  const getSeasonColor = (season: Season) => {
    switch (season) {
      case "Winter":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
      case "Summer":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
      case "Monsoon":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
      case "Post-Monsoon":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
      case "Pre-Monsoon":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
    }
  }

  // Get season emoji
  const getSeasonEmoji = (season: Season) => {
    switch (season) {
      case "Winter":
        return "❄️"
      case "Summer":
        return "☀️"
      case "Monsoon":
        return "🌧️"
      case "Post-Monsoon":
        return "🍂"
      case "Pre-Monsoon":
        return "🌱"
    }
  }

  // Get weather-specific advice
  const getWeatherAdvice = () => {
    if (!weather) return null

    if (weather.condition.toLowerCase().includes("rain")) {
      return "Rainy conditions are perfect for rice and monsoon crops. Hold off on watering today."
    } else if (weather.temperature > 30) {
      return "High temperatures today. Consider planting heat-resistant crops and water in the evening."
    } else if (weather.temperature < 15) {
      return "Cool temperatures are ideal for winter crops like wheat, mustard, and leafy vegetables."
    } else {
      return "Current weather conditions are favorable for most seasonal crops."
    }
  }

  return (
    <Card className={className}>
      <CardHeader className={`${getSeasonColor(currentSeason)} rounded-t-lg`}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>{getSeasonEmoji(currentSeason)}</span>
              <span>{currentSeason} Season</span>
            </CardTitle>
            <CardDescription className="text-current opacity-90">Recommended crops for your region</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {getWeatherAdvice() && (
            <div className="bg-muted p-3 rounded-lg text-sm">
              <strong>Weather Tip:</strong> {getWeatherAdvice()}
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-2">Recommended Crops for {currentSeason} Season:</h3>
            <div className="flex flex-wrap gap-2">
              {recommendedCrops.map((crop, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <Leaf className="h-3 w-3" />
                  {crop.name}
                </Badge>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full mt-2" onClick={() => router.push("/plants")}>
            View Detailed Plant Guide
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
