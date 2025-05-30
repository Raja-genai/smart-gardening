"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getGardeningMethodsForPlant } from "@/data/gardening-methods"
import { fetchCsvData } from "@/utils/csv-parser"

interface PlantListProps {
  onPlantSelect?: (plant: Plant) => void
  className?: string
}

export interface Plant {
  id: string
  name: string
  type: string
  emoji: string
  season: string
  waterNeeds: string
  sunlight: string
  growthDuration: string
  spacing: string
  companionPlants?: string[]
  avoidPlants?: string[]
  description?: string
  harvestTime?: string
  soilType?: string
  methods?: string[]
}

// Define the plant data with the specified emojis
const PLANT_DATA: Plant[] = [
  // Vegetables
  {
    id: "tomato",
    name: "Tomato",
    type: "vegetable",
    emoji: "🍅",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "70-85 days",
    spacing: "45-60 cm",
  },
  {
    id: "spinach",
    name: "Spinach",
    type: "vegetable",
    emoji: "🥬",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "40-45 days",
    spacing: "15-20 cm",
  },
  {
    id: "broccoli",
    name: "Broccoli",
    type: "vegetable",
    emoji: "🥦",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "80-100 days",
    spacing: "45-60 cm",
  },
  {
    id: "onion",
    name: "Onion",
    type: "vegetable",
    emoji: "🧅",
    season: "winter",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "90-120 days",
    spacing: "10-15 cm",
  },
  {
    id: "carrot",
    name: "Carrot",
    type: "vegetable",
    emoji: "🥕",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "70-80 days",
    spacing: "5-8 cm",
  },
  {
    id: "cucumber",
    name: "Cucumber",
    type: "vegetable",
    emoji: "🥒",
    season: "summer",
    waterNeeds: "high",
    sunlight: "full",
    growthDuration: "50-70 days",
    spacing: "45-60 cm",
  },
  {
    id: "cauliflower",
    name: "Cauliflower",
    type: "vegetable",
    emoji: "🥬",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "85-100 days",
    spacing: "45-60 cm",
  },
  {
    id: "garlic",
    name: "Garlic",
    type: "vegetable",
    emoji: "🧄",
    season: "winter",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "240-270 days",
    spacing: "10-15 cm",
  },
  {
    id: "lettuce",
    name: "Lettuce",
    type: "vegetable",
    emoji: "🥬",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "45-60 days",
    spacing: "20-30 cm",
  },
  {
    id: "bell-pepper",
    name: "Bell Pepper",
    type: "vegetable",
    emoji: "🌶️",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "60-90 days",
    spacing: "45-60 cm",
  },
  {
    id: "cabbage",
    name: "Cabbage",
    type: "vegetable",
    emoji: "🥬",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "80-100 days",
    spacing: "45-60 cm",
  },
  {
    id: "potato",
    name: "Potato",
    type: "vegetable",
    emoji: "🥔",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "90-120 days",
    spacing: "30-40 cm",
  },
  {
    id: "sweet-potato",
    name: "Sweet Potato",
    type: "vegetable",
    emoji: "🍠",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "90-120 days",
    spacing: "30-40 cm",
  },
  {
    id: "peas",
    name: "Peas",
    type: "vegetable",
    emoji: "🌱",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "60-70 days",
    spacing: "5-8 cm",
  },
  {
    id: "beet",
    name: "Beet",
    type: "vegetable",
    emoji: "🧃",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "55-70 days",
    spacing: "10-15 cm",
  },
  {
    id: "eggplant",
    name: "Eggplant",
    type: "vegetable",
    emoji: "🍆",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "70-85 days",
    spacing: "45-60 cm",
  },
  {
    id: "green-beans",
    name: "Green Beans",
    type: "vegetable",
    emoji: "🌿",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "50-60 days",
    spacing: "10-15 cm",
  },
  {
    id: "corn",
    name: "Corn",
    type: "vegetable",
    emoji: "🌽",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "60-100 days",
    spacing: "20-30 cm",
  },
  {
    id: "zucchini",
    name: "Zucchini",
    type: "vegetable",
    emoji: "🥒",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "45-55 days",
    spacing: "60-90 cm",
  },
  {
    id: "radish",
    name: "Radish",
    type: "vegetable",
    emoji: "🌶️",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "20-30 days",
    spacing: "2-5 cm",
  },
  {
    id: "okra",
    name: "Okra",
    type: "vegetable",
    emoji: "🌶️",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "50-65 days",
    spacing: "30-45 cm",
  },
  {
    id: "asparagus",
    name: "Asparagus",
    type: "vegetable",
    emoji: "🌿",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "730-1095 days",
    spacing: "30-45 cm",
  },
  {
    id: "artichoke",
    name: "Artichoke",
    type: "vegetable",
    emoji: "🌻",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "85-100 days",
    spacing: "90-120 cm",
  },
  {
    id: "kale",
    name: "Kale",
    type: "vegetable",
    emoji: "🥬",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "55-75 days",
    spacing: "45-60 cm",
  },
  {
    id: "jerusalem-artichoke",
    name: "Jerusalem Artichoke",
    type: "vegetable",
    emoji: "🌻",
    season: "fall",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "120-150 days",
    spacing: "30-45 cm",
  },
  {
    id: "hot-peppers",
    name: "Hot Peppers",
    type: "vegetable",
    emoji: "🌶️",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "60-90 days",
    spacing: "45-60 cm",
  },
  {
    id: "mushrooms",
    name: "Mushrooms",
    type: "vegetable",
    emoji: "🍄",
    season: "all",
    waterNeeds: "high",
    sunlight: "shade",
    growthDuration: "14-21 days",
    spacing: "15-20 cm",
  },
  {
    id: "pumpkins",
    name: "Pumpkins",
    type: "vegetable",
    emoji: "🎃",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "90-120 days",
    spacing: "90-120 cm",
  },
  {
    id: "sugar-snap-peas",
    name: "Sugar Snap Peas",
    type: "vegetable",
    emoji: "🌱",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "60-70 days",
    spacing: "5-8 cm",
  },
  {
    id: "turnips",
    name: "Turnips",
    type: "vegetable",
    emoji: "🥔",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "40-60 days",
    spacing: "10-15 cm",
  },

  // Fruits
  {
    id: "mango",
    name: "Mango",
    type: "fruit",
    emoji: "🥭",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "3-5 years",
    spacing: "8-10 m",
  },
  {
    id: "banana",
    name: "Banana",
    type: "fruit",
    emoji: "🍌",
    season: "all",
    waterNeeds: "high",
    sunlight: "full",
    growthDuration: "9-12 months",
    spacing: "3-4 m",
  },
  {
    id: "apple",
    name: "Apple",
    type: "fruit",
    emoji: "🍎",
    season: "fall",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "3-5 years",
    spacing: "4-6 m",
  },
  {
    id: "orange",
    name: "Orange",
    type: "fruit",
    emoji: "🍊",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "3-5 years",
    spacing: "4-6 m",
  },
  {
    id: "pineapple",
    name: "Pineapple",
    type: "fruit",
    emoji: "🍍",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "18-24 months",
    spacing: "1-1.5 m",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    type: "fruit",
    emoji: "🍓",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "5-6 months",
    spacing: "30-45 cm",
  },
  {
    id: "watermelon",
    name: "Watermelon",
    type: "fruit",
    emoji: "🍉",
    season: "summer",
    waterNeeds: "high",
    sunlight: "full",
    growthDuration: "80-110 days",
    spacing: "1.8-2.4 m",
  },
  {
    id: "grapes",
    name: "Grapes",
    type: "fruit",
    emoji: "🍇",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "2-3 years",
    spacing: "1.8-2.4 m",
  },
  {
    id: "lemon",
    name: "Lemon",
    type: "fruit",
    emoji: "🍋",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "3-5 years",
    spacing: "3-4 m",
  },
  {
    id: "papaya",
    name: "Papaya",
    type: "fruit",
    emoji: "🍈",
    season: "all",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "9-12 months",
    spacing: "2-3 m",
  },

  // Flowers
  {
    id: "rose",
    name: "Rose",
    type: "flower",
    emoji: "🌹",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "1-2 years",
    spacing: "60-90 cm",
  },
  {
    id: "sunflower",
    name: "Sunflower",
    type: "flower",
    emoji: "🌻",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "70-100 days",
    spacing: "45-60 cm",
  },
  {
    id: "tulip",
    name: "Tulip",
    type: "flower",
    emoji: "🌷",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "3-4 months",
    spacing: "10-15 cm",
  },
  {
    id: "hibiscus",
    name: "Hibiscus",
    type: "flower",
    emoji: "🌺",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "2-3 years",
    spacing: "1-1.5 m",
  },
  {
    id: "lily",
    name: "Lily",
    type: "flower",
    emoji: "🌸",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "1-2 years",
    spacing: "20-30 cm",
  },
  {
    id: "cherry-blossom",
    name: "Cherry Blossom",
    type: "flower",
    emoji: "🌸",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "3-5 years",
    spacing: "4-6 m",
  },
  {
    id: "marigold",
    name: "Marigold",
    type: "flower",
    emoji: "🌼",
    season: "summer",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "45-50 days",
    spacing: "20-30 cm",
  },
  {
    id: "daisy",
    name: "Daisy",
    type: "flower",
    emoji: "🌼",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "60-70 days",
    spacing: "15-30 cm",
  },
  {
    id: "lotus",
    name: "Lotus",
    type: "flower",
    emoji: "🌸",
    season: "summer",
    waterNeeds: "high",
    sunlight: "full",
    growthDuration: "1-2 years",
    spacing: "60-90 cm",
  },
  {
    id: "jasmine",
    name: "Jasmine",
    type: "flower",
    emoji: "🌼",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "1-2 years",
    spacing: "1.8-2.4 m",
  },

  // Herbs
  {
    id: "basil",
    name: "Basil",
    type: "herb",
    emoji: "🌿",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "50-70 days",
    spacing: "20-25 cm",
  },
  {
    id: "mint",
    name: "Mint",
    type: "herb",
    emoji: "🌱",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "70-90 days",
    spacing: "30-45 cm",
  },
  {
    id: "coriander",
    name: "Coriander",
    type: "herb",
    emoji: "🌿",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "40-45 days",
    spacing: "10-15 cm",
  },
  {
    id: "thyme",
    name: "Thyme",
    type: "herb",
    emoji: "🌿",
    season: "spring",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "70-90 days",
    spacing: "20-30 cm",
  },
  {
    id: "oregano",
    name: "Oregano",
    type: "herb",
    emoji: "🌿",
    season: "spring",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "80-90 days",
    spacing: "20-30 cm",
  },
  {
    id: "parsley",
    name: "Parsley",
    type: "herb",
    emoji: "🌿",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "70-90 days",
    spacing: "15-20 cm",
  },
  {
    id: "rosemary",
    name: "Rosemary",
    type: "herb",
    emoji: "🌿",
    season: "spring",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "1-2 years",
    spacing: "60-90 cm",
  },
  {
    id: "chives",
    name: "Chives",
    type: "herb",
    emoji: "🌿",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "80-90 days",
    spacing: "15-30 cm",
  },
  {
    id: "lemongrass",
    name: "Lemongrass",
    type: "herb",
    emoji: "🌿",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "100-120 days",
    spacing: "60-90 cm",
  },
  {
    id: "dill",
    name: "Dill",
    type: "herb",
    emoji: "🌿",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "40-60 days",
    spacing: "15-30 cm",
  },
]

export function PlantList({ onPlantSelect, className = "" }: PlantListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [plants, setPlants] = useState<Plant[]>(PLANT_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Try to load plants from CSV first, fall back to hardcoded data
    const loadPlants = async () => {
      try {
        setIsLoading(true)

        // URLs to your CSV files (these should be hosted somewhere)
        const vegetablesCsvUrl = "https://example.com/vegetables.csv"
        const fruitsCsvUrl = "https://example.com/fruits.csv"
        const flowersCsvUrl = "https://example.com/flowers.csv"
        const herbsCsvUrl = "https://example.com/herbs.csv"

        // Try to fetch CSV data
        try {
          const [vegetablesData, fruitsData, flowersData, herbsData] = await Promise.all([
            fetchCsvData(vegetablesCsvUrl, "vegetable"),
            fetchCsvData(fruitsCsvUrl, "fruit"),
            fetchCsvData(flowersCsvUrl, "flower"),
            fetchCsvData(herbsCsvUrl, "herb"),
          ])

          // Combine all data
          const allPlants = [...vegetablesData, ...fruitsData, ...flowersData, ...herbsData]

          if (allPlants.length > 0) {
            setPlants(allPlants)
          } else {
            // Fall back to hardcoded data if CSV is empty
            setPlants(PLANT_DATA)
          }
        } catch (err) {
          console.log("Error loading CSV data, using hardcoded data instead:", err)
          setPlants(PLANT_DATA)
        }
      } catch (err) {
        console.error("Error loading plant data:", err)
        setError("Failed to load plant data. Using default data.")
        setPlants(PLANT_DATA)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlants()
  }, [])

  // Filter plants based on search term and active tab
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || plant.type === activeTab
    return matchesSearch && matchesTab
  })

  // Group plants by type for counting
  const plantCounts = {
    all: plants.length,
    vegetable: plants.filter((p) => p.type === "vegetable").length,
    fruit: plants.filter((p) => p.type === "fruit").length,
    flower: plants.filter((p) => p.type === "flower").length,
    herb: plants.filter((p) => p.type === "herb").length,
  }

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle>Plant List</CardTitle>
        <CardDescription>Browse and select plants for your garden</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search plants..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-6 pt-2">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="all" className="flex-1">
              All{" "}
              <Badge variant="outline" className="ml-1">
                {plantCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="vegetable" className="flex-1">
              Vegetables{" "}
              <Badge variant="outline" className="ml-1">
                {plantCounts.vegetable}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="fruit" className="flex-1">
              Fruits{" "}
              <Badge variant="outline" className="ml-1">
                {plantCounts.fruit}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="flower" className="flex-1">
              Flowers{" "}
              <Badge variant="outline" className="ml-1">
                {plantCounts.flower}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="herb" className="flex-1">
              Herbs{" "}
              <Badge variant="outline" className="ml-1">
                {plantCounts.herb}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <span className="ml-2">Loading plants...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md mb-4">
              {error}
            </div>
          ) : filteredPlants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No plants found matching your search.</p>
            </div>
          ) : (
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredPlants.map((plant) => {
                  // Get gardening methods for this plant
                  const methods = getGardeningMethodsForPlant(plant.id)

                  return (
                    <TooltipProvider key={plant.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-auto justify-start gap-2 px-3 py-2 w-full"
                            onClick={() => onPlantSelect?.(plant)}
                          >
                            <span className="text-xl">{plant.emoji}</span>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{plant.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {plant.growthDuration} • {plant.season}
                              </span>
                            </div>
                            {methods && methods.length > 0 && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {methods.length} method{methods.length !== 1 ? "s" : ""}
                              </Badge>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[300px]">
                          <div>
                            <p className="font-semibold">{plant.name}</p>
                            <p className="text-xs mt-1">
                              Water: {plant.waterNeeds} • Sunlight: {plant.sunlight}
                            </p>
                            <p className="text-xs">
                              Spacing: {plant.spacing} • Season: {plant.season}
                            </p>
                            {methods && methods.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold">Recommended methods:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {methods.map((method) => (
                                    <Badge key={method} variant="outline" className="text-xs">
                                      {method}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
