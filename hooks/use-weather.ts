"use client"

import { useState, useEffect } from "react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  description: string
  humidity: number
  rainfall: number
  windSpeed: number
  icon: string
  timestamp: string
  season: string
}

interface ForecastData {
  location: string
  country: string
  forecast: Array<{
    date: string
    temperature: number
    condition: string
    description: string
    humidity: number
    rainfall: number
    windSpeed: number
    icon: string
  }>
  timestamp: string
  season: string
}

export function useWeather(lat?: string, lon?: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      if (!lat || !lon) return

      setIsLoading(true)
      setError(null)

      try {
        // Use coordinates to create a location name
        let city = `Location (${lat}, ${lon})`

        // Try to get a city name using reverse geocoding if API key is available
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        if (apiKey) {
          try {
            const reverseGeocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
            const geoResponse = await fetch(reverseGeocodeUrl, {
              cache: "no-store",
            })

            if (geoResponse.ok) {
              const geoData = await geoResponse.json()
              if (geoData && geoData.length > 0) {
                city = geoData[0]?.name || city
              }
            }
          } catch (err) {
            console.warn("Error with reverse geocoding, using coordinates instead:", err)
          }
        }

        // Fetch current weather
        const weatherResponse = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
          cache: "no-store",
        })

        if (!weatherResponse.ok) {
          throw new Error(`Weather API error: ${weatherResponse.statusText}`)
        }

        const weatherData = await weatherResponse.json()
        setWeather(weatherData)

        // Fetch forecast
        const forecastResponse = await fetch(`/api/weather?city=${encodeURIComponent(city)}&forecast=true`, {
          cache: "no-store",
        })

        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json()
          setForecast(forecastData)
        }
      } catch (err: any) {
        console.error("Error fetching weather data:", err)
        setError(err.message || "Failed to fetch weather data")
      } finally {
        setIsLoading(false)
      }
    }

    if (lat && lon) {
      fetchWeather()
    }
  }, [lat, lon])

  return { weather, forecast, isLoading, error }
}
