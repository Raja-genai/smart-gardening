// Fallback weather data for when the API is unavailable
import { getSeason } from "./season-utils"

// Mock weather data for different cities
const cityWeatherData: Record<string, any> = {
  Delhi: {
    temperature: 32,
    condition: "Clear",
    description: "clear sky",
    humidity: 45,
    rainfall: 0,
    windSpeed: 3.5,
    icon: "01d",
    alerts: [
      {
        sender_name: "India Meteorological Department",
        event: "Heat Wave Warning",
        start: Date.now(),
        end: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        description:
          "Heat wave conditions expected. Temperature may reach 40°C. Avoid outdoor activities during peak hours.",
        tags: ["Extreme temperature"],
      },
    ],
  },
  Mumbai: {
    temperature: 29,
    condition: "Clouds",
    description: "scattered clouds",
    humidity: 74,
    rainfall: 0,
    windSpeed: 4.2,
    icon: "03d",
    alerts: [
      {
        sender_name: "India Meteorological Department",
        event: "High Humidity Advisory",
        start: Date.now(),
        end: Date.now() + 12 * 60 * 60 * 1000, // 12 hours from now
        description: "High humidity levels expected. Ensure proper ventilation for indoor plants.",
        tags: ["High humidity"],
      },
    ],
  },
  Bangalore: {
    temperature: 26,
    condition: "Rain",
    description: "light rain",
    humidity: 65,
    rainfall: 2.1,
    windSpeed: 2.8,
    icon: "10d",
    alerts: [
      {
        sender_name: "Karnataka State Disaster Management",
        event: "Heavy Rain Warning",
        start: Date.now(),
        end: Date.now() + 18 * 60 * 60 * 1000, // 18 hours from now
        description: "Heavy rainfall expected. Protect plants from waterlogging and ensure proper drainage.",
        tags: ["Rain", "Flood"],
      },
    ],
  },
  Chennai: {
    temperature: 31,
    condition: "Clear",
    description: "clear sky",
    humidity: 70,
    rainfall: 0,
    windSpeed: 3.1,
    icon: "01d",
    alerts: [],
  },
  Kolkata: {
    temperature: 30,
    condition: "Clouds",
    description: "broken clouds",
    humidity: 75,
    rainfall: 0,
    windSpeed: 2.5,
    icon: "04d",
    alerts: [
      {
        sender_name: "West Bengal Weather Department",
        event: "Thunderstorm Watch",
        start: Date.now() + 2 * 60 * 60 * 1000, // 2 hours from now
        end: Date.now() + 8 * 60 * 60 * 1000, // 8 hours from now
        description: "Thunderstorms possible this evening. Secure loose garden items and avoid watering.",
        tags: ["Thunderstorm", "Wind"],
      },
    ],
  },
  Hyderabad: {
    temperature: 28,
    condition: "Clear",
    description: "clear sky",
    humidity: 55,
    rainfall: 0,
    windSpeed: 3.0,
    icon: "01d",
    alerts: [],
  },
  Pune: {
    temperature: 27,
    condition: "Clouds",
    description: "few clouds",
    humidity: 60,
    rainfall: 0,
    windSpeed: 2.7,
    icon: "02d",
    alerts: [],
  },
  Jaipur: {
    temperature: 33,
    condition: "Clear",
    description: "clear sky",
    humidity: 40,
    rainfall: 0,
    windSpeed: 4.0,
    icon: "01d",
    alerts: [
      {
        sender_name: "Rajasthan Meteorological Centre",
        event: "Dust Storm Advisory",
        start: Date.now() + 4 * 60 * 60 * 1000, // 4 hours from now
        end: Date.now() + 10 * 60 * 60 * 1000, // 10 hours from now
        description: "Dust storm conditions possible. Cover sensitive plants and avoid outdoor gardening.",
        tags: ["Dust storm", "Wind"],
      },
    ],
  },
}

// Default data for any city not in our mock data
const defaultWeatherData = {
  temperature: 28,
  condition: "Clouds",
  description: "scattered clouds",
  humidity: 60,
  rainfall: 0,
  windSpeed: 3.0,
  icon: "03d",
  alerts: [],
}

// Generate a random temperature variation within +/- 3 degrees
const getRandomTemperatureVariation = (baseTemp: number) => {
  return baseTemp + (Math.random() * 6 - 3)
}

// Get mock current weather data
export function getMockCurrentWeather(city: string) {
  const now = new Date()
  const season = getSeason(now)

  // Find city data or use default
  const baseData = cityWeatherData[city] || defaultWeatherData

  // Add some randomness to make it more realistic
  return {
    location: city,
    temperature: getRandomTemperatureVariation(baseData.temperature),
    condition: baseData.condition,
    description: baseData.description,
    humidity: baseData.humidity,
    rainfall: baseData.rainfall,
    windSpeed: baseData.windSpeed,
    icon: baseData.icon,
    timestamp: now.toISOString(),
    season,
    alerts: baseData.alerts || [],
    isMockData: true,
  }
}

// Get mock forecast data
export function getMockForecastWeather(city: string) {
  const now = new Date()
  const season = getSeason(now)

  // Find city data or use default
  const baseData = cityWeatherData[city] || defaultWeatherData

  // Generate 5-day forecast
  const forecast = Array.from({ length: 5 }).map((_, index) => {
    const forecastDate = new Date()
    forecastDate.setDate(forecastDate.getDate() + index)

    // Add some variation to the temperature for each day
    const tempVariation = index === 0 ? 0 : Math.random() * 8 - 4

    return {
      date: forecastDate.toISOString(),
      temperature: baseData.temperature + tempVariation,
      condition: baseData.condition,
      description: baseData.description,
      humidity: Math.max(30, Math.min(90, baseData.humidity + (Math.random() * 20 - 10))),
      rainfall: baseData.rainfall,
      windSpeed: baseData.windSpeed + (Math.random() * 2 - 1),
      icon: baseData.icon,
    }
  })

  return {
    location: city,
    country: "IN",
    forecast,
    timestamp: now.toISOString(),
    season,
    alerts: baseData.alerts || [],
    isMockData: true,
  }
}
