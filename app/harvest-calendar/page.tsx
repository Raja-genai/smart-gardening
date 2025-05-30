"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Leaf, CalendarIcon, Filter } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"

interface HarvestInfo {
  id: string
  name: string
  type: string
  category: string
  sowingSeason: string[]
  harvestingSeason: string[]
  region: string[]
  description: string
}

export default function HarvestCalendarPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [harvestData, setHarvestData] = useState<HarvestInfo[]>([])
  const [filteredData, setFilteredData] = useState<HarvestInfo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeView, setActiveView] = useState("calendar")

  const seasons = ["Winter", "Spring", "Summer", "Monsoon", "Autumn"]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/auth")
    }

    // Load harvest calendar data
    const harvestCalendarData: HarvestInfo[] = [
      {
        id: "h1",
        name: "Rice",
        type: "grain",
        category: "food grain",
        sowingSeason: ["Summer", "Monsoon"],
        harvestingSeason: ["Autumn", "Winter"],
        region: ["All India", "Eastern India", "Southern India"],
        description: "Main kharif crop sown during monsoon and harvested in autumn/winter.",
      },
      {
        id: "h2",
        name: "Wheat",
        type: "grain",
        category: "food grain",
        sowingSeason: ["Autumn", "Winter"],
        harvestingSeason: ["Spring"],
        region: ["Northern India", "Central India"],
        description: "Main rabi crop sown in winter and harvested in spring.",
      },
      {
        id: "h3",
        name: "Maize",
        type: "grain",
        category: "food grain",
        sowingSeason: ["Spring", "Monsoon"],
        harvestingSeason: ["Summer", "Autumn"],
        region: ["All India"],
        description: "Can be grown as both kharif and rabi crop depending on the region.",
      },
      {
        id: "h4",
        name: "Cotton",
        type: "fiber",
        category: "cash crop",
        sowingSeason: ["Summer", "Monsoon"],
        harvestingSeason: ["Autumn", "Winter"],
        region: ["Western India", "Central India"],
        description: "Sown at the onset of monsoon and harvested in autumn/winter.",
      },
      {
        id: "h5",
        name: "Sugarcane",
        type: "sugar",
        category: "cash crop",
        sowingSeason: ["Autumn", "Winter"],
        harvestingSeason: ["Winter", "Spring"],
        region: ["Northern India", "Southern India"],
        description: "Long duration crop that takes about 12-18 months to mature.",
      },
      {
        id: "h6",
        name: "Tomato",
        type: "vegetable",
        category: "horticultural",
        sowingSeason: ["Spring", "Autumn"],
        harvestingSeason: ["Summer", "Winter"],
        region: ["All India"],
        description: "Can be grown year-round in different regions with proper care.",
      },
      {
        id: "h7",
        name: "Mango",
        type: "fruit",
        category: "horticultural",
        sowingSeason: ["Winter"],
        harvestingSeason: ["Summer"],
        region: ["All India except high altitude areas"],
        description: "Flowers in winter and fruits are harvested in summer.",
      },
      {
        id: "h8",
        name: "Turmeric",
        type: "spice",
        category: "horticultural",
        sowingSeason: ["Summer", "Monsoon"],
        harvestingSeason: ["Winter"],
        region: ["Southern India", "Eastern India"],
        description: "Planted before or during monsoon and harvested after 8-10 months.",
      },
      {
        id: "h9",
        name: "Tea",
        type: "beverage",
        category: "plantation crop",
        sowingSeason: ["Spring"],
        harvestingSeason: ["Spring", "Summer", "Monsoon", "Autumn"],
        region: ["Assam", "West Bengal", "Tamil Nadu"],
        description: "Plucking of leaves continues throughout the growing season.",
      },
      {
        id: "h10",
        name: "Coffee",
        type: "beverage",
        category: "plantation crop",
        sowingSeason: ["Monsoon"],
        harvestingSeason: ["Winter"],
        region: ["Karnataka", "Kerala", "Tamil Nadu"],
        description: "Berries are harvested when they turn bright red.",
      },
      {
        id: "h11",
        name: "Okra (Bhindi)",
        type: "vegetable",
        category: "horticultural",
        sowingSeason: ["Spring", "Monsoon"],
        harvestingSeason: ["Summer", "Autumn"],
        region: ["All India"],
        description: "Fast-growing vegetable that can be harvested within 2 months of sowing.",
      },
      {
        id: "h12",
        name: "Mustard",
        type: "oilseed",
        category: "cash crop",
        sowingSeason: ["Autumn"],
        harvestingSeason: ["Winter", "Spring"],
        region: ["Northern India", "Central India"],
        description: "Important rabi oilseed crop sown after monsoon and harvested in winter/spring.",
      },
    ]

    setHarvestData(harvestCalendarData)
    setFilteredData(harvestCalendarData)
  }, [router])

  useEffect(() => {
    // Filter data based on search query, selected season, region, and category
    let filtered = harvestData

    // Apply season filter
    if (selectedSeason !== "all") {
      filtered = filtered.filter(
        (item) => item.sowingSeason.includes(selectedSeason) || item.harvestingSeason.includes(selectedSeason),
      )
    }

    // Apply region filter
    if (selectedRegion !== "all") {
      filtered = filtered.filter((item) => item.region.some((region) => region.includes(selectedRegion)))
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      )
    }

    setFilteredData(filtered)
  }, [searchQuery, selectedSeason, selectedRegion, selectedCategory, harvestData])

  const getMonthsForSeason = (season: string): number[] => {
    switch (season) {
      case "Winter":
        return [11, 0, 1] // Dec, Jan, Feb
      case "Spring":
        return [2, 3, 4] // Mar, Apr, May
      case "Summer":
        return [4, 5, 6] // May, Jun, Jul
      case "Monsoon":
        return [6, 7, 8] // Jul, Aug, Sep
      case "Autumn":
        return [9, 10, 11] // Oct, Nov, Dec
      default:
        return []
    }
  }

  const renderCalendarView = () => {
    return (
      <div className="space-y-6">
        {seasons.map((season) => (
          <Card key={season} className="overflow-hidden">
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle>{season} Season</CardTitle>
              <CardDescription>
                {getMonthsForSeason(season)
                  .map((monthIndex) => months[monthIndex])
                  .join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-green-700 dark:text-green-500 mb-2">Sowing</h3>
                  <div className="flex flex-wrap gap-2">
                    {filteredData
                      .filter((item) => item.sowingSeason.includes(season))
                      .map((item) => (
                        <Badge
                          key={`sow-${item.id}`}
                          variant="outline"
                          className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                        >
                          {item.name}
                        </Badge>
                      ))}
                    {filteredData.filter((item) => item.sowingSeason.includes(season)).length === 0 && (
                      <p className="text-sm text-gray-500">
                        No crops for sowing in this season based on current filters.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-amber-700 dark:text-amber-500 mb-2">Harvesting</h3>
                  <div className="flex flex-wrap gap-2">
                    {filteredData
                      .filter((item) => item.harvestingSeason.includes(season))
                      .map((item) => (
                        <Badge
                          key={`harvest-${item.id}`}
                          variant="outline"
                          className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                        >
                          {item.name}
                        </Badge>
                      ))}
                    {filteredData.filter((item) => item.harvestingSeason.includes(season)).length === 0 && (
                      <p className="text-sm text-gray-500">
                        No crops for harvesting in this season based on current filters.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderListView = () => {
    return (
      <div className="space-y-3">
        {filteredData.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 h-16 w-16 rounded-full flex items-center justify-center shrink-0">
                  <Leaf className="h-8 w-8 text-green-600 dark:text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-xs text-gray-500">
                        {item.type} • {item.category}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 text-xs"
                      >
                        Sow: {item.sowingSeason.join(", ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 text-xs"
                      >
                        Harvest: {item.harvestingSeason.join(", ")}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                  <div className="mt-2">
                    <span className="text-xs font-medium">Regions: </span>
                    <span className="text-xs text-gray-500">{item.region.join(", ")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Harvest Calendar</h1>
          <div className="flex gap-2">
            <Button
              variant={activeView === "calendar" ? "default" : "outline"}
              className={activeView === "calendar" ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={() => setActiveView("calendar")}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button
              variant={activeView === "list" ? "default" : "outline"}
              className={activeView === "list" ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={() => setActiveView("list")}
            >
              <Leaf className="h-4 w-4 mr-2" />
              Crop List
            </Button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search crops..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Season</label>
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger>
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                {seasons.map((season) => (
                  <SelectItem key={season} value={season}>
                    {season}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Region</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Northern India">Northern India</SelectItem>
                <SelectItem value="Southern India">Southern India</SelectItem>
                <SelectItem value="Eastern India">Eastern India</SelectItem>
                <SelectItem value="Western India">Western India</SelectItem>
                <SelectItem value="Central India">Central India</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
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
        </div>

        {filteredData.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                  <CalendarIcon className="h-8 w-8 text-green-600 dark:text-green-500" />
                </div>
                <h2 className="text-xl font-semibold">No Crops Found</h2>
                <p className="text-gray-500 max-w-md">
                  No crops match your current filter criteria. Try adjusting your filters or search query.
                </p>
                <Button
                  className="mt-2 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedSeason("all")
                    setSelectedRegion("all")
                    setSelectedCategory("all")
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : activeView === "calendar" ? (
          renderCalendarView()
        ) : (
          renderListView()
        )}
      </div>
    </DashboardLayout>
  )
}
