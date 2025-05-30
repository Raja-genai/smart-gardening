"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, BookOpen, Search, Leaf, Book, PenTool, Calendar } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface Note {
  id: string
  title: string
  content: string
  date: string
  tags: string[]
  type: "general" | "plant" | "admin"
  plantId?: string
  plantName?: string
  plantEmoji?: string
  color?: string
  imageUrl?: string
}

export default function NotebookPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()
  const [plants, setPlants] = useState<any[]>([])

  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: "",
    content: "",
    tags: [],
    type: "general",
    color: "#e2f2e3", // default light green
  })

  const [newTag, setNewTag] = useState("")

  const noteColors = [
    { label: "Green", value: "#e2f2e3" },
    { label: "Blue", value: "#e2eaf2" },
    { label: "Yellow", value: "#f2f0e2" },
    { label: "Pink", value: "#f2e2e8" },
    { label: "Purple", value: "#e8e2f2" },
    { label: "Orange", value: "#f2ebe2" },
  ]

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/auth")
    } else {
      // Load notes from localStorage
      const savedNotes = localStorage.getItem("gardenNotes")
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      } else {
        // Create default notes if none exist
        createDefaultNotes()
      }

      // Load plants from garden planner
      const storedGarden = localStorage.getItem("garden-planner-data")
      if (storedGarden) {
        try {
          const parsedGarden = JSON.parse(storedGarden)
          if (parsedGarden.placedPlants) {
            setPlants(parsedGarden.placedPlants)
          }
        } catch (error) {
          console.error("Error parsing garden data:", error)
        }
      }
    }
  }, [router])

  // Create default notes
  const createDefaultNotes = () => {
    const defaultNotes: Note[] = [
      {
        id: Date.now().toString(),
        title: "Welcome to Garden Notebook",
        content:
          "Use this notebook to keep track of your gardening observations, ideas, and learnings. Add notes about plant growth, pest issues, successful techniques, and more!",
        date: new Date().toISOString(),
        tags: ["welcome", "tips"],
        type: "general",
        color: "#e2f2e3",
      },
      {
        id: (Date.now() + 1).toString(),
        title: "Plant-Specific Notes",
        content:
          "The 'Plants' tab lets you create notes specific to plants in your garden. Track growth, issues, and successes for each plant variety!",
        date: new Date().toISOString(),
        tags: ["plants", "tips"],
        type: "general",
        color: "#e2eaf2",
      },
      {
        id: (Date.now() + 2).toString(),
        title: "Companion Planting Guide",
        content:
          "Companion planting is the practice of growing certain plants near each other for mutual benefit. For example, plant basil near tomatoes to improve their flavor and repel pests. Marigolds help repel nematodes and attract beneficial insects. Nasturtiums act as a trap crop for aphids, protecting your vegetables.",
        date: new Date().toISOString(),
        tags: ["admin", "tips", "companion planting"],
        type: "admin",
        color: "#f2f0e2",
        imageUrl:
          "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: (Date.now() + 3).toString(),
        title: "Seasonal Planting Calendar for India",
        content:
          "In India, the planting calendar varies by region and season. During Rabi season (winter: Oct-March), grow wheat, barley, peas, and mustard. During Kharif season (monsoon: June-Oct), plant rice, maize, sorghum, and cotton. During Zaid season (summer: March-June), grow watermelon, cucumber, and pumpkin. Always adjust based on your local climate conditions.",
        date: new Date().toISOString(),
        tags: ["admin", "seasonal", "india"],
        type: "admin",
        color: "#e2eaf2",
        imageUrl:
          "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: (Date.now() + 4).toString(),
        title: "Natural Pest Control Methods",
        content:
          "Instead of chemical pesticides, try these natural alternatives: 1) Neem oil spray for aphids, mites, and other soft-bodied insects. 2) Garlic spray to repel a variety of pests. 3) Diatomaceous earth for crawling insects. 4) Introduce beneficial insects like ladybugs and lacewings. 5) Plant marigolds, nasturtiums, and other pest-repelling plants throughout your garden.",
        date: new Date().toISOString(),
        tags: ["admin", "pests", "organic"],
        type: "admin",
        color: "#f2e2e8",
        imageUrl:
          "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: (Date.now() + 5).toString(),
        title: "Water Conservation Techniques",
        content:
          "Conserve water in your garden with these methods: 1) Install a drip irrigation system to deliver water directly to plant roots. 2) Use mulch to reduce evaporation and suppress weeds. 3) Collect rainwater in barrels for later use. 4) Water early in the morning or late in the evening to minimize evaporation. 5) Group plants with similar water needs together.",
        date: new Date().toISOString(),
        tags: ["admin", "water", "conservation"],
        type: "admin",
        color: "#e2eaf2",
        imageUrl:
          "https://images.unsplash.com/photo-1525498128493-380d1990a112?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: (Date.now() + 6).toString(),
        title: "Soil Health and Composting",
        content:
          "Healthy soil is the foundation of a successful garden. Start a compost pile with kitchen scraps, yard waste, and fallen leaves. Add compost to your garden beds to improve soil structure, fertility, and water retention. Test your soil pH and amend accordingly. Consider cover crops during off-seasons to prevent erosion and add organic matter.",
        date: new Date().toISOString(),
        tags: ["admin", "soil", "compost"],
        type: "admin",
        color: "#f2ebe2",
        imageUrl:
          "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ]

    setNotes(defaultNotes)
    localStorage.setItem("gardenNotes", JSON.stringify(defaultNotes))
  }

  useEffect(() => {
    // Save notes to localStorage whenever they change
    if (isClient && notes.length > 0) {
      localStorage.setItem("gardenNotes", JSON.stringify(notes))
    }
  }, [notes, isClient])

  useEffect(() => {
    // Filter notes based on search query and active tab
    if (searchQuery.trim() === "" && activeTab === "all") {
      setFilteredNotes(notes)
    } else {
      const query = searchQuery.toLowerCase()
      let filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some((tag) => tag.toLowerCase().includes(query)),
      )

      // Apply tab filter
      if (activeTab === "plants") {
        filtered = filtered.filter((note) => note.type === "plant")
      } else if (activeTab === "general") {
        filtered = filtered.filter((note) => note.type === "general")
      } else if (activeTab === "admin") {
        filtered = filtered.filter((note) => note.type === "admin")
      }

      setFilteredNotes(filtered)
    }
  }, [searchQuery, notes, activeTab])

  const addNote = () => {
    if (!newNote.title || !newNote.content) return

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      date: new Date().toISOString(),
      tags: newNote.tags || [],
      type: newNote.type || "general",
      plantId: newNote.plantId,
      plantName: newNote.plantName,
      plantEmoji: newNote.plantEmoji,
      color: newNote.color || "#e2f2e3",
      imageUrl: newNote.imageUrl,
    }

    setNotes([...notes, note])
    setIsAddDialogOpen(false)
    setNewNote({
      title: "",
      content: "",
      tags: [],
      type: "general",
      color: "#e2f2e3",
    })

    toast({
      title: "Note Added",
      description: `"${note.title}" has been added to your notebook`,
    })
  }

  const updateNote = () => {
    if (!selectedNote || !newNote.title || !newNote.content) return

    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id
        ? {
            ...note,
            title: newNote.title || note.title,
            content: newNote.content || note.content,
            tags: newNote.tags || note.tags,
            color: newNote.color || note.color,
            imageUrl: newNote.imageUrl || note.imageUrl,
          }
        : note,
    )

    setNotes(updatedNotes)
    setIsEditDialogOpen(false)

    toast({
      title: "Note Updated",
      description: `"${newNote.title}" has been updated`,
    })
  }

  const deleteNote = (id: string) => {
    const noteToDelete = notes.find((note) => note.id === id)
    setNotes(notes.filter((note) => note.id !== id))

    toast({
      title: "Note Deleted",
      description: `"${noteToDelete?.title}" has been deleted`,
      variant: "destructive",
    })
  }

  const handleEditNote = (note: Note) => {
    setSelectedNote(note)
    setNewNote({
      title: note.title,
      content: note.content,
      tags: [...note.tags],
      type: note.type,
      plantId: note.plantId,
      plantName: note.plantName,
      plantEmoji: note.plantEmoji,
      color: note.color,
      imageUrl: note.imageUrl,
    })
    setIsEditDialogOpen(true)
  }

  const handleViewNote = (note: Note) => {
    setSelectedNote(note)
    setIsViewDialogOpen(true)
  }

  const addTag = () => {
    if (!newTag.trim()) return

    setNewNote({
      ...newNote,
      tags: [...(newNote.tags || []), newTag.trim()],
    })
    setNewTag("")
  }

  const removeTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: (newNote.tags || []).filter((tag) => tag !== tagToRemove),
    })
  }

  const handleNewPlantNote = (plant: any) => {
    setNewNote({
      title: `Notes on ${plant.name}`,
      content: "",
      tags: [plant.name.toLowerCase(), plant.type.toLowerCase()],
      type: "plant",
      plantId: plant.id,
      plantName: plant.name,
      plantEmoji: plant.emoji || "🌱",
      color: "#e2f2e3",
    })
    setIsAddDialogOpen(true)
  }

  // Get plant emoji
  const getPlantEmoji = (plantId: string) => {
    if (plantId.includes("tomato")) return "🍅"
    if (plantId.includes("carrot")) return "🥕"
    if (plantId.includes("lettuce")) return "🥬"
    if (plantId.includes("cucumber")) return "🥒"
    if (plantId.includes("pepper")) return "🫑"
    if (plantId.includes("broccoli")) return "🥦"
    if (plantId.includes("potato")) return "🥔"
    if (plantId.includes("onion")) return "🧅"
    if (plantId.includes("garlic")) return "🧄"
    if (plantId.includes("eggplant")) return "🍆"
    if (plantId.includes("corn")) return "🌽"
    if (plantId.includes("apple")) return "🍎"
    if (plantId.includes("strawberry")) return "🍓"
    if (plantId.includes("rose")) return "🌹"
    if (plantId.includes("tulip")) return "🌷"
    if (plantId.includes("sunflower")) return "🌻"
    return "🌱" // Default
  }

  // Get plant name (capitalize first letter)
  const getPlantName = (plantId: string) => {
    return plantId.charAt(0).toUpperCase() + plantId.slice(1)
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Garden Notebook
          </h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Note</DialogTitle>
                <DialogDescription>Record your garden observations, ideas, and learnings</DialogDescription>
              </DialogHeader>
              <Tabs
                defaultValue="general"
                onValueChange={(value) => setNewNote({ ...newNote, type: value as "general" | "plant" | "admin" })}
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="general">General Note</TabsTrigger>
                  <TabsTrigger value="plant">Plant-Specific Note</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="note-title">Title</Label>
                      <Input
                        id="note-title"
                        placeholder="Enter note title..."
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="note-content">Content</Label>
                      <Textarea
                        id="note-content"
                        placeholder="Write your note here..."
                        rows={8}
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Note Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {noteColors.map((color) => (
                          <div
                            key={color.value}
                            className={`w-8 h-8 rounded-full cursor-pointer ${
                              newNote.color === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setNewNote({ ...newNote, color: color.value })}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(newNote.tags || []).map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 inline-flex items-center justify-center"
                            >
                              <span className="sr-only">Remove</span>
                              <svg
                                width="6"
                                height="6"
                                viewBox="0 0 6 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.5 1.5L4.5 4.5M1.5 4.5L4.5 1.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addTag()}
                        />
                        <Button type="button" variant="outline" onClick={addTag}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="plant">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Select Plant</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                        {plants.length > 0 ? (
                          plants.map((plant) => (
                            <div
                              key={plant.id}
                              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted ${
                                newNote.plantId === plant.plantId ? "bg-primary/10 font-medium" : ""
                              }`}
                              onClick={() =>
                                setNewNote({
                                  ...newNote,
                                  plantId: plant.plantId,
                                  plantName: getPlantName(plant.plantId),
                                  plantEmoji: getPlantEmoji(plant.plantId),
                                  title: `Notes on ${getPlantName(plant.plantId)}`,
                                  tags: [plant.plantId, "plant notes"],
                                })
                              }
                            >
                              <span className="text-2xl">{getPlantEmoji(plant.plantId)}</span>
                              <span>{getPlantName(plant.plantId)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full p-4 text-center text-muted-foreground">
                            No plants found in your garden. Add plants in the Garden Planner.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="plant-note-title">Title</Label>
                      <Input
                        id="plant-note-title"
                        placeholder="Enter note title..."
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="plant-note-content">Observations</Label>
                      <Textarea
                        id="plant-note-content"
                        placeholder="Write your observations about this plant..."
                        rows={8}
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Note Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {noteColors.map((color) => (
                          <div
                            key={color.value}
                            className={`w-8 h-8 rounded-full cursor-pointer ${
                              newNote.color === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setNewNote({ ...newNote, color: color.value })}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(newNote.tags || []).map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 inline-flex items-center justify-center"
                            >
                              <span className="sr-only">Remove</span>
                              <svg
                                width="6"
                                height="6"
                                viewBox="0 0 6 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.5 1.5L4.5 4.5M1.5 4.5L4.5 1.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addTag()}
                        />
                        <Button type="button" variant="outline" onClick={addTag}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addNote} className="bg-green-600 hover:bg-green-700">
                  Save Note
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              All Notes
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-1">
              <PenTool className="h-4 w-4" />
              General Notes
            </TabsTrigger>
            <TabsTrigger value="plants" className="flex items-center gap-1">
              <Leaf className="h-4 w-4" />
              Plant Notes
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Garden Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-4">
            {filteredNotes.length === 0 ? (
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                      <BookOpen className="h-8 w-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-xl font-semibold">No Notes Found</h2>
                    <p className="text-gray-500 max-w-md">
                      {searchQuery
                        ? "No notes match your search criteria."
                        : "Start adding notes to your garden notebook."}
                    </p>
                    <Button className="mt-2 bg-green-600 hover:bg-green-700" onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="overflow-hidden hover:shadow-md transition-shadow transform hover:scale-105 transition-transform cursor-pointer"
                    style={{ backgroundColor: note.color || "#e2f2e3" }}
                    onClick={() => handleViewNote(note)}
                  >
                    {note.imageUrl && (
                      <div className="w-full h-40 overflow-hidden">
                        <img
                          src={note.imageUrl || "/placeholder.svg"}
                          alt={note.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2 border-b border-black/10">
                      <div className="flex items-center gap-2">
                        {note.type === "plant" && note.plantEmoji && (
                          <span className="text-2xl">{note.plantEmoji}</span>
                        )}
                        {note.type === "general" && <PenTool className="h-5 w-5 text-gray-500" />}
                        {note.type === "admin" && <BookOpen className="h-5 w-5 text-blue-500" />}
                        <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(note.date), "PPP")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 mb-2">{note.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-black/5 dark:bg-white/10">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      {note.type !== "admin" ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditNote(note)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNote(note.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      ) : (
                        <div className="w-full text-center text-xs text-muted-foreground">Garden tip</div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="general" className="pt-4">
            {filteredNotes.filter((note) => note.type === "general").length === 0 ? (
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                      <PenTool className="h-8 w-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-xl font-semibold">No General Notes Found</h2>
                    <p className="text-gray-500 max-w-md">
                      {searchQuery
                        ? "No general notes match your search criteria."
                        : "Start adding general notes about your garden."}
                    </p>
                    <Button
                      className="mt-2 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setNewNote({
                          title: "",
                          content: "",
                          tags: [],
                          type: "general",
                          color: "#e2f2e3",
                        })
                        setIsAddDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add General Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes
                  .filter((note) => note.type === "general")
                  .map((note) => (
                    <Card
                      key={note.id}
                      className="overflow-hidden hover:shadow-md transition-shadow transform hover:scale-105 transition-transform cursor-pointer"
                      style={{ backgroundColor: note.color || "#e2f2e3" }}
                      onClick={() => handleViewNote(note)}
                    >
                      {note.imageUrl && (
                        <div className="w-full h-40 overflow-hidden">
                          <img
                            src={note.imageUrl || "/placeholder.svg"}
                            alt={note.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2 border-b border-black/10">
                        <div className="flex items-center gap-2">
                          <PenTool className="h-5 w-5 text-gray-500" />
                          <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(note.date), "PPP")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 mb-2">{note.content}</p>
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-black/5 dark:bg-white/10">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditNote(note)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNote(note.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="plants" className="pt-4">
            {filteredNotes.filter((note) => note.type === "plant").length === 0 ? (
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                      <Leaf className="h-8 w-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-xl font-semibold">No Plant Notes Found</h2>
                    <p className="text-gray-500 max-w-md">
                      {searchQuery
                        ? "No plant notes match your search criteria."
                        : plants.length > 0
                          ? "Start adding notes about specific plants in your garden."
                          : "Add some plants in the Garden Planner first, then come back to create plant-specific notes."}
                    </p>
                    <Button
                      className="mt-2 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setNewNote({
                          title: "",
                          content: "",
                          tags: [],
                          type: "plant",
                          color: "#e2f2e3",
                        })
                        setIsAddDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Plant Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes
                  .filter((note) => note.type === "plant")
                  .map((note) => (
                    <Card
                      key={note.id}
                      className="overflow-hidden hover:shadow-md transition-shadow transform hover:scale-105 transition-transform cursor-pointer"
                      style={{ backgroundColor: note.color || "#e2f2e3" }}
                      onClick={() => handleViewNote(note)}
                    >
                      {note.imageUrl && (
                        <div className="w-full h-40 overflow-hidden">
                          <img
                            src={note.imageUrl || "/placeholder.svg"}
                            alt={note.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2 border-b border-black/10">
                        <div className="flex items-center gap-2">
                          {note.plantEmoji && <span className="text-2xl">{note.plantEmoji}</span>}
                          <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(note.date), "PPP")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 mb-2">{note.content}</p>
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-black/5 dark:bg-white/10">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditNote(note)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNote(note.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="admin" className="pt-4">
            {filteredNotes.filter((note) => note.type === "admin").length === 0 ? (
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                      <BookOpen className="h-8 w-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-xl font-semibold">No Garden Tips Found</h2>
                    <p className="text-gray-500 max-w-md">
                      {searchQuery ? "No garden tips match your search criteria." : "Garden tips will appear here."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes
                  .filter((note) => note.type === "admin")
                  .map((note) => (
                    <Card
                      key={note.id}
                      className="overflow-hidden hover:shadow-md transition-shadow transform hover:scale-105 transition-transform cursor-pointer"
                      style={{ backgroundColor: note.color || "#e2f2e3" }}
                      onClick={() => handleViewNote(note)}
                    >
                      {note.imageUrl && (
                        <div className="w-full h-40 overflow-hidden">
                          <img
                            src={note.imageUrl || "/placeholder.svg"}
                            alt={note.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2 border-b border-black/10">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                          <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(note.date), "PPP")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 mb-2">{note.content}</p>
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-black/5 dark:bg-white/10">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-center pt-0">
                        <div className="text-xs text-muted-foreground">Garden tip</div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* View Note Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedNote?.title}</DialogTitle>
            </DialogHeader>
            {selectedNote && (
              <div className="py-4">
                {selectedNote.imageUrl && (
                  <div className="w-full h-60 overflow-hidden rounded-md mb-4">
                    <img
                      src={selectedNote.imageUrl || "/placeholder.svg"}
                      alt={selectedNote.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  {selectedNote.type === "plant" && selectedNote.plantEmoji && (
                    <span className="text-2xl">{selectedNote.plantEmoji}</span>
                  )}
                  {selectedNote.type === "admin" && (
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      Garden Tip
                    </Badge>
                  )}
                  <Badge variant="outline">{format(new Date(selectedNote.date), "PPP")}</Badge>
                </div>

                <div className="mb-4">
                  <div className="whitespace-pre-line text-sm">{selectedNote.content}</div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedNote.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {selectedNote.type !== "admin" && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsViewDialogOpen(false)
                        handleEditNote(selectedNote)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Note
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        setIsViewDialogOpen(false)
                        deleteNote(selectedNote.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Note
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Note Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
              <DialogDescription>Update your garden note</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-note-title">Title</Label>
                <Input
                  id="edit-note-title"
                  placeholder="Enter note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-note-content">Content</Label>
                <Textarea
                  id="edit-note-content"
                  placeholder="Write your note here..."
                  rows={8}
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Note Color</Label>
                <div className="flex flex-wrap gap-2">
                  {noteColors.map((color) => (
                    <div
                      key={color.value}
                      className={`w-8 h-8 rounded-full cursor-pointer ${
                        newNote.color === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewNote({ ...newNote, color: color.value })}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(newNote.tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 inline-flex items-center justify-center"
                      >
                        <span className="sr-only">Remove</span>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M1.5 1.5L4.5 4.5M1.5 4.5L4.5 1.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateNote} className="bg-green-600 hover:bg-green-700">
                Update Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
