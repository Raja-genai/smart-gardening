"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PestImage } from "@/components/pest-image"
import DashboardLayout from "@/components/dashboard-layout"

interface Pest {
  id: string
  name: string
  type: string
  affectedPlants: string[]
  symptoms: string[]
  prevention: string[]
  treatment: string[]
  image: string
}

const pests: Pest[] = [
  {
    id: "aphids",
    name: "Aphids",
    type: "insect",
    affectedPlants: ["Roses", "Tomatoes", "Peppers", "Cabbage", "Beans"],
    symptoms: [
      "Curled or distorted leaves",
      "Yellowing leaves",
      "Stunted growth",
      "Sticky residue on leaves (honeydew)",
      "Black sooty mold on honeydew",
    ],
    prevention: [
      "Encourage beneficial insects like ladybugs and lacewings",
      "Plant companion plants like marigolds, nasturtiums, and alliums",
      "Use reflective mulch to confuse aphids",
      "Maintain plant health with proper watering and fertilization",
      "Remove heavily infested plant parts",
    ],
    treatment: [
      "Spray plants with strong water jet to dislodge aphids",
      "Apply insecticidal soap or neem oil",
      "Use yellow sticky traps to catch flying aphids",
      "For severe infestations, consider systemic insecticides",
      "Introduce beneficial insects like ladybugs",
    ],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "whiteflies",
    name: "Whiteflies",
    type: "insect",
    affectedPlants: ["Tomatoes", "Cucumbers", "Eggplants", "Peppers", "Cabbage"],
    symptoms: [
      "Tiny white flying insects on undersides of leaves",
      "Yellowing leaves",
      "Stunted growth",
      "Sticky honeydew on leaves",
      "Sooty mold growth",
    ],
    prevention: [
      "Use reflective mulches to repel whiteflies",
      "Plant trap crops like nasturtiums",
      "Install yellow sticky traps",
      "Avoid excessive nitrogen fertilization",
      "Remove and destroy heavily infested plants",
    ],
    treatment: [
      "Apply insecticidal soap or neem oil to undersides of leaves",
      "Use yellow sticky traps to catch adults",
      "Introduce beneficial insects like parasitic wasps",
      "Apply diatomaceous earth around plants",
      "For severe infestations, use appropriate insecticides",
    ],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "powdery-mildew",
    name: "Powdery Mildew",
    type: "fungus",
    affectedPlants: ["Cucumbers", "Squash", "Melons", "Roses", "Grapes"],
    symptoms: [
      "White powdery spots on leaves and stems",
      "Yellowing leaves",
      "Distorted growth",
      "Premature leaf drop",
      "Reduced yield",
    ],
    prevention: [
      "Plant resistant varieties",
      "Ensure good air circulation between plants",
      "Avoid overhead watering",
      "Water in the morning so plants dry during the day",
      "Remove and destroy infected plant parts",
    ],
    treatment: [
      "Apply fungicides containing sulfur or potassium bicarbonate",
      "Spray with neem oil or horticultural oils",
      "Use milk spray (1 part milk to 9 parts water)",
      "Apply baking soda solution (1 tbsp baking soda, 1 tbsp vegetable oil, 1 tsp dish soap in 1 gallon water)",
      "For severe cases, use commercial fungicides",
    ],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "tomato-hornworm",
    name: "Tomato Hornworm",
    type: "insect",
    affectedPlants: ["Tomatoes", "Peppers", "Eggplants", "Potatoes"],
    symptoms: [
      "Large portions of leaves eaten",
      "Defoliated stems",
      "Dark green droppings on leaves",
      "Damage to developing fruits",
      "Large green caterpillars with white stripes and horn-like projection",
    ],
    prevention: [
      "Till soil in fall and spring to destroy pupae",
      "Plant dill, basil, and marigolds as companion plants",
      "Encourage natural predators like wasps",
      "Rotate crops annually",
      "Use row covers until plants flower",
    ],
    treatment: [
      "Handpick and remove caterpillars",
      "Apply Bacillus thuringiensis (Bt)",
      "Introduce parasitic wasps",
      "Use neem oil for young caterpillars",
      "For severe infestations, apply appropriate insecticides",
    ],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "root-rot",
    name: "Root Rot",
    type: "fungus",
    affectedPlants: ["Most garden plants", "Especially those in poorly drained soil"],
    symptoms: [
      "Wilting despite adequate soil moisture",
      "Yellowing leaves",
      "Stunted growth",
      "Brown, soft, or mushy roots",
      "Plant collapse",
    ],
    prevention: [
      "Ensure good drainage in garden beds",
      "Avoid overwatering",
      "Use raised beds in areas with poor drainage",
      "Plant in well-draining soil mix",
      "Avoid planting susceptible plants in areas with history of root rot",
    ],
    treatment: [
      "Improve drainage around affected plants",
      "Reduce watering frequency",
      "Remove and destroy severely affected plants",
      "Apply fungicides containing fosetyl-aluminum or metalaxyl",
      "For container plants, repot in fresh, sterile potting mix",
    ],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "spider-mites",
    name: "Spider Mites",
    type: "arachnid",
    affectedPlants: ["Tomatoes", "Cucumbers", "Beans", "Strawberries", "Many ornamentals"],
    symptoms: [
      "Fine webbing on leaves and between plant parts",
      "Stippled or speckled leaves (tiny yellow or white spots)",
      "Bronzing or yellowing of leaves",
      "Leaf drop",
      "Tiny moving dots visible with magnifying glass",
    ],
    prevention: [
      "Maintain high humidity around plants",
      "Regularly spray plants with water to discourage mites",
      "Avoid drought stress",
      "Plant resistant varieties",
      "Introduce predatory mites preventively",
    ],
    treatment: [
      "Spray plants forcefully with water to dislodge mites",
      "Apply insecticidal soap or horticultural oil",
      "Use neem oil or rosemary oil",
      "Introduce predatory mites",
      "For severe infestations, use miticides",
    ],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "slugs-snails",
    name: "Slugs and Snails",
    type: "mollusc",
    affectedPlants: ["Lettuce", "Hostas", "Strawberries", "Seedlings of many plants"],
    symptoms: [
      "Irregular holes in leaves and fruits",
      "Slime trails on plants and soil",
      "Seedlings cut down overnight",
      "Damage primarily to lower leaves",
      "Feeding damage typically occurs at night",
    ],
    prevention: [
      "Create barriers with copper tape, diatomaceous earth, or eggshells",
      "Remove hiding places like boards, stones, and debris",
      "Water in the morning so soil dries by evening",
      "Use raised beds with gravel barriers",
      "Attract natural predators like birds, frogs, and ground beetles",
    ],
    treatment: [
      "Handpick at night with flashlight",
      "Set up beer traps (shallow containers with beer)",
      "Apply iron phosphate-based slug baits",
      "Use coffee grounds around plants",
      "For severe infestations, use commercial molluscicides",
    ],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "japanese-beetles",
    name: "Japanese Beetles",
    type: "insect",
    affectedPlants: ["Roses", "Grapes", "Beans", "Raspberries", "Many ornamentals"],
    symptoms: [
      "Skeletonized leaves (only veins remaining)",
      "Flowers completely consumed",
      "Presence of metallic green beetles with copper-brown wing covers",
      "Clustered feeding behavior",
      "Damage to upper portions of plants",
    ],
    prevention: [
      "Apply beneficial nematodes to soil to control grubs",
      "Use row covers during peak season",
      "Plant resistant varieties like arborvitae, boxwood, and red maple",
      "Avoid Japanese beetle trap placement near gardens",
      "Maintain healthy plants that can withstand some damage",
    ],
    treatment: [
      "Handpick beetles in early morning when they're sluggish",
      "Knock beetles into soapy water",
      "Apply neem oil or pyrethrin",
      "Use insecticidal soap for mild infestations",
      "For severe cases, apply appropriate insecticides",
    ],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "blossom-end-rot",
    name: "Blossom End Rot",
    type: "physiological",
    affectedPlants: ["Tomatoes", "Peppers", "Eggplants", "Squash", "Watermelons"],
    symptoms: [
      "Dark, sunken, leathery patches at blossom end of fruits",
      "Initial water-soaked appearance of affected area",
      "Affected area enlarges as fruit develops",
      "Secondary pathogens may invade damaged tissue",
      "More common on first fruits of the season",
    ],
    prevention: [
      "Maintain consistent soil moisture",
      "Add calcium to soil before planting",
      "Avoid excessive nitrogen fertilization",
      "Mulch to maintain even soil moisture",
      "Avoid damaging roots when cultivating",
    ],
    treatment: [
      "Remove affected fruits",
      "Apply calcium spray to developing fruits",
      "Ensure proper watering practices",
      "Add calcium supplements to soil",
      "Maintain soil pH between 6.0 and 6.8",
    ],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "cabbage-worms",
    name: "Cabbage Worms",
    type: "insect",
    affectedPlants: ["Cabbage", "Broccoli", "Cauliflower", "Kale", "Brussels sprouts"],
    symptoms: [
      "Irregular holes in leaves",
      "Presence of green caterpillars",
      "Frass (excrement) on leaves",
      "Damaged heads of cabbage or broccoli",
      "White butterflies fluttering around plants",
    ],
    prevention: [
      "Cover plants with floating row covers",
      "Plant trap crops like nasturtiums",
      "Interplant with aromatic herbs like thyme, sage, and rosemary",
      "Encourage beneficial insects like parasitic wasps",
      "Practice crop rotation",
    ],
    treatment: [
      "Handpick caterpillars",
      "Apply Bacillus thuringiensis (Bt)",
      "Use neem oil for young caterpillars",
      "Introduce parasitic wasps",
      "For severe infestations, use appropriate insecticides",
    ],
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function PestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedPest, setSelectedPest] = useState<Pest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter pests based on search term and active tab
  const filteredPests = pests.filter((pest) => {
    const matchesSearch = pest.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || pest.type === activeTab
    return matchesSearch && matchesTab
  })

  // Group pests by type for counting
  const pestCounts = {
    all: pests.length,
    insect: pests.filter((p) => p.type === "insect").length,
    fungus: pests.filter((p) => p.type === "fungus").length,
    arachnid: pests.filter((p) => p.type === "arachnid").length,
    mollusc: pests.filter((p) => p.type === "mollusc").length,
    physiological: pests.filter((p) => p.type === "physiological").length,
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Pest & Disease Guide</h1>
          <p className="text-muted-foreground">Identify and manage common garden pests and diseases</p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Common Garden Pests & Diseases</CardTitle>
            <CardDescription>Browse and learn how to identify and manage garden problems</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search pests and diseases..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="pb-6 pt-2">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="all" className="flex-1">
                  All ({pestCounts.all})
                </TabsTrigger>
                <TabsTrigger value="insect" className="flex-1">
                  Insects ({pestCounts.insect})
                </TabsTrigger>
                <TabsTrigger value="fungus" className="flex-1">
                  Fungi ({pestCounts.fungus})
                </TabsTrigger>
                <TabsTrigger value="arachnid" className="flex-1">
                  Arachnids ({pestCounts.arachnid})
                </TabsTrigger>
                <TabsTrigger value="mollusc" className="flex-1">
                  Molluscs ({pestCounts.mollusc})
                </TabsTrigger>
                <TabsTrigger value="physiological" className="flex-1">
                  Physiological ({pestCounts.physiological})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPests.map((pest) => (
                    <Card key={pest.id} className="overflow-hidden">
                      <div className="h-40 w-full">
                        <PestImage
                          name={pest.name}
                          src={pest.image}
                          alt={pest.name}
                          className="h-40 w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{pest.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Affects: {pest.affectedPlants.slice(0, 3).join(", ")}
                          {pest.affectedPlants.length > 3 && " and more"}
                        </p>
                        <Dialog
                          open={isDialogOpen && selectedPest?.id === pest.id}
                          onOpenChange={(open) => {
                            setIsDialogOpen(open)
                            if (!open) setSelectedPest(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                setSelectedPest(pest)
                                setIsDialogOpen(true)
                              }}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl">{pest.name}</DialogTitle>
                              <DialogDescription>
                                Type: <span className="capitalize">{pest.type}</span>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                              <div>
                                <div className="w-full h-auto rounded-lg overflow-hidden">
                                  <PestImage
                                    name={pest.name}
                                    src={pest.image}
                                    alt={pest.name}
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                                <h3 className="font-medium mt-4 mb-2">Affected Plants:</h3>
                                <ul className="list-disc pl-5 text-sm">
                                  {pest.affectedPlants.map((plant) => (
                                    <li key={plant}>{plant}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-medium mb-2">Symptoms:</h3>
                                  <ul className="list-disc pl-5 text-sm space-y-1">
                                    {pest.symptoms.map((symptom) => (
                                      <li key={symptom}>{symptom}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h3 className="font-medium mb-2">Prevention:</h3>
                                  <ul className="list-disc pl-5 text-sm space-y-1">
                                    {pest.prevention.map((method) => (
                                      <li key={method}>{method}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h3 className="font-medium mb-2">Treatment:</h3>
                                  <ul className="list-disc pl-5 text-sm space-y-1">
                                    {pest.treatment.map((method) => (
                                      <li key={method}>{method}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
