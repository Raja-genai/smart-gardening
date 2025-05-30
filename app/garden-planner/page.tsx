"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Edit2, Trash2, RefreshCw, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchCSVData } from "@/utils/csv-parser"
import { getMethodsForPlant } from "@/data/gardening-methods"

interface Plant {
  id: string
  name: string
  type: string
  emoji: string
  growthDays: number
  description: string
  waterNeeds: "low" | "medium" | "high"
  sunNeeds: "shade" | "partial" | "full"
}

interface PlacedPlant {
  id: string
  plantId: string
  x: number
  y: number
  plantedDate: string
}

export default function GardenPlannerPage() {
  const [gardenName, setGardenName] = useState("My First Garden")
  const [location, setLocation] = useState("New Delhi, Delhi")
  const [gardenWidth, setGardenWidth] = useState(5)
  const [gardenHeight, setGardenHeight] = useState(5)
  const [activeTab, setActiveTab] = useState("visualizer")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [placedPlants, setPlacedPlants] = useState<PlacedPlant[]>([])
  const [isEditingSizeDialogOpen, setIsEditingSizeDialogOpen] = useState(false)
  const [tempWidth, setTempWidth] = useState(5)
  const [tempHeight, setTempHeight] = useState(5)
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load plants from CSV files
  useEffect(() => {
    async function loadPlantData() {
      setIsLoading(true)
      try {
        // URLs for the CSV files
        const vegetablesUrl =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vegetables-sInYxBx38SrSSvD2jVsGkIwGuphiRd.csv"
        const herbsUrl =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/herbs-nb4rlB9nY5MozRdGSpr8jMvaPBN6JX.csv"
        const flowersUrl =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flowers-U9ojFCMKf07bEKLgZ4YfDCGrecblAD.csv"
        const fruitsUrl =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fruits-YyVQoOYj9phDE8G1XZyYGKBvN53qkf.csv"

        // Fetch and parse all CSV data in parallel
        const [vegetables, herbs, flowers, fruits] = await Promise.all([
          fetchCSVData(vegetablesUrl, "Vegetables"),
          fetchCSVData(herbsUrl, "Herbs"),
          fetchCSVData(flowersUrl, "Flowers"),
          fetchCSVData(fruitsUrl, "Fruits"),
        ])

        // Combine all plant data
        const allPlants = [...vegetables, ...herbs, ...flowers, ...fruits]
        setPlants(allPlants)
      } catch (error) {
        console.error("Error loading plant data:", error)
        toast({
          title: "Error loading plant data",
          description: "Could not load plant data. Using default plants instead.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPlantData()
  }, [toast])

  // Load garden data from localStorage on component mount
  useEffect(() => {
    const storedGarden = localStorage.getItem("garden-planner-data")
    if (storedGarden) {
      try {
        const parsedGarden = JSON.parse(storedGarden)
        if (parsedGarden.gardenName) setGardenName(parsedGarden.gardenName)
        if (parsedGarden.location) setLocation(parsedGarden.location)
        if (parsedGarden.dimensions) {
          setGardenWidth(parsedGarden.dimensions.width || 5)
          setGardenHeight(parsedGarden.dimensions.height || 5)
          setTempWidth(parsedGarden.dimensions.width || 5)
          setTempHeight(parsedGarden.dimensions.height || 5)
        }
        if (parsedGarden.placedPlants) setPlacedPlants(parsedGarden.placedPlants)
      } catch (error) {
        console.error("Error parsing garden data:", error)
      }
    }
  }, [])

  // Save garden data whenever it changes
  useEffect(() => {
    const gardenData = {
      gardenName,
      location,
      dimensions: {
        width: gardenWidth,
        height: gardenHeight,
      },
      placedPlants,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem("garden-planner-data", JSON.stringify(gardenData))
  }, [gardenName, location, gardenWidth, gardenHeight, placedPlants])

  // Filter plants based on search term and active filter
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === "All" || plant.type === activeFilter
    return matchesSearch && matchesFilter
  })

  // Handle plant placement in the garden
  const handlePlantPlacement = (x: number, y: number) => {
    if (!selectedPlant) return

    // Check if there's already a plant at this position
    const existingPlantIndex = placedPlants.findIndex((plant) => plant.x === x && plant.y === y)

    if (existingPlantIndex >= 0) {
      // Replace the existing plant
      const updatedPlants = [...placedPlants]
      updatedPlants[existingPlantIndex] = {
        id: `${selectedPlant.id}-${Date.now()}`,
        plantId: selectedPlant.id,
        x,
        y,
        plantedDate: new Date().toISOString(),
      }
      setPlacedPlants(updatedPlants)
    } else {
      // Add a new plant
      setPlacedPlants([
        ...placedPlants,
        {
          id: `${selectedPlant.id}-${Date.now()}`,
          plantId: selectedPlant.id,
          x,
          y,
          plantedDate: new Date().toISOString(),
        },
      ])
    }

    toast({
      title: "Plant Added",
      description: `${selectedPlant.name} has been added to your garden.`,
    })
  }

  // Handle removing a plant from the garden
  const handleRemovePlant = (x: number, y: number) => {
    setPlacedPlants(placedPlants.filter((plant) => !(plant.x === x && plant.y === y)))
  }

  // Clear the entire garden
  const clearGarden = () => {
    if (confirm("Are you sure you want to clear all plants from your garden?")) {
      setPlacedPlants([])
      toast({
        title: "Garden Cleared",
        description: "All plants have been removed from your garden.",
      })
    }
  }

  // Handle garden size update
  const handleSizeUpdate = () => {
    setGardenWidth(tempWidth)
    setGardenHeight(tempHeight)
    setIsEditingSizeDialogOpen(false)

    toast({
      title: "Garden Size Updated",
      description: `Garden dimensions set to ${tempWidth}×${tempHeight}.`,
    })
  }

  // Get plant by ID
  const getPlantById = (id: string) => {
    return plants.find((plant) => plant.id === id) || null
  }

  // Count plants by type
  const countPlantsByType = () => {
    const counts: Record<string, number> = {}

    placedPlants.forEach((placedPlant) => {
      const plant = getPlantById(placedPlant.plantId)
      if (plant) {
        counts[plant.type] = (counts[plant.type] || 0) + 1
      }
    })

    return counts
  }

  const plantCounts = countPlantsByType()

  // Render garden grid
  const renderGardenGrid = () => {
    const grid = []

    for (let y = 0; y < gardenHeight; y++) {
      const row = []
      for (let x = 0; x < gardenWidth; x++) {
        const placedPlant = placedPlants.find((plant) => plant.x === x && plant.y === y)
        const plant = placedPlant ? getPlantById(placedPlant.plantId) : null

        let cellContent
        if (plant) {
          cellContent = (
            <div
              className="w-full h-full flex items-center justify-center text-2xl cursor-pointer"
              onClick={() => handleRemovePlant(x, y)}
              title={`${plant.name} (Click to remove)`}
            >
              {plant.emoji}
            </div>
          )
        } else {
          cellContent = (
            <div
              className="w-full h-full bg-green-100 dark:bg-green-900/20 cursor-pointer"
              onClick={() => selectedPlant && handlePlantPlacement(x, y)}
            />
          )
        }

        row.push(
          <div key={`cell-${x}-${y}`} className="border border-green-200 dark:border-green-800 aspect-square">
            {cellContent}
          </div>,
        )
      }
      grid.push(
        <div key={`row-${y}`} className="grid grid-cols-5">
          {row}
        </div>,
      )
    }

    return <div className="border-2 border-green-300 dark:border-green-700 rounded-md overflow-hidden">{grid}</div>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Garden Planner</h1>
          <p className="text-muted-foreground">Design your garden layout and plan your plantings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={gardenName}
                      onChange={(e) => setGardenName(e.target.value)}
                      className="text-lg font-medium w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditingSizeDialogOpen(true)}>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit Size
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                  <span className="ml-4">
                    {gardenWidth} × {gardenHeight} ({gardenWidth * gardenHeight}m²)
                  </span>
                </div>

                <Tabs defaultValue="visualizer" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="visualizer">Garden Visualizer</TabsTrigger>
                    <TabsTrigger value="plantlist">Plant List</TabsTrigger>
                  </TabsList>

                  <TabsContent value="visualizer" className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select a plant from the Plant List tab to place it on the grid
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="font-medium">Garden Plot</div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={clearGarden} title="Clear Garden">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" title="Refresh">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {renderGardenGrid()}

                    <div className="mt-4 text-sm text-muted-foreground">
                      Select a plant from the Plant List tab to place it on the grid
                    </div>
                  </TabsContent>

                  <TabsContent value="plantlist" className="pt-4">
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search plants..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {["All", "Vegetables", "Fruits", "Flowers", "Herbs"].map((filter) => (
                          <Button
                            key={filter}
                            variant={activeFilter === filter ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveFilter(filter)}
                          >
                            {filter}
                          </Button>
                        ))}
                      </div>

                      <div className="bg-muted p-4 rounded-md text-center italic">
                        "Gardening is the art that uses flowers and plants as paint, and the soil and sky as canvas."
                      </div>

                      {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {filteredPlants.map((plant) => {
                            const methods = getMethodsForPlant(plant.name)

                            return (
                              <Card
                                key={plant.id}
                                className={`cursor-pointer hover:border-primary ${
                                  selectedPlant?.id === plant.id ? "border-primary" : ""
                                }`}
                                onClick={() => setSelectedPlant(plant)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">{plant.emoji}</span>
                                    <div className="flex-1">
                                      <div className="font-medium">{plant.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {plant.type} • {plant.growthDays} Days
                                      </div>
                                    </div>
                                    {methods.length > 0 && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <Info className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent className="w-64 p-3">
                                            <div className="space-y-2">
                                              <p className="font-medium">Recommended Gardening Methods:</p>
                                              {methods.map((method) => (
                                                <div key={method.id} className="flex items-start gap-2">
                                                  <span>{method.icon}</span>
                                                  <div>
                                                    <p className="font-medium">{method.method}</p>
                                                    <p className="text-xs">{method.description}</p>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>

                                  <p className="text-sm mt-2">{plant.description}</p>

                                  <div className="flex gap-2 mt-3">
                                    <Badge
                                      variant="outline"
                                      className={`${
                                        plant.waterNeeds === "low"
                                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                                          : plant.waterNeeds === "medium"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                            : "bg-blue-200 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200"
                                      }`}
                                    >
                                      {plant.waterNeeds === "low"
                                        ? "low water"
                                        : plant.waterNeeds === "medium"
                                          ? "medium water"
                                          : "high water"}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={`${
                                        plant.sunNeeds === "shade"
                                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                          : plant.sunNeeds === "partial"
                                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                                      }`}
                                    >
                                      {plant.sunNeeds === "shade"
                                        ? "shade"
                                        : plant.sunNeeds === "partial"
                                          ? "partial sun"
                                          : "full sun"}
                                    </Badge>

                                    {methods.length > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                      >
                                        {methods[0].icon} {methods[0].method}
                                      </Badge>
                                    )}
                                  </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}

                      {!isLoading && filteredPlants.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-2">
                          No plants found matching your search criteria
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Garden Summary</CardTitle>
                <CardDescription>Overview of your garden plants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm">Total Plants:</div>
                  <div className="text-sm font-medium text-right">{placedPlants.length}</div>

                  <div className="text-sm">Garden Area:</div>
                  <div className="text-sm font-medium text-right">{gardenWidth * gardenHeight}m²</div>

                  <div className="text-sm">Plant Types:</div>
                  <div className="text-sm font-medium text-right">{Object.keys(plantCounts).length}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Plants by Type:</div>

                  {Object.entries(plantCounts).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            type === "Vegetables"
                              ? "bg-green-500"
                              : type === "Fruits"
                                ? "bg-pink-500"
                                : type === "Flowers"
                                  ? "bg-blue-500"
                                  : "bg-green-300"
                          }`}
                        ></div>
                        <span>{type}</span>
                      </div>
                      <span>{count}</span>
                    </div>
                  ))}

                  {placedPlants.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-2">No plants in your garden yet</div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Recently Added Plants:</div>

                  {placedPlants
                    .sort((a, b) => new Date(b.plantedDate).getTime() - new Date(a.plantedDate).getTime())
                    .slice(0, 5)
                    .map((placedPlant) => {
                      const plant = getPlantById(placedPlant.plantId)
                      if (!plant) return null

                      return (
                        <div key={placedPlant.id} className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400">{plant?.emoji || "🌱"}</span>
                          <div>
                            <div className="text-sm">{plant?.name || "Unknown Plant"}</div>
                            <div className="text-xs text-muted-foreground">
                              Added on {new Date(placedPlant.plantedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                  {placedPlants.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-2">No plants added yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Garden Size Dialog */}
      <Dialog open={isEditingSizeDialogOpen} onOpenChange={setIsEditingSizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Garden Size</DialogTitle>
            <DialogDescription>
              Adjust the dimensions of your garden plot. Note that reducing the size may remove plants outside the new
              boundaries.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (meters)</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  max="20"
                  value={tempWidth}
                  onChange={(e) => setTempWidth(Number.parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (meters)</Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  max="20"
                  value={tempHeight}
                  onChange={(e) => setTempHeight(Number.parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Total area: {tempWidth * tempHeight}m²</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingSizeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSizeUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
