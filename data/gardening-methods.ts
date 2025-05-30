export const gardeningMethods = [
  {
    id: "container",
    method: "Container Gardening",
    description: "Ideal for small spaces. Use pots or containers to grow herbs, flowers, and small veggies.",
    suitable_plants: ["Tomato", "Basil", "Chili", "Spinach", "Mint", "Lettuce", "Radish", "Strawberry"],
    icon: "🪴",
  },
  {
    id: "vertical",
    method: "Vertical Gardening",
    description: "Grows plants upward on walls or frames. Great for climbers and leafy greens.",
    suitable_plants: ["Cucumber", "Peas", "Beans", "Tomato", "Strawberry", "Mint", "Spinach"],
    icon: "🌿",
  },
  {
    id: "raised-bed",
    method: "Raised Bed Gardening",
    description: "Beds built above ground for better drainage and root depth.",
    suitable_plants: ["Carrot", "Beetroot", "Radish", "Onion", "Lettuce", "Cabbage", "Broccoli"],
    icon: "🌱",
  },
  {
    id: "square-foot",
    method: "Square Foot Gardening",
    description: "Divides garden into small square sections for efficient space use.",
    suitable_plants: ["Lettuce", "Spinach", "Radish", "Carrot", "Onion", "Herbs"],
    icon: "🟩",
  },
  {
    id: "companion",
    method: "Companion Planting",
    description: "Growing compatible plants together for pest control and pollination.",
    suitable_plants: ["Tomato", "Basil", "Marigold", "Onion", "Carrot", "Cucumber"],
    icon: "🤝",
  },
  {
    id: "hydroponic",
    method: "Hydroponic Gardening",
    description: "Growing plants in water with added nutrients instead of soil.",
    suitable_plants: ["Lettuce", "Spinach", "Herbs", "Strawberry", "Tomato"],
    icon: "💧",
  },
  {
    id: "organic",
    method: "Organic Gardening",
    description: "Using natural methods without synthetic fertilizers or pesticides.",
    suitable_plants: ["All vegetables", "Herbs", "Fruits", "Flowers"],
    icon: "🌎",
  },
]

// Function to get recommended methods for a plant
export function getMethodsForPlant(plantName: string) {
  return gardeningMethods.filter((method) =>
    method.suitable_plants.some(
      (plant) =>
        plant.toLowerCase() === plantName.toLowerCase() ||
        plantName.toLowerCase().includes(plant.toLowerCase()) ||
        plant.includes("All"),
    ),
  )
}
