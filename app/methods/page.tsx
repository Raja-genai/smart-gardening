"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { gardeningMethods } from "@/data/gardening-methods"

export default function GardeningMethodsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter methods based on search term
  const filteredMethods = gardeningMethods.filter((method) => {
    const matchesMethod = method.method.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDescription = method.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlants = method.suitable_plants.some((plant) => plant.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesMethod || matchesDescription || matchesPlants
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gardening Methods</h1>
          <p className="text-muted-foreground">
            Discover different gardening techniques and find the best method for your plants
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search methods or plants..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMethods.map((method) => (
            <Card key={method.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{method.icon}</span>
                  <div>
                    <CardTitle>{method.method}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="text-sm font-medium mb-2">Suitable Plants:</h4>
                <div className="flex flex-wrap gap-2">
                  {method.suitable_plants.map((plant) => (
                    <span
                      key={`${method.id}-${plant}`}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    >
                      {plant}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMethods.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No gardening methods found matching your search criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
