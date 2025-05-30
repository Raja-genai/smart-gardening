"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"

interface Plant {
  id: string
  name: string
  type: string
  emoji: string
}

interface GardenVisualizerProps {
  width: number
  height: number
  onPlantPlaced?: (plant: Plant, x: number, y: number) => void
  initialPlants?: Array<Plant & { x: number; y: number }>
  selectedPlant?: Plant | null
  className?: string
}

export function GardenVisualizer({
  width,
  height,
  onPlantPlaced,
  initialPlants = [],
  selectedPlant,
  className,
}: GardenVisualizerProps) {
  const [grid, setGrid] = useState<Array<Array<(Plant & { x: number; y: number }) | null>>>([])

  // Initialize grid
  useEffect(() => {
    const newGrid = Array(height)
      .fill(null)
      .map(() => Array(width).fill(null))

    // Place initial plants
    initialPlants.forEach((plant) => {
      if (plant.x >= 0 && plant.x < width && plant.y >= 0 && plant.y < height) {
        newGrid[plant.y][plant.x] = plant
      }
    })

    setGrid(newGrid)
  }, [width, height, initialPlants])

  // Handle cell click
  const handleCellClick = (x: number, y: number) => {
    if (!selectedPlant) return

    const newGrid = [...grid]
    const existingPlant = newGrid[y][x]

    if (existingPlant) {
      // If there's already a plant, remove it
      newGrid[y][x] = null
    } else {
      // Otherwise, place the selected plant
      const plantWithPosition = {
        ...selectedPlant,
        x,
        y,
      }
      newGrid[y][x] = plantWithPosition

      // Call the callback if provided
      if (onPlantPlaced) {
        onPlantPlaced(selectedPlant, x, y)
      }
    }

    setGrid(newGrid)
  }

  // Handle reset grid
  const handlePlanGarden = () => {
    // This would typically navigate to the garden planner page
    window.location.href = "/garden-planner"
  }

  // Check if garden is empty
  const isGardenEmpty = !initialPlants || initialPlants.length === 0

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          Garden Plot ({width}×{height}m²)
        </h3>
        <Button variant="outline" size="sm" onClick={handlePlanGarden} className="flex items-center gap-1">
          Edit Garden <span className="ml-1">→</span>
        </Button>
      </div>

      {isGardenEmpty ? (
        <div className="border-2 border-green-600 dark:border-green-700 rounded-md overflow-hidden bg-amber-50 dark:bg-amber-900/20 flex flex-col items-center justify-center py-16">
          <div className="text-gray-400 mb-4">
            <Leaf className="h-16 w-16 mx-auto opacity-30" />
          </div>
          <p className="text-muted-foreground mb-6">No plants in your garden yet</p>
          <Button onClick={handlePlanGarden} className="bg-green-600 hover:bg-green-700">
            Plan Your Garden
          </Button>
        </div>
      ) : (
        <div className="border-2 border-green-600 dark:border-green-700 rounded-md overflow-hidden">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`cell-${x}-${y}`}
                  className="border border-green-200/30 dark:border-green-800/30 aspect-square"
                  style={{
                    backgroundColor: "#8B4513", // Brown soil color
                    backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.1) 2px, transparent 2px)",
                    backgroundSize: "8px 8px",
                  }}
                  onClick={() => handleCellClick(x, y)}
                >
                  {cell && (
                    <div
                      className="w-full h-full flex items-center justify-center text-2xl cursor-pointer"
                      title={`${cell.name} (Click to remove)`}
                    >
                      {cell.emoji}
                    </div>
                  )}
                </div>
              )),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
