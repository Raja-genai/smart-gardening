"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { indianCities } from "@/data/indian-cities"

interface City {
  name: string
  state: string
  lat: string
  lon: string
}

interface CitySelectorProps {
  value?: string
  onChange?: (city: string, lat?: string, lon?: string) => void
  onCitySelect?: (city: City) => void
  defaultCity?: City
}

export function CitySelector({ value, onChange, onCitySelect, defaultCity }: CitySelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || "")
  const [searchTerm, setSearchTerm] = useState("")
  const initializationDone = useRef(false)
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(false)
  const [fallbackCity, setFallbackCity] = useState<City | undefined>(undefined)

  // Filter cities based on search term
  const filteredCities = searchTerm
    ? indianCities.filter(
        (city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.state.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : indianCities

  // Helper function to use Delhi as fallback
  const useFallbackCity = useCallback(() => {
    // Use default city if provided, otherwise use Delhi
    const city = defaultCity || indianCities.find((city) => city.name === "Delhi")
    if (city) {
      const cityFullName = `${city.name}, ${city.state}`
      setSelectedValue(cityFullName)

      if (onChange) {
        onChange(cityFullName, city.lat, city.lon)
      }

      if (onCitySelect) {
        onCitySelect(city)
      }
    }
  }, [defaultCity, onChange, onCitySelect])

  useEffect(() => {
    setIsGeolocationAvailable("geolocation" in navigator)
  }, [])

  useEffect(() => {
    setFallbackCity(defaultCity || indianCities.find((city) => city.name === "Delhi"))
  }, [defaultCity])

  // Set initial city on component mount
  useEffect(() => {
    // Only run this effect once
    if (initializationDone.current) return
    initializationDone.current = true

    if (value) {
      setSelectedValue(value)
      return
    }

    // If we have a default city, use it immediately
    if (defaultCity) {
      const cityFullName = `${defaultCity.name}, ${defaultCity.state}`
      setSelectedValue(cityFullName)

      if (onChange) {
        onChange(cityFullName, defaultCity.lat, defaultCity.lon)
      }

      if (onCitySelect) {
        onCitySelect(defaultCity)
      }
      return
    }

    // Always use the fallback city in preview environments or when geolocation isn't available
    const isPreviewEnvironment =
      typeof window !== "undefined" &&
      (window.location.hostname.includes("vercel.app") || window.location.hostname.includes("localhost"))

    if (isPreviewEnvironment || !isGeolocationAvailable) {
      useFallbackCity()
      return
    }

    // Try geolocation with better error handling
    try {
      // Use a promise-based approach with timeout
      const getLocationWithTimeout = () => {
        return new Promise<GeolocationPosition>((resolve, reject) => {
          // Set a timeout to avoid hanging
          const timeoutId = setTimeout(() => {
            reject(new Error("Geolocation request timed out"))
          }, 5000)

          navigator.geolocation.getCurrentPosition(
            (position) => {
              clearTimeout(timeoutId)
              resolve(position)
            },
            (error) => {
              clearTimeout(timeoutId)
              reject(error)
            },
            { maximumAge: 60000 },
          )
        })
      }

      // Check permissions first if available
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((result) => {
            if (result.state === "denied") {
              useFallbackCity()
              return
            }

            // Try to get position with timeout
            getLocationWithTimeout()
              .then((position) => {
                // Find the closest city from our list
                const closestCity = findClosestCity(position.coords.latitude, position.coords.longitude)
                if (closestCity) {
                  const cityFullName = `${closestCity.name}, ${closestCity.state}`
                  setSelectedValue(cityFullName)

                  if (onChange) {
                    onChange(cityFullName, closestCity.lat, closestCity.lon)
                  }

                  if (onCitySelect) {
                    onCitySelect(closestCity)
                  }
                }
              })
              .catch(() => {
                // Silently fall back to default city
                useFallbackCity()
              })
          })
          .catch(() => {
            useFallbackCity()
          })
      } else {
        // No permissions API, try direct geolocation
        getLocationWithTimeout()
          .then((position) => {
            const closestCity = findClosestCity(position.coords.latitude, position.coords.longitude)
            if (closestCity) {
              const cityFullName = `${closestCity.name}, ${closestCity.state}`
              setSelectedValue(cityFullName)

              if (onChange) {
                onChange(cityFullName, closestCity.lat, closestCity.lon)
              }

              if (onCitySelect) {
                onCitySelect(closestCity)
              }
            }
          })
          .catch(() => {
            useFallbackCity()
          })
      }
    } catch (err) {
      // Catch any unexpected errors
      console.error("Exception when accessing geolocation in CitySelector:", err)
      useFallbackCity()
    }
  }, [value, onChange, onCitySelect, defaultCity, isGeolocationAvailable, useFallbackCity])

  // Function to find the closest city from our list
  function findClosestCity(lat: number, lon: number) {
    let closestCity = null
    let minDistance = Number.POSITIVE_INFINITY

    for (const city of indianCities) {
      const distance = calculateDistance(lat, lon, Number.parseFloat(city.lat), Number.parseFloat(city.lon))
      if (distance < minDistance) {
        minDistance = distance
        closestCity = city
      }
    }

    return closestCity
  }

  // Calculate distance between two coordinates using Haversine formula
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedValue ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{selectedValue}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Select your city...</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search city..." value={searchTerm} onValueChange={setSearchTerm} />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {filteredCities.map((city) => {
                const cityFullName = `${city.name}, ${city.state}`
                return (
                  <CommandItem
                    key={cityFullName}
                    value={cityFullName}
                    onSelect={() => {
                      setSelectedValue(cityFullName)

                      if (onChange) {
                        onChange(cityFullName, city.lat, city.lon)
                      }

                      if (onCitySelect) {
                        onCitySelect(city)
                      }

                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedValue === cityFullName ? "opacity-100" : "opacity-0")}
                    />
                    {cityFullName}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
