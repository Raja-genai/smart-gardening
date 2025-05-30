export type Season = "Winter" | "Summer" | "Monsoon" | "Post-Monsoon" | "Pre-Monsoon"

export function getCurrentSeason(month: number, region: string): Season {
  // Different regions of India have slightly different seasonal patterns
  if (region === "North") {
    if (month >= 11 || month <= 2) return "Winter"
    if (month >= 3 && month <= 5) return "Summer"
    if (month >= 6 && month <= 9) return "Monsoon"
    return "Post-Monsoon"
  } else if (region === "South") {
    if (month >= 12 || month <= 2) return "Winter"
    if (month >= 3 && month <= 5) return "Summer"
    if (month >= 6 && month <= 9) return "Monsoon"
    return "Post-Monsoon"
  } else if (region === "East") {
    if (month >= 11 || month <= 2) return "Winter"
    if (month >= 3 && month <= 5) return "Summer"
    if (month >= 6 && month <= 9) return "Monsoon"
    return "Post-Monsoon"
  } else if (region === "West") {
    if (month >= 11 || month <= 2) return "Winter"
    if (month >= 3 && month <= 5) return "Summer"
    if (month >= 6 && month <= 9) return "Monsoon"
    return "Post-Monsoon"
  } else if (region === "Northeast") {
    if (month >= 11 || month <= 2) return "Winter"
    if (month >= 3 && month <= 4) return "Pre-Monsoon"
    if (month >= 5 && month <= 9) return "Monsoon"
    return "Post-Monsoon"
  } else {
    // Default/Central India
    if (month >= 11 || month <= 2) return "Winter"
    if (month >= 3 && month <= 5) return "Summer"
    if (month >= 6 && month <= 9) return "Monsoon"
    return "Post-Monsoon"
  }
}

export function getRegionFromState(state: string): string {
  const northStates = [
    "Delhi",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Punjab",
    "Rajasthan",
    "Uttarakhand",
    "Uttar Pradesh",
    "Chandigarh",
  ]

  const southStates = ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana", "Puducherry"]

  const eastStates = ["Bihar", "Jharkhand", "Odisha", "West Bengal"]

  const westStates = ["Goa", "Gujarat", "Maharashtra"]

  const northeastStates = [
    "Arunachal Pradesh",
    "Assam",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Sikkim",
    "Tripura",
  ]

  const centralStates = ["Chhattisgarh", "Madhya Pradesh"]

  if (northStates.includes(state)) return "North"
  if (southStates.includes(state)) return "South"
  if (eastStates.includes(state)) return "East"
  if (westStates.includes(state)) return "West"
  if (northeastStates.includes(state)) return "Northeast"
  if (centralStates.includes(state)) return "Central"

  return "Central" // Default
}

export function getRecommendedCrops(season: Season): { name: string; type: string }[] {
  switch (season) {
    case "Winter":
      return [
        { name: "Wheat", type: "grain" },
        { name: "Mustard", type: "oilseed" },
        { name: "Peas", type: "vegetable" },
        { name: "Spinach", type: "vegetable" },
        { name: "Cauliflower", type: "vegetable" },
        { name: "Cabbage", type: "vegetable" },
        { name: "Carrot", type: "vegetable" },
        { name: "Radish", type: "vegetable" },
        { name: "Fenugreek", type: "herb" },
        { name: "Coriander", type: "herb" },
      ]
    case "Summer":
      return [
        { name: "Okra (Bhindi)", type: "vegetable" },
        { name: "Cucumber", type: "vegetable" },
        { name: "Bottle Gourd", type: "vegetable" },
        { name: "Bitter Gourd", type: "vegetable" },
        { name: "Eggplant (Brinjal)", type: "vegetable" },
        { name: "Pumpkin", type: "vegetable" },
        { name: "Watermelon", type: "fruit" },
        { name: "Muskmelon", type: "fruit" },
        { name: "Sunflower", type: "oilseed" },
        { name: "Marigold", type: "flower" },
      ]
    case "Monsoon":
      return [
        { name: "Rice", type: "grain" },
        { name: "Maize", type: "grain" },
        { name: "Soybean", type: "legume" },
        { name: "Green Gram", type: "legume" },
        { name: "Black Gram", type: "legume" },
        { name: "Pigeon Pea", type: "legume" },
        { name: "Cotton", type: "fiber" },
        { name: "Ginger", type: "spice" },
        { name: "Turmeric", type: "spice" },
        { name: "Chillies", type: "vegetable" },
      ]
    case "Post-Monsoon":
      return [
        { name: "Potato", type: "vegetable" },
        { name: "Onion", type: "vegetable" },
        { name: "Garlic", type: "vegetable" },
        { name: "Tomato", type: "vegetable" },
        { name: "Chickpea", type: "legume" },
        { name: "Lentil", type: "legume" },
        { name: "Mustard", type: "oilseed" },
        { name: "Coriander", type: "herb" },
        { name: "Fenugreek", type: "herb" },
        { name: "Spinach", type: "vegetable" },
      ]
    case "Pre-Monsoon":
      return [
        { name: "Jute", type: "fiber" },
        { name: "Maize", type: "grain" },
        { name: "Cucumber", type: "vegetable" },
        { name: "Pumpkin", type: "vegetable" },
        { name: "Ridge Gourd", type: "vegetable" },
        { name: "Bitter Gourd", type: "vegetable" },
        { name: "Okra", type: "vegetable" },
        { name: "Chillies", type: "vegetable" },
        { name: "Ginger", type: "spice" },
        { name: "Turmeric", type: "spice" },
      ]
  }
}

export function getSeason(date: Date): string {
  const month = date.getMonth() + 1 // Months are 0-indexed
  const day = date.getDate()

  if ((month === 12 && day >= 21) || (month >= 1 && month < 3) || (month === 3 && day < 20)) {
    return "Winter"
  } else if ((month === 3 && day >= 20) || (month > 3 && month < 6) || (month === 6 && day < 21)) {
    return "Summer"
  } else if ((month === 6 && day >= 21) || (month > 6 && month < 9) || (month === 9 && day < 22)) {
    return "Monsoon"
  } else {
    return "Autumn"
  }
}
