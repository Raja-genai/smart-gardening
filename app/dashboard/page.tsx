"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { WeatherWidget } from "@/components/weather-widget"
import { FallbackWeather } from "@/components/fallback-weather"
import { MyGardenWidget } from "@/components/my-garden-widget"
import { SeasonalCropRecommendations } from "@/components/seasonal-crop-recommendations"
import { PlantDistribution } from "@/components/plant-distribution"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { isPast, isToday } from "date-fns"

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [currentSeason, setCurrentSeason] = useState("Summer")
  const [recommendedCrops, setRecommendedCrops] = useState<string[]>([
    "Okra (Bhindi)",
    "Cucumber",
    "Bottle Gourd",
    "Bitter Gourd",
    "Eggplant (Brinjal)",
    "Pumpkin",
    "Watermelon",
    "Muskmelon",
    "Sunflower",
    "Marigold",
  ])
  const [placedPlants, setPlacedPlants] = useState<any[]>([])
  const [gardenDimensions, setGardenDimensions] = useState({ width: 5, height: 5 })
  const [showHarvestAlert, setShowHarvestAlert] = useState(false)
  const [plantsToHarvest, setPlantsToHarvest] = useState<any[]>([])
  const { toast } = useToast()
  const [weatherError, setWeatherError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Function to retry loading weather
  const retryWeather = () => {
    setWeatherError(false)
    setRetryCount((prev) => prev + 1)
  }

  // Handle weather widget error
  const handleWeatherError = () => {
    setWeatherError(true)
  }

  // Load data from localStorage
  useEffect(() => {
    // Load tasks
    const storedTasks = localStorage.getItem("garden-tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }

    // Load events
    const storedEvents = localStorage.getItem("garden-calendar-events")
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date),
      }))
      setEvents(parsedEvents)
    }

    // Load garden data
    const storedGarden = localStorage.getItem("garden-planner-data")
    if (storedGarden) {
      try {
        const parsedGarden = JSON.parse(storedGarden)
        if (parsedGarden.placedPlants) {
          setPlacedPlants(parsedGarden.placedPlants)

          // Check for plants that need to be harvested
          const today = new Date()
          const harvestablePlants = parsedGarden.placedPlants.filter((plant: any) => {
            if (!plant.plantedDate) return false

            const plantedDate = new Date(plant.plantedDate)
            const harvestDate = new Date(plantedDate)

            // Estimate harvest time (in days) based on plant type
            let growthDays = 90 // default

            if (plant.plantId.includes("lettuce") || plant.plantId.includes("spinach")) growthDays = 45
            else if (plant.plantId.includes("radish")) growthDays = 30
            else if (plant.plantId.includes("carrot")) growthDays = 75
            else if (plant.plantId.includes("tomato")) growthDays = 90
            else if (plant.plantId.includes("pepper")) growthDays = 100

            harvestDate.setDate(plantedDate.getDate() + growthDays)

            // Check if the harvest date is today or in the past (within the last 7 days)
            const pastDate = new Date(today)
            pastDate.setDate(today.getDate() - 7)

            return isToday(harvestDate) || (isPast(harvestDate) && harvestDate > pastDate)
          })

          if (harvestablePlants.length > 0) {
            setPlantsToHarvest(harvestablePlants)
            setShowHarvestAlert(true)

            // Show toast notification
            toast({
              title: "Plants Ready for Harvest!",
              description: `You have ${harvestablePlants.length} plants ready to be harvested.`,
              variant: "default",
            })
          }
        }

        if (parsedGarden.dimensions) {
          setGardenDimensions(parsedGarden.dimensions)
        }
      } catch (error) {
        console.error("Error parsing garden data:", error)
      }
    }

    // Determine current season based on month
    const currentMonth = new Date().getMonth()
    if (currentMonth >= 2 && currentMonth <= 4) {
      setCurrentSeason("Spring")
      setRecommendedCrops([
        "Tomato",
        "Cucumber",
        "Pumpkin",
        "Bitter Gourd",
        "Bottle Gourd",
        "Okra",
        "Beans",
        "Spinach",
        "Marigold",
        "Zinnia",
      ])
    } else if (currentMonth >= 5 && currentMonth <= 7) {
      setCurrentSeason("Summer")
      setRecommendedCrops([
        "Okra (Bhindi)",
        "Cucumber",
        "Bottle Gourd",
        "Bitter Gourd",
        "Eggplant (Brinjal)",
        "Pumpkin",
        "Watermelon",
        "Muskmelon",
        "Sunflower",
        "Marigold",
      ])
    } else if (currentMonth >= 8 && currentMonth <= 10) {
      setCurrentSeason("Fall")
      setRecommendedCrops([
        "Carrot",
        "Radish",
        "Spinach",
        "Fenugreek",
        "Coriander",
        "Mustard",
        "Peas",
        "Cauliflower",
        "Cabbage",
        "Broccoli",
      ])
    } else {
      setCurrentSeason("Winter")
      setRecommendedCrops([
        "Spinach",
        "Fenugreek",
        "Coriander",
        "Mustard",
        "Peas",
        "Cauliflower",
        "Cabbage",
        "Carrot",
        "Radish",
        "Turnip",
      ])
    }
  }, [toast])

  // Get emoji for plant type
  const getPlantEmoji = (plantId: string) => {
    if (plantId.includes("tomato")) return "🍅"
    if (plantId.includes("carrot")) return "🥕"
    if (plantId.includes("lettuce")) return "🥬"
    if (plantId.includes("cucumber")) return "🥒"
    if (plantId.includes("pepper")) return "🫑"
    if (plantId.includes("broccoli")) return "🥦"
    if (plantId.includes("potato")) return "🥔"
    if (plantId.includes("onion")) return "🧅"
    if (plantId.includes("garlic")) return "🧄"
    if (plantId.includes("eggplant")) return "🍆"
    if (plantId.includes("corn")) return "🌽"
    if (plantId.includes("apple")) return "🍎"
    if (plantId.includes("strawberry")) return "🍓"
    if (plantId.includes("rose")) return "🌹"
    if (plantId.includes("tulip")) return "🌷"
    if (plantId.includes("sunflower")) return "🌻"
    return "🌱" // Default
  }

  return (
    <DashboardLayout>
      {showHarvestAlert && plantsToHarvest.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
              <Leaf className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-400">Plants Ready for Harvest!</h3>
              <p className="text-sm text-red-600 dark:text-red-300">
                You have {plantsToHarvest.length} plant{plantsToHarvest.length > 1 ? "s" : ""} ready to be harvested.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowHarvestAlert(false)}>
                Dismiss
              </Button>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/garden-planner">View Plants</Link>
              </Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {plantsToHarvest.slice(0, 3).map((plant, index) => (
              <Badge key={index} variant="outline" className="bg-white dark:bg-black">
                {getPlantEmoji(plant.plantId)} {plant.plantId.charAt(0).toUpperCase() + plant.plantId.slice(1)}
              </Badge>
            ))}
            {plantsToHarvest.length > 3 && (
              <Badge variant="outline" className="bg-white dark:bg-black">
                +{plantsToHarvest.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Weather Widget - First */}
        <div className="col-span-1">
          {weatherError ? (
            <FallbackWeather onRetry={retryWeather} />
          ) : (
            <WeatherWidget key={`weather-widget-${retryCount}`} onError={handleWeatherError} />
          )}
        </div>

        {/* Seasonal Crop Recommendations - Second */}
        <div className="col-span-1">
          <SeasonalCropRecommendations />
        </div>

        {/* My Garden Widget - Third */}
        <div className="col-span-1">
          <MyGardenWidget />
        </div>
      </div>

      {/* Plant Distribution - Fourth */}
      <div className="mt-4">
        <PlantDistribution />
      </div>
    </DashboardLayout>
  )
}
