"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, RefreshCw } from "lucide-react"

interface FallbackWeatherProps {
  className?: string
  onRetry?: () => void
}

export function FallbackWeather({ className, onRetry }: FallbackWeatherProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Weather Conditions</h2>
        </div>

        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <p className="mb-4">Unable to load weather data at this time.</p>

          {onRetry && (
            <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>

        <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
          <p className="font-medium mb-1">Garden Tip:</p>
          <p className="text-sm">
            Even without weather data, you can check your plants daily. Most garden plants need about 1-2 inches of
            water per week, either from rainfall or irrigation.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
