"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Leaf, Bug, ArrowLeft, Thermometer, Droplets, Sun, Clock, Ruler, Filter } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Plant {
  id: string
  name: string
  scientificName: string
  type: string
  description: string
  growingSeason: string
  waterNeeds: string
  sunlight: string
  soilType: string
  spacing: string
  daysToHarvest: string
  temperature: string
  region: string
  isIndianVariety: boolean
  category?: string
}

interface Pest {
  id: string
  name: string
  description: string
  affectedPlants: string[]
  symptoms: string[]
  management: string[]
  prevention: string[]
  image: string
}

export default function GuidePage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("plants")
  const [plants, setPlants] = useState<Plant[]>([])
  const [pests, setPests] = useState<Pest[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
  const [filteredPests, setFilteredPests] = useState<Pest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [selectedPest, setSelectedPest] = useState<Pest | null>(null)
  const [isPlantDialogOpen, setIsPlantDialogOpen] = useState(false)
  const [isPestDialogOpen, setIsPestDialogOpen] = useState(false)
  const [activePlantFilter, setActivePlantFilter] = useState("all")
  const [activePlantCategory, setActivePlantCategory] = useState("all")

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/auth")
    }

    // Load plant data
    const plantData: Plant[] = [
      {
        id: "p1",
        name: "Tomato (Desi)",
        scientificName: "Solanum lycopersicum",
        type: "vegetable",
        category: "horticultural",
        description:
          "A versatile vegetable that grows well in most parts of India. Requires regular watering and full sun.",
        growingSeason: "Winter in South India, Summer in North India",
        waterNeeds: "Regular, consistent moisture",
        sunlight: "Full sun (6-8 hours)",
        soilType: "Loam, well-drained",
        spacing: "60-90 cm apart",
        daysToHarvest: "70-85 days",
        temperature: "21-24°C",
        region: "All India",
        isIndianVariety: true,
      },
      {
        id: "p2",
        name: "Okra (Bhindi)",
        scientificName: "Abelmoschus esculentus",
        type: "vegetable",
        category: "horticultural",
        description:
          "A popular vegetable in Indian cuisine that thrives in warm weather. Drought-tolerant once established.",
        growingSeason: "Summer and Monsoon",
        waterNeeds: "Moderate",
        sunlight: "Full sun",
        soilType: "Loam, sandy",
        spacing: "45-60 cm apart",
        daysToHarvest: "50-65 days",
        temperature: "24-30°C",
        region: "All India",
        isIndianVariety: true,
      },
      {
        id: "p3",
        name: "Rice",
        scientificName: "Oryza sativa",
        type: "grain",
        category: "food grain",
        description: "The primary staple food in India, grown extensively in various regions. Requires abundant water.",
        growingSeason: "Kharif (monsoon) season",
        waterNeeds: "High, standing water",
        sunlight: "Full sun",
        soilType: "Clay, loam",
        spacing: "20 cm apart",
        daysToHarvest: "110-150 days",
        temperature: "20-35°C",
        region: "All India, especially eastern and southern regions",
        isIndianVariety: true,
      },
      {
        id: "p4",
        name: "Wheat",
        scientificName: "Triticum aestivum",
        type: "grain",
        category: "food grain",
        description: "An important staple food in northern India. Grown in the winter season.",
        growingSeason: "Rabi (winter) season",
        waterNeeds: "Moderate",
        sunlight: "Full sun",
        soilType: "Loam, clay-loam",
        spacing: "Row spacing of 15-20 cm",
        daysToHarvest: "120-150 days",
        temperature: "15-25°C",
        region: "Northern India",
        isIndianVariety: true,
      },
      {
        id: "p5",
        name: "Cotton",
        scientificName: "Gossypium hirsutum",
        type: "fiber",
        category: "cash crop",
        description: "A major fiber crop, with India being a significant producer and exporter.",
        growingSeason: "Kharif (monsoon) season",
        waterNeeds: "Moderate",
        sunlight: "Full sun",
        soilType: "Black cotton soil, loam",
        spacing: "60-90 cm apart",
        daysToHarvest: "150-180 days",
        temperature: "20-30°C",
        region: "Central and Western India",
        isIndianVariety: true,
      },
      {
        id: "p6",
        name: "Sugarcane",
        scientificName: "Saccharum officinarum",
        type: "sugar",
        category: "cash crop",
        description: "Used for producing sugar and other products. A long-duration crop.",
        growingSeason: "Year-round planting possible",
        waterNeeds: "High",
        sunlight: "Full sun",
        soilType: "Loam, clay-loam",
        spacing: "90-120 cm between rows",
        daysToHarvest: "10-12 months",
        temperature: "20-35°C",
        region: "Uttar Pradesh, Maharashtra, Karnataka",
        isIndianVariety: true,
      },
      {
        id: "p7",
        name: "Tea",
        scientificName: "Camellia sinensis",
        type: "beverage",
        category: "plantation crop",
        description: "One of the most popular beverages, grown in regions like Assam and Darjeeling.",
        growingSeason: "Year-round harvesting",
        waterNeeds: "High",
        sunlight: "Partial shade",
        soilType: "Well-drained, acidic soil",
        spacing: "1-1.5 meters apart",
        daysToHarvest: "3-5 years for first harvest, then continuous",
        temperature: "18-30°C",
        region: "Assam, West Bengal, Tamil Nadu",
        isIndianVariety: true,
      },
      {
        id: "p8",
        name: "Coffee",
        scientificName: "Coffea arabica",
        type: "beverage",
        category: "plantation crop",
        description: "Grown in states like Karnataka and Kerala, a popular beverage worldwide.",
        growingSeason: "Harvesting in winter",
        waterNeeds: "Moderate to high",
        sunlight: "Partial shade",
        soilType: "Well-drained, rich in organic matter",
        spacing: "2-3 meters apart",
        daysToHarvest: "3-4 years for first harvest, then annual",
        temperature: "15-25°C",
        region: "Karnataka, Kerala, Tamil Nadu",
        isIndianVariety: true,
      },
      {
        id: "p9",
        name: "Mango",
        scientificName: "Mangifera indica",
        type: "fruit",
        category: "horticultural",
        description:
          "The king of fruits in India with numerous local varieties. Requires warm climate and protection from frost.",
        growingSeason: "Fruits in summer",
        waterNeeds: "Moderate, drought-tolerant when mature",
        sunlight: "Full sun",
        soilType: "Loam, well-drained",
        spacing: "8-10 meters apart",
        daysToHarvest: "4-5 months after flowering",
        temperature: "24-30°C",
        region: "All India except high altitude areas",
        isIndianVariety: true,
      },
      {
        id: "p10",
        name: "Turmeric",
        scientificName: "Curcuma longa",
        type: "spice",
        category: "horticultural",
        description: "A bright yellow spice used in cooking and traditional medicine. India is a major producer.",
        growingSeason: "Planting in summer, harvesting in winter",
        waterNeeds: "Moderate",
        sunlight: "Partial shade to full sun",
        soilType: "Loam, rich in organic matter",
        spacing: "20-30 cm apart",
        daysToHarvest: "8-10 months",
        temperature: "20-30°C",
        region: "Andhra Pradesh, Tamil Nadu, Odisha",
        isIndianVariety: true,
      },
      {
        id: "p11",
        name: "Ginger",
        scientificName: "Zingiber officinale",
        type: "spice",
        category: "horticultural",
        description: "A pungent spice used in cooking and traditional medicine. Grown as a rhizome.",
        growingSeason: "Planting in summer, harvesting in winter",
        waterNeeds: "Moderate to high",
        sunlight: "Partial shade",
        soilType: "Loam, rich in organic matter",
        spacing: "20-25 cm apart",
        daysToHarvest: "8-10 months",
        temperature: "20-30°C",
        region: "Kerala, Meghalaya, Arunachal Pradesh",
        isIndianVariety: true,
      },
      {
        id: "p12",
        name: "Black Pepper",
        scientificName: "Piper nigrum",
        type: "spice",
        category: "horticultural",
        description: "Known as the 'King of Spices', a climbing vine that produces peppercorns.",
        growingSeason: "Harvesting in winter",
        waterNeeds: "High",
        sunlight: "Partial shade",
        soilType: "Well-drained, rich in organic matter",
        spacing: "2-3 meters apart",
        daysToHarvest: "3-4 years for first harvest, then annual",
        temperature: "20-30°C",
        region: "Kerala, Karnataka, Tamil Nadu",
        isIndianVariety: true,
      },
    ]

    // Load pest data
    const pestData: Pest[] = [
      {
        id: "p1",
        name: "Aphids",
        description:
          "Small sap-sucking insects that can appear in a range of colors including green, black, brown, and pink. They cluster on new growth and the undersides of leaves.",
        affectedPlants: ["Roses", "Tomatoes", "Peppers", "Cabbage", "Beans"],
        symptoms: [
          "Curled or distorted leaves",
          "Yellowing leaves",
          "Stunted growth",
          "Sticky honeydew on leaves and stems",
          "Black sooty mold growing on honeydew",
        ],
        management: [
          "Spray plants with strong water jet to dislodge aphids",
          "Apply neem oil or insecticidal soap",
          "Introduce natural predators like ladybugs or lacewings",
          "For severe infestations, use organic or chemical insecticides",
        ],
        prevention: [
          "Regularly inspect plants, especially new growth",
          "Avoid excessive nitrogen fertilization",
          "Plant trap crops like nasturtiums",
          "Encourage beneficial insects in your garden",
        ],
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "p2",
        name: "Whiteflies",
        description:
          "Small, white, moth-like insects that feed on plant sap. They are commonly found on the undersides of leaves and fly up in clouds when disturbed.",
        affectedPlants: ["Tomatoes", "Eggplants", "Peppers", "Okra", "Cabbage"],
        symptoms: [
          "Yellowing leaves",
          "Stunted plant growth",
          "Sticky honeydew on leaves",
          "Black sooty mold",
          "White insects flying when plants are disturbed",
        ],
        management: [
          "Use yellow sticky traps to catch adults",
          "Apply insecticidal soap or neem oil",
          "Introduce natural predators like parasitic wasps",
          "For severe infestations, use appropriate insecticides",
        ],
        prevention: [
          "Regularly inspect plants, especially undersides of leaves",
          "Remove and destroy heavily infested plants",
          "Avoid excessive nitrogen fertilization",
          "Use reflective mulches to repel whiteflies",
        ],
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "p3",
        name: "Rice Stem Borer",
        description: "A serious pest of rice crops that bores into the stem, causing damage to the plant.",
        affectedPlants: ["Rice"],
        symptoms: [
          "Dead heart (dead central shoot) in vegetative stage",
          "White earhead (whitish empty panicle) in reproductive stage",
          "Holes in the stem",
          "Yellowing of plants",
          "Reduced yield",
        ],
        management: [
          "Use resistant rice varieties",
          "Apply appropriate insecticides at recommended doses",
          "Release natural enemies like parasitoids",
          "Remove and destroy affected plants",
        ],
        prevention: [
          "Adjust planting time to avoid peak pest periods",
          "Maintain clean field conditions",
          "Remove stubble after harvest",
          "Balanced fertilizer application",
        ],
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "p4",
        name: "Cotton Bollworm",
        description: "A major pest of cotton that feeds on cotton bolls, causing significant damage to the crop.",
        affectedPlants: ["Cotton", "Tomatoes", "Corn", "Chickpea"],
        symptoms: [
          "Holes in bolls/fruits",
          "Shedding of damaged bolls",
          "Presence of frass (excrement)",
          "Larvae feeding inside the bolls",
          "Reduced yield and quality",
        ],
        management: [
          "Use Bt cotton varieties where available",
          "Apply appropriate insecticides at recommended doses",
          "Use pheromone traps for monitoring",
          "Implement integrated pest management strategies",
        ],
        prevention: [
          "Early sowing to escape peak infestation",
          "Crop rotation",
          "Destroy crop residues after harvest",
          "Maintain field sanitation",
        ],
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "p5",
        name: "Mango Hopper",
        description: "Small insects that feed on mango inflorescence, causing significant damage to mango production.",
        affectedPlants: ["Mango"],
        symptoms: [
          "Withering and drying of inflorescence",
          "Shedding of flowers and young fruits",
          "Presence of honeydew and sooty mold",
          "Hoppers jumping when disturbed",
          "Reduced fruit set and yield",
        ],
        management: [
          "Apply appropriate insecticides before flowering",
          "Use sticky traps",
          "Prune dense canopy to improve air circulation",
          "Apply neem-based products",
        ],
        prevention: [
          "Regular orchard sanitation",
          "Avoid excessive nitrogen application",
          "Maintain proper spacing between trees",
          "Encourage natural enemies",
        ],
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "p6",
        name: "Coffee Berry Borer",
        description:
          "A small beetle that is one of the most serious pests of coffee worldwide, attacking the coffee berries.",
        affectedPlants: ["Coffee"],
        symptoms: [
          "Small holes in coffee berries",
          "Premature falling of berries",
          "Tunnels inside berries",
          "Presence of beetles inside berries",
          "Reduced yield and quality",
        ],
        management: [
          "Regular harvesting of ripe berries",
          "Apply appropriate insecticides",
          "Use traps with attractants",
          "Biological control with fungi",
        ],
        prevention: [
          "Maintain good field sanitation",
          "Remove and destroy infested berries",
          "Prune coffee plants properly",
          "Avoid berry accumulation on the ground",
        ],
        image: "/placeholder.svg?height=200&width=200",
      },
    ]

    setPlants(plantData)
    setPests(pestData)
    setFilteredPlants(plantData)
    setFilteredPests(pestData)
  }, [router])

  useEffect(() => {
    // Filter plants based on search query, active filter, and category
    let filtered = plants

    // Apply type filter
    if (activePlantFilter !== "all") {
      filtered = filtered.filter((plant) => plant.type === activePlantFilter)
    }

    // Apply category filter
    if (activePlantCategory !== "all") {
      filtered = filtered.filter((plant) => plant.category === activePlantCategory)
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (plant) =>
          plant.name.toLowerCase().includes(query) ||
          plant.scientificName.toLowerCase().includes(query) ||
          plant.description.toLowerCase().includes(query) ||
          plant.region.toLowerCase().includes(query),
      )
    }

    setFilteredPlants(filtered)

    // Filter pests based on search query
    if (searchQuery.trim() === "") {
      setFilteredPests(pests)
    } else {
      const query = searchQuery.toLowerCase()
      const filteredPests = pests.filter(
        (pest) =>
          pest.name.toLowerCase().includes(query) ||
          pest.description.toLowerCase().includes(query) ||
          pest.affectedPlants.some((plant) => plant.toLowerCase().includes(query)),
      )
      setFilteredPests(filteredPests)
    }
  }, [searchQuery, plants, pests, activePlantFilter, activePlantCategory])

  const handlePlantSelect = (plant: Plant) => {
    setSelectedPlant(plant)
    setIsPlantDialogOpen(true)
  }

  const handlePestSelect = (pest: Pest) => {
    setSelectedPest(pest)
    setIsPestDialogOpen(true)
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Garden Guide</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plants" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span>Plants</span>
            </TabsTrigger>
            <TabsTrigger value="pests" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              <span>Pests</span>
            </TabsTrigger>
          </TabsList>

          <div className="relative my-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder={activeTab === "plants" ? "Search plants..." : "Search pests or plants..."}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {activeTab === "plants" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activePlantFilter === "all" ? "default" : "outline"}
                  className={activePlantFilter === "all" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => setActivePlantFilter("all")}
                >
                  All Types
                </Button>
                <Button
                  variant={activePlantFilter === "vegetable" ? "default" : "outline"}
                  className={activePlantFilter === "vegetable" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => setActivePlantFilter("vegetable")}
                >
                  Vegetables
                </Button>
                <Button
                  variant={activePlantFilter === "fruit" ? "default" : "outline"}
                  className={activePlantFilter === "fruit" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => setActivePlantFilter("fruit")}
                >
                  Fruits
                </Button>
                <Button
                  variant={activePlantFilter === "grain" ? "default" : "outline"}
                  className={activePlantFilter === "grain" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => setActivePlantFilter("grain")}
                >
                  Grains
                </Button>
                <Button
                  variant={activePlantFilter === "spice" ? "default" : "outline"}
                  className={activePlantFilter === "spice" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => setActivePlantFilter("spice")}
                >
                  Spices
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Category:</span>
                <Select value={activePlantCategory} onValueChange={setActivePlantCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="food grain">Food Grains</SelectItem>
                    <SelectItem value="cash crop">Cash Crops</SelectItem>
                    <SelectItem value="plantation crop">Plantation Crops</SelectItem>
                    <SelectItem value="horticultural">Horticultural Crops</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="grid" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPlants.map((plant) => (
                      <Card
                        key={plant.id}
                        className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                        onClick={() => handlePlantSelect(plant)}
                      >
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                              <Leaf className="h-5 w-5 text-green-600 dark:text-green-500" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{plant.name}</h3>
                              <p className="text-xs text-gray-500 italic">{plant.scientificName}</p>
                            </div>
                          </div>
                          {plant.isIndianVariety && (
                            <Badge
                              variant="outline"
                              className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 text-xs"
                            >
                              Indian
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{plant.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Sun className="h-3 w-3 text-yellow-500" />
                              <span>{plant.sunlight}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Droplets className="h-3 w-3 text-blue-500" />
                              <span>{plant.waterNeeds}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Thermometer className="h-3 w-3 text-red-500" />
                              <span>{plant.temperature}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-purple-500" />
                              <span>{plant.daysToHarvest}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="pt-4">
                  <div className="space-y-3">
                    {filteredPlants.map((plant) => (
                      <Card
                        key={plant.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handlePlantSelect(plant)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-green-100 dark:bg-green-900/30 h-16 w-16 rounded-full flex items-center justify-center shrink-0">
                              <Leaf className="h-8 w-8 text-green-600 dark:text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{plant.name}</h3>
                                  <p className="text-xs text-gray-500 italic">{plant.scientificName}</p>
                                </div>
                                {plant.isIndianVariety && (
                                  <Badge
                                    variant="outline"
                                    className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 text-xs"
                                  >
                                    Indian
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-1 mt-1">{plant.description}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {plant.growingSeason}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {plant.region}
                                </Badge>
                                {plant.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {plant.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "pests" && (
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPests.map((pest) => (
                    <Card
                      key={pest.id}
                      className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                      onClick={() => handlePestSelect(pest)}
                    >
                      <div className="bg-gray-100 dark:bg-gray-800 h-40 flex items-center justify-center">
                        <Bug className="h-16 w-16 text-gray-400" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle>{pest.name}</CardTitle>
                        <CardDescription>
                          Affects: {pest.affectedPlants.slice(0, 3).join(", ")}
                          {pest.affectedPlants.length > 3 && ", ..."}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 line-clamp-2">{pest.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="list" className="pt-4">
                <div className="space-y-3">
                  {filteredPests.map((pest) => (
                    <Card
                      key={pest.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handlePestSelect(pest)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-100 dark:bg-gray-800 h-16 w-16 rounded-full flex items-center justify-center shrink-0">
                            <Bug className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{pest.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{pest.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="font-medium">Affects:</span> {pest.affectedPlants.slice(0, 3).join(", ")}
                              {pest.affectedPlants.length > 3 && ", ..."}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <Dialog open={isPlantDialogOpen} onOpenChange={setIsPlantDialogOpen}>
            <DialogContent className="max-w-3xl">
              {selectedPlant && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{selectedPlant.name}</DialogTitle>
                    <DialogDescription>
                      <span className="italic">{selectedPlant.scientificName}</span> •{" "}
                      {selectedPlant.type.charAt(0).toUpperCase() + selectedPlant.type.slice(1)}
                      {selectedPlant.category && ` • ${selectedPlant.category}`}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="bg-green-50 dark:bg-green-900/20 h-48 flex items-center justify-center rounded-lg">
                      <Leaf className="h-24 w-24 text-green-600 dark:text-green-500" />
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPlant.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Sun className="h-5 w-5 text-yellow-500" />
                          <h4 className="font-medium">Sunlight</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">{selectedPlant.sunlight}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-5 w-5 text-blue-500" />
                          <h4 className="font-medium">Water Needs</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">{selectedPlant.waterNeeds}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-5 w-5 text-red-500" />
                          <h4 className="font-medium">Temperature</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">{selectedPlant.temperature}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-brown-500"
                          >
                            <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                            <path d="M2 9h18" />
                            <path d="M9 2v18" />
                          </svg>
                          <h4 className="font-medium">Soil Type</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">{selectedPlant.soilType}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Ruler className="h-5 w-5 text-gray-500" />
                          <h4 className="font-medium">Spacing</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">{selectedPlant.spacing}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-purple-500" />
                          <h4 className="font-medium">Days to Harvest</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">{selectedPlant.daysToHarvest}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Growing Season</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPlant.growingSeason}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Region</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPlant.region}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsPlantDialogOpen(false)}
                      className="flex items-center gap-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to List
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isPestDialogOpen} onOpenChange={setIsPestDialogOpen}>
            <DialogContent className="max-w-3xl">
              {selectedPest && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{selectedPest.name}</DialogTitle>
                    <DialogDescription>Pest identification and management guide</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="bg-gray-100 dark:bg-gray-800 h-48 flex items-center justify-center rounded-lg">
                      <Bug className="h-24 w-24 text-gray-400" />
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPest.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Affected Plants</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPest.affectedPlants.map((plant) => (
                          <div
                            key={plant}
                            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                          >
                            <Leaf className="h-3 w-3" />
                            {plant}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Symptoms</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {selectedPest.symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Management</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {selectedPest.management.map((method, index) => (
                          <li key={index}>{method}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Prevention</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {selectedPest.prevention.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsPestDialogOpen(false)}
                      className="flex items-center gap-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to List
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
