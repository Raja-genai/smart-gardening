"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, Check, Clock, Trash2 } from "lucide-react"
import {
  addDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  format,
  addMonths,
  subMonths,
} from "date-fns"
import DashboardLayout from "@/components/dashboard-layout"

interface Event {
  id: number
  title: string
  date: Date
  type: string
  completed: boolean
  description?: string
  plantId?: string
}

interface Plant {
  id: string
  plantId: string
  name: string
  x: number
  y: number
  plantedDate: string
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    type: "watering",
    completed: false,
    description: "",
  })
  const [plantedPlants, setPlantedPlants] = useState<Plant[]>([])
  const [harvestEvents, setHarvestEvents] = useState<Event[]>([])

  // Load events and plants from localStorage
  useEffect(() => {
    // Load events
    const storedEvents = localStorage.getItem("garden-calendar-events")
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date),
        }))
        setEvents(parsedEvents)
      } catch (error) {
        console.error("Error parsing events:", error)
      }
    } else {
      // Default events for demo
      generateDefaultEvents()
    }

    // Load planted plants
    const storedGarden = localStorage.getItem("garden-planner-data")
    if (storedGarden) {
      try {
        const parsedGarden = JSON.parse(storedGarden)
        if (parsedGarden.placedPlants) {
          const plants = parsedGarden.placedPlants.map((plant: any) => ({
            ...plant,
            plantedDate: plant.plantedDate || new Date().toISOString(),
          }))
          setPlantedPlants(plants)

          // Create harvest events for all planted plants
          const harvestDates = createHarvestEvents(plants)
          setHarvestEvents(harvestDates)
        }
      } catch (error) {
        console.error("Error parsing garden data:", error)
      }
    }
  }, [])

  // Save events to localStorage
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("garden-calendar-events", JSON.stringify(events))
    }
  }, [events])

  // Generate default events
  const generateDefaultEvents = () => {
    const today = new Date()
    const defaultEvents: Event[] = [
      {
        id: 1,
        title: "Prune tomato plants",
        date: today,
        type: "maintenance",
        completed: false,
        description: "Remove suckers and lower leaves to improve air circulation.",
        plantId: "tomato",
      },
      {
        id: 2,
        title: "Apply Fertilizer",
        date: addDays(today, 2),
        type: "fertilizing",
        completed: false,
        description: "Apply organic fertilizer to all vegetable plants.",
      },
      {
        id: 3,
        title: "Plant Spinach Seeds",
        date: addDays(today, 4),
        type: "planting",
        completed: false,
        description: "Plant spinach seeds in prepared garden bed with 2-inch spacing.",
        plantId: "spinach",
      },
      {
        id: 4,
        title: "Harvest Lettuce",
        date: addDays(today, 7),
        type: "harvesting",
        completed: false,
        description: "Harvest mature lettuce leaves, leaving small ones to continue growing.",
        plantId: "lettuce",
      },
      {
        id: 5,
        title: "Check for Pests",
        date: addDays(today, 3),
        type: "maintenance",
        completed: false,
        description: "Inspect plants for signs of pests or disease. Focus on leaf undersides.",
      },
    ]

    setEvents(defaultEvents)
    localStorage.setItem("garden-calendar-events", JSON.stringify(defaultEvents))
  }

  // Create harvest events based on planted plants
  const createHarvestEvents = (plants: Plant[]): Event[] => {
    return plants.map((plant, index) => {
      const plantedDate = new Date(plant.plantedDate)

      // Determine harvest date based on plant type
      let growthDays = 90 // default
      const plantName = plant.plantId.charAt(0).toUpperCase() + plant.plantId.slice(1)

      // Set growth days based on plant type
      if (plant.plantId.includes("lettuce") || plant.plantId.includes("spinach")) growthDays = 45
      else if (plant.plantId.includes("radish")) growthDays = 30
      else if (plant.plantId.includes("carrot")) growthDays = 75
      else if (plant.plantId.includes("tomato")) growthDays = 90
      else if (plant.plantId.includes("pepper")) growthDays = 100
      else if (plant.plantId.includes("cucumber")) growthDays = 65
      else if (plant.plantId.includes("broccoli")) growthDays = 80

      const harvestDate = new Date(plantedDate)
      harvestDate.setDate(plantedDate.getDate() + growthDays)

      return {
        id: 1000 + index, // Using 1000+ for harvest event IDs to avoid conflicts
        title: `Harvest ${plantName}`,
        date: harvestDate,
        type: "harvesting",
        completed: false,
        description: `${plantName} should be ready for harvest.`,
        plantId: plant.plantId,
      }
    })
  }

  // Handle adding a new event
  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDate) return

    const eventToAdd: Event = {
      id: Date.now(),
      title: newEvent.title || "",
      date: selectedDate,
      type: newEvent.type || "other",
      completed: false,
      description: newEvent.description,
      plantId: newEvent.plantId,
    }

    setEvents([...events, eventToAdd])
    setIsAddDialogOpen(false)
    setNewEvent({
      title: "",
      type: "watering",
      completed: false,
      description: "",
    })
  }

  // Handle mark as complete
  const handleMarkComplete = (id: number) => {
    setEvents(
      events.map((event) => {
        if (event.id === id) {
          return { ...event, completed: true }
        }
        return event
      }),
    )
    setIsViewDialogOpen(false)
  }

  // Handle postpone
  const handlePostpone = (id: number) => {
    setEvents(
      events.map((event) => {
        if (event.id === id) {
          const newDate = new Date(event.date)
          newDate.setDate(newDate.getDate() + 1)
          return { ...event, date: newDate }
        }
        return event
      }),
    )
    setIsViewDialogOpen(false)
  }

  // Handle delete event
  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id))
    setIsViewDialogOpen(false)
  }

  // Get all events for selected date
  const selectedDateEvents = selectedDate
    ? [...events, ...harvestEvents].filter((event) => event.date && isSameDay(new Date(event.date), selectedDate))
    : []

  // Get events for the current month
  const currentMonthDays = date
    ? eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date),
      })
    : []

  // Get the number of events for each day in the current month
  const getEventsForDay = (day: Date) => {
    if (!day) return []

    return [...events, ...harvestEvents].filter((event) => event.date && isSameDay(new Date(event.date), day))
  }

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "watering":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "fertilizing":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "planting":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      case "harvesting":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "maintenance":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Get event type emoji
  const getEventTypeEmoji = (type: string) => {
    switch (type) {
      case "watering":
        return "💧"
      case "fertilizing":
        return "🌱"
      case "planting":
        return "🌿"
      case "harvesting":
        return "🧺"
      case "maintenance":
        return "🔍"
      default:
        return "📅"
    }
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setDate(subMonths(date, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setDate(addMonths(date, 1))
  }

  // Go to today
  const goToToday = () => {
    const today = new Date()
    setDate(today)
    setSelectedDate(today)
  }

  // Render calendar grid
  const renderCalendarGrid = () => {
    const firstDayOfMonth = startOfMonth(date)
    const lastDayOfMonth = endOfMonth(date)
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth })

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDayOfMonth.getDay()

    // Create array for previous month's days that appear in the first week
    const prevMonthDays = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDay = new Date(firstDayOfMonth)
      prevDay.setDate(prevDay.getDate() - (firstDayOfWeek - i))
      prevMonthDays.push(prevDay)
    }

    // Create array for next month's days that appear in the last week
    const nextMonthDays = []
    const remainingCells = 42 - (prevMonthDays.length + daysInMonth.length) // 42 = 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextDay = new Date(lastDayOfMonth)
      nextDay.setDate(nextDay.getDate() + i)
      nextMonthDays.push(nextDay)
    }

    // Combine all days
    const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays]

    // Create weeks
    const weeks = []
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7))
    }

    return (
      <div className="w-full">
        <div className="grid grid-cols-7 text-center text-sm font-medium border-b">
          <div className="p-2">Sun</div>
          <div className="p-2">Mon</div>
          <div className="p-2">Tue</div>
          <div className="p-2">Wed</div>
          <div className="p-2">Thu</div>
          <div className="p-2">Fri</div>
          <div className="p-2">Sat</div>
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const isCurrentMonth = day.getMonth() === date.getMonth()
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const isTodayDate = isToday(day)
              const dayEvents = getEventsForDay(day)
              const hasPlantingEvent = dayEvents.some((event) => event.type === "planting")
              const hasHarvestingEvent = dayEvents.some((event) => event.type === "harvesting")
              const hasCompletedPlantingEvent = dayEvents.some((event) => event.type === "planting" && event.completed)
              const hasCompletedHarvestingEvent = dayEvents.some(
                (event) => event.type === "harvesting" && event.completed,
              )

              let bgColor = "bg-white dark:bg-gray-950"
              if (hasCompletedPlantingEvent) bgColor = "bg-green-100 dark:bg-green-900/20"
              else if (hasPlantingEvent) bgColor = "bg-green-50 dark:bg-green-900/10"
              else if (hasCompletedHarvestingEvent) bgColor = "bg-red-100 dark:bg-red-900/20"
              else if (hasHarvestingEvent) bgColor = "bg-red-50 dark:bg-red-900/10"

              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`border p-1 min-h-[80px] ${
                    isCurrentMonth ? "" : "text-gray-400 dark:text-gray-600"
                  } ${isSelected ? "ring-2 ring-primary" : ""} ${bgColor}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="flex flex-col h-full">
                    <div
                      className={`text-right p-1 ${
                        isTodayDate
                          ? "bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center ml-auto"
                          : ""
                      }`}
                    >
                      {day.getDate()}
                    </div>
                    <div className="flex-grow">
                      {dayEvents.length > 0 && (
                        <div className="mt-1">
                          {dayEvents.slice(0, 2).map((event, i) => (
                            <div key={i} className="text-xs truncate flex items-center gap-1" title={event.title}>
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  event.type === "planting"
                                    ? "bg-green-500"
                                    : event.type === "harvesting"
                                      ? "bg-red-500"
                                      : event.type === "watering"
                                        ? "bg-blue-500"
                                        : event.type === "fertilizing"
                                          ? "bg-amber-500"
                                          : "bg-purple-500"
                                }`}
                              ></span>
                              <span className={event.completed ? "line-through" : ""}>{event.title}</span>
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            }),
          )}
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your gardening activities</p>
        </div>

        <Card className="p-0 overflow-hidden">
          <CardHeader className="bg-muted/30 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{format(date, "MMMM yyyy")}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Month</span>
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Month</span>
                </Button>
              </div>
            </div>
            <div className="text-center italic text-muted-foreground mt-2">
              "Gardening adds years to your life and life to your years."
            </div>
          </CardHeader>
          <CardContent className="p-0">{renderCalendarGrid()}</CardContent>
          <CardFooter className="flex justify-center p-4 bg-muted/30">
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {format(selectedDate, "MMMM d, yyyy")}
                  {isToday(selectedDate) && <Badge className="ml-2 bg-green-500 hover:bg-green-600">Today</Badge>}
                </CardTitle>
                <CardDescription>
                  {selectedDateEvents.length === 0
                    ? "0 events, 0 tasks"
                    : `${selectedDateEvents.length} event${selectedDateEvents.length === 1 ? "" : "s"}, ${
                        selectedDateEvents.filter((e) => !e.completed).length
                      } task${selectedDateEvents.filter((e) => !e.completed).length === 1 ? "" : "s"}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Tasks</h3>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedEvent(event)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Checkbox
                            checked={event.completed}
                            onCheckedChange={() => handleMarkComplete(event.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div
                              className={`font-medium ${event.completed ? "line-through text-muted-foreground" : ""}`}
                            >
                              {event.title}
                            </div>
                            {event.description && (
                              <div
                                className={`text-sm ${event.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
                              >
                                {event.description}
                              </div>
                            )}
                          </div>
                          <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No tasks scheduled for this day.</p>
                      <Button size="sm" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
                <CardDescription>Calendar event types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div>Planting</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div>Harvesting</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>Watering</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div>Fertilizing</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <div>Maintenance</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-3">Calendar Colors</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 border"></div>
                      <div>Planting day (completed)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-50 dark:bg-green-900/10 border"></div>
                      <div>Planting day (scheduled)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 dark:bg-red-900/20 border"></div>
                      <div>Harvesting day (completed)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-50 dark:bg-red-900/10 border"></div>
                      <div>Harvesting day (scheduled)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setIsAddDialogOpen(true)} className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Add Event Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Event Title
                </label>
                <Input
                  id="title"
                  value={newEvent.title || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title..."
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Event Type
                </label>
                <Select
                  value={newEvent.type || "watering"}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="watering">Watering</SelectItem>
                    <SelectItem value="fertilizing">Fertilizing</SelectItem>
                    <SelectItem value="planting">Planting</SelectItem>
                    <SelectItem value="harvesting">Harvesting</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Textarea
                  id="description"
                  value={newEvent.description || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event details..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent} className="bg-green-600 hover:bg-green-700">
                Add Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View/Edit Event Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="py-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`${getEventTypeColor(selectedEvent.type)} capitalize`}>{selectedEvent.type}</Badge>
                  <Badge variant="outline">
                    {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </Badge>
                  {selectedEvent.completed && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    >
                      Completed
                    </Badge>
                  )}
                </div>

                {selectedEvent.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-6">
                  {!selectedEvent.completed && (
                    <>
                      <Button variant="outline" className="sm:flex-1" onClick={() => handlePostpone(selectedEvent.id)}>
                        <Clock className="h-4 w-4 mr-2" />
                        Postpone
                      </Button>
                      <Button
                        className="sm:flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleMarkComplete(selectedEvent.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="sm:flex-1 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
