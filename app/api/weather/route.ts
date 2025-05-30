import { type NextRequest, NextResponse } from "next/server"
import { getSeason } from "@/utils/season-utils"
import { getMockCurrentWeather, getMockForecastWeather } from "@/utils/fallback-weather"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")
  const forecast = searchParams.get("forecast") === "true"
  const useMockData = searchParams.get("mock") === "true"

  console.log("Weather API called with:", { city, forecast, useMockData })

  if (!city) {
    return NextResponse.json({ error: "City name is required" }, { status: 400 })
  }

  // If mock data is explicitly requested, return it immediately
  if (useMockData) {
    console.log("Using mock weather data as requested")
    if (forecast) {
      return NextResponse.json(getMockForecastWeather(city))
    } else {
      return NextResponse.json(getMockCurrentWeather(city))
    }
  }

  // Try to get API key from multiple sources
  let apiKey = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  if (!apiKey) {
    // Check for API key in request headers (for user-provided keys)
    apiKey = request.headers.get("X-API-Key")
  }

  // If no API key is available, use mock data immediately
  if (!apiKey) {
    console.log("No API key available, using mock data")
    if (forecast) {
      return NextResponse.json(getMockForecastWeather(city))
    } else {
      return NextResponse.json(getMockCurrentWeather(city))
    }
  }

  // Validate API key format (OpenWeather API keys are 32 characters long)
  if (apiKey.length !== 32) {
    console.log("Invalid API key format, using mock data")
    if (forecast) {
      return NextResponse.json(getMockForecastWeather(city))
    } else {
      return NextResponse.json(getMockCurrentWeather(city))
    }
  }

  try {
    console.log("Using API key:", apiKey ? `${apiKey.substring(0, 8)}...` : "No API key found")

    // First, get coordinates for the city to fetch alerts
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
    const geoResponse = await fetch(geoUrl, { cache: "no-store" })

    let alerts: any[] = []
    let lat: number | null = null
    let lon: number | null = null

    if (geoResponse.ok) {
      const geoData = await geoResponse.json()
      if (geoData.length > 0) {
        lat = geoData[0].lat
        lon = geoData[0].lon

        // Fetch weather alerts using One Call API
        const alertsUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${apiKey}`
        try {
          const alertsResponse = await fetch(alertsUrl, { cache: "no-store" })
          if (alertsResponse.ok) {
            const alertsData = await alertsResponse.json()
            alerts = alertsData.alerts || []
          }
        } catch (alertError) {
          console.log("Could not fetch alerts, continuing without them")
        }
      }
    }

    // Determine which API endpoint to use based on whether forecast is requested
    const apiUrl = forecast
      ? `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
      : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`

    console.log("Calling OpenWeather API:", apiUrl.replace(apiKey, "***"))

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "Smart Garden Planner/1.0",
      },
    })

    console.log("OpenWeather API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenWeather API error response:", errorText)

      // For any API error (including 401), fall back to mock data
      console.log("API call failed, using mock data instead")
      if (forecast) {
        return NextResponse.json(getMockForecastWeather(city))
      } else {
        return NextResponse.json(getMockCurrentWeather(city))
      }
    }

    const data = await response.json()
    console.log("Successfully fetched weather data for:", data.name || data.city?.name)

    const now = new Date()
    const season = getSeason(now)

    if (forecast) {
      // Process 5-day forecast data
      const forecastData = data.list
        .filter((_: any, index: number) => index % 8 === 0) // Get one forecast per day (every 8th item is 24h apart)
        .slice(0, 5) // Ensure we only get 5 days
        .map((item: any) => ({
          date: new Date(item.dt * 1000).toISOString(),
          temperature: item.main.temp,
          condition: item.weather[0].main,
          description: item.weather[0].description,
          humidity: item.main.humidity,
          rainfall: item.rain ? item.rain["3h"] || 0 : 0,
          windSpeed: item.wind.speed,
          icon: item.weather[0].icon,
        }))

      return NextResponse.json({
        location: data.city.name,
        country: data.city.country,
        forecast: forecastData,
        timestamp: now.toISOString(),
        season,
        alerts,
      })
    } else {
      // Process current weather data
      const weatherData = {
        location: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        rainfall: data.rain ? data.rain["1h"] || 0 : 0,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        timestamp: now.toISOString(),
        season,
        alerts,
      }

      return NextResponse.json(weatherData)
    }
  } catch (error: any) {
    console.error("Error in weather API route:", error)

    // If any error occurs, fall back to mock data
    console.log("Error occurred, using mock data instead")
    if (forecast) {
      return NextResponse.json(getMockForecastWeather(city))
    } else {
      return NextResponse.json(getMockCurrentWeather(city))
    }
  }
}
