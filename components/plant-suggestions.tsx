"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Info } from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Update the plant emoji mappings with the comprehensive lists provided by the user
const plantEmojis: Record<string, string> = {
  // Vegetables
  vegetables: "🥕",
  broccoli: "🥦",
  carrot: "🥕",
  corn: "🌽",
  cucumber: "🥒",
  garlic: "🧄",
  onion: "🧅",
  mushroom: "🍄",
  potato: "🥔",
  sweet_potato: "🍠",
  eggplant: "🍆",
  bell_pepper: "🫑",
  pepper: "🫑",
  hot_pepper: "🌶️",
  leafy_green: "🥬",
  lettuce: "🥬",
  green_salad: "🥗",
  tomato: "🍅",

  // Fruits
  fruits: "🍎",
  red_apple: "🍎",
  apple: "🍎",
  green_apple: "🍏",
  pear: "🍐",
  tangerine: "🍊",
  orange: "🍊",
  lemon: "🍋",
  banana: "🍌",
  watermelon: "🍉",
  grapes: "🍇",
  strawberry: "🍓",
  blueberries: "🫐",
  melon: "🍈",
  pineapple: "🍍",
  mango: "🥭",
  peach: "🍑",
  cherries: "🍒",
  cherry: "🍒",
  kiwi: "🥝",
  coconut: "🥥",
  olive: "🫒",

  // Flowers
  flowers: "🌷",
  cherry_blossom: "🌸",
  blossom: "🌼",
  sunflower: "🌻",
  hibiscus: "🌺",
  rose: "🌹",
  wilted_flower: "🥀",
  bouquet: "💐",
  lotus: "🪷",
  tulip: "🌷",

  // Herbs / Plants
  herbs: "🌿",
  herb: "🌿",
  leafy_plant: "🌿",
  four_leaf_clover: "🍀",
  clover: "🍀",
  leaf_fluttering: "🍃",
  fallen_leaf: "🍂",
  maple_leaf: "🍁",
  potted_plant: "🪴",
  seedling: "🌱",

  // Grains
  grain: "🌾",
  rice: "🌾",
  wheat: "🌾",

  // Default
  default: "🌱",
}

// For radish family and other vegetables without specific emojis
const plantSymbols: Record<string, string> = {
  // Use actual vegetable emojis for unknown plants as requested
  radish: "🥕",
  turnip: "🥕",
  beet: "b",
  rutabaga: "🥕",
  parsnip: "🥕",

  // Leafy greens
  spinach: "🥬",
  kale: "🥬",
  cabbage: "🥬",
  chard: "🥬",
  arugula: "🥬",
  collard_greens: "🥬",
  mustard_greens: "🥬",

  // Other vegetables
  asparagus: "🥦",
  artichoke: "🥦",
  brussels_sprouts: "🥬",
  cauliflower: "🥬",
  celery: "🥬",
  leek: "🧅",
  shallot: "🧅",
  okra: "🫑",
  zucchini: "🥒",
  squash: "🎃",
  pumpkin: "🎃",

  // Legumes
  peas: "🫛",
  beans: "🫘",
  chickpeas: "🫘",
  lentils: "🫘",

  // Root vegetables
  ginger: "🥔",
  taro: "🥔",
  yam: "🍠",
  cassava: "🥔",
  jicama: "🥔",
}

// Comprehensive list of vegetables - expanded
const allVegetables = [
  "Tomato",
  "Carrot",
  "Lettuce",
  "Spinach",
  "Cucumber",
  "Bell Pepper",
  "Broccoli",
  "Cauliflower",
  "Cabbage",
  "Onion",
  "Garlic",
  "Potato",
  "Sweet Potato",
  "Eggplant",
  "Zucchini",
  "Peas",
  "Green Beans",
  "Radish",
  "Beet",
  "Corn",
  "Okra",
  "Asparagus",
  "Artichoke",
  "Kale",
  "Celery",
  "Acorn Squash",
  "Butternut Squash",
  "Celeriac",
  "Fennel",
  "Hot Peppers",
  "Jerusalem Artichokes",
  "Kohlrabi",
  "Mushrooms",
  "Parsnips",
  "Pole Beans",
  "Pumpkins",
  "Rhubarb",
  "Rutabagas",
  "Sugar Snap Peas",
  "Summer Squash",
  "Sweet Peppers",
  "Turnips",
  "Bok Choy",
  "Brussels Sprouts",
  "Collard Greens",
  "Daikon",
  "Endive",
  "Leeks",
  "Mustard Greens",
  "Shallots",
  "Watercress",
  "Arugula",
  "Chard",
  "Chives",
  "Jicama",
  "Bamboo Shoots",
  "Tomatillo",
  "Yam",
  "Cassava",
  "Taro",
  "Water Chestnut",
  "Lotus Root",
  "Fiddlehead Ferns",
  "Napa Cabbage",
  "Radicchio",
  "Romanesco",
  "Salsify",
  "Sorrel",
  "Sunchoke",
  "Yuca",
  "Chayote",
]

// Add fruits, flowers, and herbs - expanded
const allFruits = [
  "Apple",
  "Green Apple",
  "Banana",
  "Orange",
  "Tangerine",
  "Strawberry",
  "Blueberry",
  "Raspberry",
  "Blackberry",
  "Watermelon",
  "Cantaloupe",
  "Honeydew",
  "Peach",
  "Pear",
  "Plum",
  "Cherry",
  "Grape",
  "Kiwi",
  "Mango",
  "Pineapple",
  "Papaya",
  "Guava",
  "Avocado",
  "Cherries",
  "Cherry Tomatoes",
  "Figs",
  "Grapefruit",
  "Heirloom Cantaloupes",
  "Heirloom Tomatoes",
  "Kumquats",
  "Lemons",
  "Meyer Lemons",
  "Limes",
  "Pomegranates",
  "Tangerines",
  "Tomatillos",
  "Apricot",
  "Dragonfruit",
  "Durian",
  "Jackfruit",
  "Lychee",
  "Passion Fruit",
  "Persimmon",
  "Quince",
  "Star Fruit",
  "Ugli Fruit",
  "Nectarine",
  "Mulberry",
  "Boysenberry",
  "Gooseberry",
  "Cranberry",
]

const allFlowers = [
  "Rose",
  "Tulip",
  "Sunflower",
  "Daisy",
  "Lily",
  "Marigold",
  "Zinnia",
  "Petunia",
  "Pansy",
  "Geranium",
  "Dahlia",
  "Chrysanthemum",
  "Lavender",
  "Cosmos",
  "Snapdragon",
  "Apple Blossoms",
  "Citrus Blossoms",
  "Citrus Geranium",
  "Dandelion",
  "Hibiscus",
  "Honeysuckle",
  "Impatiens",
  "Johnny-Jump-Ups",
  "Martha Washington",
  "Nasturtiums",
  "Nutmeg Geranium",
  "Pansies",
  "Peony",
  "Pineapple Guava",
  "Primrose",
  "Rose Geranium",
  "Squash Blossoms",
  "Violets",
  "Lotus",
  "Hyacinth",
  "Carnation",
  "Orchid",
  "Poppy",
  "Daffodil",
  "Iris",
  "Aster",
  "Begonia",
  "Camellia",
  "Forget-me-not",
  "Gardenia",
  "Morning Glory",
  "Rhododendron",
  "Wisteria",
  "Azalea",
  "Buttercup",
]

const allHerbs = [
  "Basil",
  "Mint",
  "Rosemary",
  "Thyme",
  "Oregano",
  "Sage",
  "Cilantro",
  "Parsley",
  "Dill",
  "Chives",
  "Tarragon",
  "Marjoram",
  "Lemongrass",
  "Bay Leaf",
  "Fennel",
  "Lavender",
  "Chamomile",
  "Anise",
  "Caraway",
  "Chervil",
  "Coriander",
  "Cumin",
  "Curry Leaf",
  "Epazote",
  "Fenugreek",
  "Hyssop",
  "Lemon Balm",
  "Lemon Verbena",
  "Lovage",
  "Peppermint",
  "Savory",
  "Sorrel",
  "Spearmint",
  "Stevia",
  "Sweet Cicely",
]

// Indian crops - expanded
const indianCrops = [
  "Rice",
  "Wheat",
  "Cotton",
  "Sugarcane",
  "Tea",
  "Coffee",
  "Mango",
  "Turmeric",
  "Ginger",
  "Black Pepper",
  "Okra (Bhindi)",
  "Eggplant (Brinjal)",
  "Bitter Gourd (Karela)",
  "Bottle Gourd (Lauki)",
  "Ridge Gourd (Turai)",
  "Fenugreek (Methi)",
  "Spinach (Palak)",
  "Mustard Greens (Sarson)",
  "Coriander (Dhania)",
  "Curry Leaf",
  "Jackfruit",
  "Lychee",
  "Guava",
  "Pomegranate",
  "Coconut",
  "Cardamom",
  "Clove",
  "Cinnamon",
  "Cumin",
  "Coriander Seeds",
  "Mustard Seeds",
  "Fenugreek Seeds",
  "Asafoetida (Hing)",
  "Tamarind",
  "Jaggery",
]

interface PlantSuggestionsProps {
  onSelectPlant: (plant: Plant) => void
  weatherCondition?: string
  temperature?: number
}

export interface Plant {
  id: string
  name: string
  type: string
  growthTime: number // in days
  waterNeeds: "low" | "medium" | "high"
  sunNeeds: "full" | "partial" | "shade"
  spacing: number // in cm
  description: string
  emoji?: string
  isIndianVariety?: boolean
}

// Update the PlantSuggestions component to better integrate with the garden visualizer
export function PlantSuggestions({ onSelectPlant, weatherCondition, temperature }: PlantSuggestionsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [plants, setPlants] = useState<Plant[]>([])

  // Generate plant data from the lists
  useEffect(() => {
    const generatePlantData = (name: string, type: string, isIndian = false): Plant => {
      const id = `${type}-${name.toLowerCase().replace(/\s+/g, "-")}`

      // Randomize plant properties for demonstration
      const growthTimes = {
        vegetables: { min: 30, max: 120 },
        fruits: { min: 60, max: 180 },
        flowers: { min: 20, max: 90 },
        herbs: { min: 15, max: 60 },
        grain: { min: 90, max: 150 }, // Add grain type
        default: { min: 30, max: 120 }, // Default values for any other type
      }

      const waterNeedsOptions = ["low", "medium", "high"] as const
      const sunNeedsOptions = ["full", "partial", "shade"] as const

      // Use the type if it exists in growthTimes, otherwise use default
      const range = growthTimes[type as keyof typeof growthTimes] || growthTimes.default
      const growthTime = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min

      const waterNeeds = waterNeedsOptions[Math.floor(Math.random() * waterNeedsOptions.length)]
      const sunNeeds = sunNeedsOptions[Math.floor(Math.random() * sunNeedsOptions.length)]
      const spacing = Math.floor(Math.random() * 40) + 10 // 10-50cm

      // Find emoji for the plant - improved matching algorithm
      let emoji = plantEmojis.default

      // First try direct name match (lowercase for case-insensitive matching)
      const plantNameLower = name.toLowerCase().replace(/\s+/g, "_")

      // Check for exact match first
      if (plantEmojis[plantNameLower]) {
        emoji = plantEmojis[plantNameLower]
      } else {
        // Then check for partial matches in the name
        for (const [key, value] of Object.entries(plantEmojis)) {
          if (plantNameLower.includes(key)) {
            emoji = value
            break
          }
        }
      }

      // If no emoji match, try symbols
      if (emoji === plantEmojis.default) {
        for (const [key, value] of Object.entries(plantSymbols)) {
          if (plantNameLower.includes(key)) {
            emoji = value
            break
          }
        }
      }

      // If still no match, use type
      if (emoji === plantEmojis.default) {
        emoji = plantEmojis[type.toLowerCase()] || plantEmojis.default
      }

      // Generate description
      const descriptions = [
        `${name} is a popular ${type} plant that grows well in ${sunNeeds} sun conditions.`,
        `${name} requires ${waterNeeds} water and takes about ${growthTime} days to mature.`,
        `${name} is a ${isIndian ? "traditional Indian" : "common"} ${type} that thrives in ${sunNeeds} sunlight.`,
        `${name} is perfect for beginners and needs ${waterNeeds} watering.`,
        `${name} is a beautiful ${type} that adds color and variety to any garden.`,
      ]

      return {
        id,
        name,
        type,
        growthTime,
        waterNeeds,
        sunNeeds,
        spacing,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        emoji,
        isIndianVariety: isIndian,
      }
    }

    // Create plant objects for each category
    const vegetables = allVegetables.map((name) => generatePlantData(name, "vegetables"))
    const fruits = allFruits.map((name) => generatePlantData(name, "fruits"))
    const flowers = allFlowers.map((name) => generatePlantData(name, "flowers"))
    const herbs = allHerbs.map((name) => generatePlantData(name, "herbs"))
    const indian = indianCrops.map((name) =>
      generatePlantData(name, name.includes("Rice") || name.includes("Wheat") ? "grain" : "vegetables", true),
    )

    setPlants([...vegetables, ...fruits, ...flowers, ...herbs, ...indian])
  }, [])

  // Add effect to generate plants based on weather
  useEffect(() => {
    if (weatherCondition || temperature) {
      // Adjust plant recommendations based on weather
      let filteredPlants = [...plants]

      if (weatherCondition?.toLowerCase().includes("rain")) {
        // During rainy weather, prioritize plants that like moisture
        filteredPlants = filteredPlants.map((plant) => ({
          ...plant,
          recommended: plant.waterNeeds === "high" ? true : false,
        }))
      } else if (temperature && temperature > 30) {
        // During hot weather, prioritize heat-tolerant plants
        filteredPlants = filteredPlants.map((plant) => ({
          ...plant,
          recommended: plant.sunNeeds === "full" ? true : false,
        }))
      } else if (temperature && temperature < 15) {
        // During cold weather, prioritize cold-tolerant plants
        filteredPlants = filteredPlants.map((plant) => ({
          ...plant,
          recommended: plant.waterNeeds === "low" ? true : false,
        }))
      }

      setPlants(filteredPlants)
    }
  }, [weatherCondition, temperature, plants])

  // Filter plants based on search query and active tab
  const getFilteredPlants = () => {
    let filteredPlants = [...plants]

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "indian") {
        filteredPlants = filteredPlants.filter((plant) => plant.isIndianVariety)
      } else {
        filteredPlants = filteredPlants.filter((plant) => plant.type === activeTab)
      }
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filteredPlants = filteredPlants.filter(
        (plant) =>
          plant.name.toLowerCase().includes(query) ||
          plant.description.toLowerCase().includes(query) ||
          plant.type.toLowerCase().includes(query),
      )
    }

    // Filter by weather conditions if provided
    if (weatherCondition && temperature) {
      // Suggest plants appropriate for the current weather
      if (weatherCondition.toLowerCase().includes("rain")) {
        // During rainy weather, suggest plants that like moisture
        filteredPlants = filteredPlants.filter((plant) => plant.waterNeeds === "high")
      } else if (temperature > 30) {
        // During hot weather, suggest heat-tolerant plants
        filteredPlants = filteredPlants.filter((plant) => plant.sunNeeds === "full")
      } else if (temperature < 15) {
        // During cold weather, suggest cold-tolerant plants
        filteredPlants = filteredPlants.filter((plant) => plant.waterNeeds === "low")
      }
    }

    return filteredPlants
  }

  const filteredPlants = getFilteredPlants()

  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant)
    setIsDialogOpen(true)
  }

  const handleSelectPlant = () => {
    if (selectedPlant) {
      onSelectPlant(selectedPlant)
      setIsDialogOpen(false)
    }
  }

  // Get motivational quotes based on plant type
  const getMotivationalQuote = (type: string) => {
    const quotes = {
      vegetables: [
        "Growing vegetables is like printing your own money.",
        "The greatest gift of the garden is the restoration of the five senses.",
        "To plant a garden is to believe in tomorrow.",
      ],
      fruits: [
        "The trees that are slow to grow bear the best fruit.",
        "A fruit is a vegetable with looks and money.",
        "Patience is bitter, but its fruit is sweet.",
      ],
      flowers: [
        "Where flowers bloom, so does hope.",
        "A flower does not think of competing with the flower next to it. It just blooms.",
        "Let your dreams blossom.",
      ],
      herbs: [
        "Herbs are the friend of physicians and the praise of cooks.",
        "Fresh herbs make all the difference in the world.",
        "Life is like herbs and spices, it's all about how you use them.",
      ],
      default: [
        "The glory of gardening: hands in the dirt, head in the sun, heart with nature.",
        "A garden is a grand teacher. It teaches patience and careful watchfulness.",
        "Gardening is the art that uses flowers and plants as paint, and the soil and sky as canvas.",
      ],
    }

    const typeQuotes = quotes[type as keyof typeof quotes] || quotes.default
    return typeQuotes[Math.floor(Math.random() * typeQuotes.length)]
  }

  // Add a weather-aware recommendation badge
  const getWeatherRecommendation = (plant: Plant) => {
    if (!weatherCondition && !temperature) return null

    let isRecommended = false
    let recommendationReason = ""

    if (weatherCondition?.toLowerCase().includes("rain") && plant.waterNeeds === "high") {
      isRecommended = true
      recommendationReason = "Perfect for rainy weather"
    } else if (temperature && temperature > 30 && plant.sunNeeds === "full") {
      isRecommended = true
      recommendationReason = "Heat tolerant"
    } else if (temperature && temperature < 15 && plant.waterNeeds === "low") {
      isRecommended = true
      recommendationReason = "Cold resistant"
    }

    return isRecommended ? (
      <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        {recommendationReason}
      </Badge>
    ) : null
  }

  // Update the plant card rendering to include weather recommendations
  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search plants..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
          <TabsTrigger value="fruits">Fruits</TabsTrigger>
          <TabsTrigger value="flowers">Flowers</TabsTrigger>
          <TabsTrigger value="herbs">Herbs</TabsTrigger>
          <TabsTrigger value="indian">Indian</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {/* Motivational quote */}
          <motion.div
            className="bg-muted p-4 rounded-lg mb-4 text-center italic"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            "{getMotivationalQuote(activeTab === "all" ? "default" : activeTab)}"
          </motion.div>

          {filteredPlants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No plants found matching your search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredPlants.map((plant) => (
                <motion.div
                  key={plant.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Card className="overflow-hidden cursor-pointer relative" onClick={() => handlePlantClick(plant)}>
                    {getWeatherRecommendation(plant)}
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 p-3 border-b">
                        <div className="text-4xl">{plant.emoji}</div>
                        <div>
                          <div className="font-medium">{plant.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {plant.type} • {plant.growthTime} days
                          </div>
                        </div>
                        {plant.isIndianVariety && (
                          <Badge className="ml-auto bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                            Indian
                          </Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm line-clamp-2">{plant.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex gap-2 text-xs">
                            <span className={`px-2 py-0.5 rounded-full ${getWaterNeedsColor(plant.waterNeeds)}`}>
                              {plant.waterNeeds} water
                            </span>
                            <span className={`px-2 py-0.5 rounded-full ${getSunNeedsColor(plant.sunNeeds)}`}>
                              {plant.sunNeeds} sun
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePlantClick(plant)
                            }}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedPlant?.emoji}</span>
              {selectedPlant?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedPlant?.type.charAt(0).toUpperCase() + selectedPlant?.type.slice(1)}
              {selectedPlant?.isIndianVariety && " • Indian Variety"}
            </DialogDescription>
          </DialogHeader>

          {selectedPlant && (
            <div className="space-y-4">
              <p>{selectedPlant.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm font-medium">Growth Time</div>
                  <div className="text-2xl">{selectedPlant.growthTime} days</div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm font-medium">Spacing</div>
                  <div className="text-2xl">{selectedPlant.spacing} cm</div>
                </div>
                <div className={`p-3 rounded-lg ${getWaterNeedsColor(selectedPlant.waterNeeds)}`}>
                  <div className="text-sm font-medium">Water Needs</div>
                  <div className="text-2xl capitalize">{selectedPlant.waterNeeds}</div>
                </div>
                <div className={`p-3 rounded-lg ${getSunNeedsColor(selectedPlant.sunNeeds)}`}>
                  <div className="text-sm font-medium">Sun Needs</div>
                  <div className="text-2xl capitalize">{selectedPlant.sunNeeds}</div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSelectPlant}>Select Plant</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// Helper functions for styling
function getWaterNeedsColor(waterNeeds: string) {
  switch (waterNeeds) {
    case "low":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
    case "medium":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
    case "high":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

function getSunNeedsColor(sunNeeds: string) {
  switch (sunNeeds) {
    case "full":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
    case "partial":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
    case "shade":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}
