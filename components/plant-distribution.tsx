"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function PlantDistribution() {
  const [plantData, setPlantData] = useState<any[]>([])

  // Load data from localStorage
  useEffect(() => {
    const storedGarden = localStorage.getItem("garden-planner-data")
    if (storedGarden) {
      try {
        const parsedGarden = JSON.parse(storedGarden)
        if (parsedGarden.placedPlants) {
          setPlantData(parsedGarden.placedPlants)
        }
      } catch (error) {
        console.error("Error parsing garden data:", error)
      }
    }
  }, [])

  // Calculate plant distribution - memoized to prevent recalculation on every render
  const plantDistribution = useMemo(() => {
    const counts: Record<string, number> = {}

    plantData.forEach((plant) => {
      const type = getPlantType(plant.plantId)
      counts[type] = (counts[type] || 0) + 1
    })

    // Convert to array for chart
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: getColorForType(name),
    }))
  }, [plantData])

  // Helper function to determine plant type
  function getPlantType(plantId: string): string {
    if (!plantId) return "Other"

    if (
      plantId.includes("tomato") ||
      plantId.includes("carrot") ||
      plantId.includes("lettuce") ||
      plantId.includes("broccoli") ||
      plantId.includes("cucumber") ||
      plantId.includes("pepper") ||
      plantId.includes("onion") ||
      plantId.includes("potato") ||
      plantId.includes("cabbage") ||
      plantId.includes("spinach") ||
      plantId.includes("kale") ||
      plantId.includes("garlic") ||
      plantId.includes("eggplant") ||
      plantId.includes("zucchini") ||
      plantId.includes("peas") ||
      plantId.includes("beans") ||
      plantId.includes("corn") ||
      plantId.includes("radish") ||
      plantId.includes("okra") ||
      plantId.includes("asparagus") ||
      plantId.includes("artichoke") ||
      plantId.includes("mushroom") ||
      plantId.includes("pumpkin") ||
      plantId.includes("turnip") ||
      plantId.includes("kohlrabi") ||
      plantId.includes("rutabaga")
    ) {
      return "Vegetables"
    } else if (
      plantId.includes("apple") ||
      plantId.includes("strawberry") ||
      plantId.includes("watermelon") ||
      plantId.includes("banana") ||
      plantId.includes("orange") ||
      plantId.includes("grape") ||
      plantId.includes("pineapple") ||
      plantId.includes("mango") ||
      plantId.includes("cherry") ||
      plantId.includes("peach") ||
      plantId.includes("lemon") ||
      plantId.includes("kiwi") ||
      plantId.includes("avocado") ||
      plantId.includes("blueberry") ||
      plantId.includes("coconut")
    ) {
      return "Fruits"
    } else if (
      plantId.includes("rose") ||
      plantId.includes("tulip") ||
      plantId.includes("sunflower") ||
      plantId.includes("blossom") ||
      plantId.includes("cherry blossom") ||
      plantId.includes("hibiscus") ||
      plantId.includes("lotus") ||
      plantId.includes("marigold") ||
      plantId.includes("zinnia")
    ) {
      return "Flowers"
    } else if (
      plantId.includes("basil") ||
      plantId.includes("mint") ||
      plantId.includes("thyme") ||
      plantId.includes("oregano") ||
      plantId.includes("rosemary") ||
      plantId.includes("parsley") ||
      plantId.includes("cilantro") ||
      plantId.includes("dill") ||
      plantId.includes("sage") ||
      plantId.includes("chives")
    ) {
      return "Herbs"
    }

    return "Other"
  }

  // Helper function to get color for plant type
  function getColorForType(type: string): string {
    switch (type) {
      case "Vegetables":
        return "#4CAF50"
      case "Fruits":
        return "#FF9800"
      case "Flowers":
        return "#E91E63"
      case "Herbs":
        return "#9C27B0"
      default:
        return "#607D8B"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plant Distribution</CardTitle>
        <CardDescription>Overview of plant types in your garden</CardDescription>
      </CardHeader>
      <CardContent>
        {plantDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={plantDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {plantDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} plants`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <p>No plants in your garden yet</p>
            <p className="text-sm mt-2">Add plants to see distribution</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
