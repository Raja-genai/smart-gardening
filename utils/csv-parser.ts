// Function to fetch and parse CSV data
export async function fetchCSVData(url: string, type: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV data: ${response.statusText}`)
    }

    const csvText = await response.text()
    return parseCSV(csvText, type)
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error)
    return []
  }
}

// Function to parse CSV data
export function parseCSV(csvText: string, type: string) {
  const lines = csvText.split("\n")
  if (lines.length <= 1) return []

  const headers = lines[0].split(",").map((h) => h.trim())

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line, index) => {
      const values = line.split(",").map((v) => v.trim())

      const name = values[headers.indexOf("Name")] || "Unknown"
      const emoji = values[headers.indexOf("Emoji")] || "🌱"
      const growthDays = Number.parseInt(values[headers.indexOf("Days to Harvest")] || "90", 10)
      const waterNeeds = mapWaterNeeds(values[headers.indexOf("Water Needs")] || "Medium")
      const sunNeeds = mapSunNeeds(values[headers.indexOf("Sunlight")] || "Full Sun")

      return {
        id: `${type.toLowerCase()}-${name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
        name,
        type,
        emoji,
        growthDays,
        waterNeeds,
        sunNeeds,
        description: generateDescription(name, type, growthDays, waterNeeds, sunNeeds),
      }
    })
}

// Helper function to map water needs
function mapWaterNeeds(value: string) {
  const normalized = value.toLowerCase()
  if (normalized.includes("low")) return "low"
  if (normalized.includes("high")) return "high"
  return "medium"
}

// Helper function to map sun needs
function mapSunNeeds(value: string) {
  const normalized = value.toLowerCase()
  if (normalized.includes("shade")) return "shade"
  if (normalized.includes("partial")) return "partial"
  return "full"
}

// Generate a description for plants
function generateDescription(name: string, type: string, days: number, water: string, sun: string) {
  return `${name} is a ${type.toLowerCase().slice(0, -1)} that takes about ${days} days to mature. It requires ${water} water and ${sun === "full" ? "full sun" : sun === "partial" ? "partial sun" : "shade"}.`
}
