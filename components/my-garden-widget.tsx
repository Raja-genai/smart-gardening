"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Link from "next/link"

export function MyGardenWidget() {
  const [gardenData, setGardenData] = useState<{
    dimensions: { width: number; height: number }
    placedPlants: any[]
  } | null>(null)

  useEffect(() => {
    // Load garden data from localStorage
    const storedGarden = localStorage.getItem("garden-planner-data")
    if (storedGarden) {
      try {
        const parsedGarden = JSON.parse(storedGarden)
        setGardenData(parsedGarden)
      } catch (error) {
        console.error("Error parsing garden data:", error)
      }
    }
  }, [])

  const width = gardenData?.dimensions?.width || 5
  const height = gardenData?.dimensions?.height || 5
  const placedPlants = gardenData?.placedPlants || []

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

  // Render garden grid for dashboard (smaller version)
  const renderGardenGrid = () => {
    const grid = []
    const displayWidth = Math.min(width, 3)
    const displayHeight = Math.min(height, 3)

    for (let y = 0; y < displayHeight; y++) {
      const row = []
      for (let x = 0; x < displayWidth; x++) {
        // Find plants at this position
        const placedPlant = placedPlants.find((plant) => plant.x === x && plant.y === y)

        let cellContent
        if (placedPlant) {
          const emoji = getPlantEmoji(placedPlant.plantId)
          cellContent = (
            <div
              className="w-full h-full flex items-center justify-center text-2xl"
              style={{ textShadow: "0 2px 2px rgba(0,0,0,0.2)" }}
            >
              {emoji}
            </div>
          )
        } else {
          cellContent = <div className="w-full h-full" />
        }

        row.push(
          <div
            key={`cell-${x}-${y}`}
            className="border border-green-800/30 dark:border-green-800/30 aspect-square"
            style={{
              background: "#8B4513", // Brown soil color
              backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.1) 2px, transparent 2px)",
              backgroundSize: "8px 8px",
            }}
          >
            {cellContent}
          </div>,
        )
      }
      grid.push(
        <div key={`row-${y}`} className="grid" style={{ gridTemplateColumns: `repeat(${displayWidth}, 1fr)` }}>
          {row}
        </div>,
      )
    }

    return (
      <div
        className="border-2 border-green-600 dark:border-green-700 rounded-md overflow-hidden"
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div>{grid}</div>
        {width > displayWidth || height > displayHeight ? (
          <div className="text-xs text-center p-1 bg-muted/50">
            Showing {displayWidth}×{displayHeight} of {width}×{height} garden
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-semibold">My Garden</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Current state of your garden plot - {placedPlants.length} plants in {width}×{height}m plot
        </p>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Garden Plot</h3>
          <Button asChild variant="outline" size="sm">
            <Link href="/garden-planner">
              Edit Garden <span className="ml-1">→</span>
            </Link>
          </Button>
        </div>

        {placedPlants.length > 0 ? (
          renderGardenGrid()
        ) : (
          <div className="border-2 border-green-600 dark:border-green-700 rounded-md p-8 flex flex-col items-center justify-center gap-4 min-h-[200px] bg-amber-50 dark:bg-amber-900/20">
            <div className="text-gray-300 dark:text-gray-600">
              <Leaf className="h-16 w-16" />
            </div>
            <p className="text-muted-foreground text-center">No plants in your garden yet</p>
            <Button asChild className="mt-2 bg-green-600 hover:bg-green-700">
              <Link href="/garden-planner">Plan Your Garden</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
