"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListTodo, Plus, Calendar, Bell, Droplets, Sun, SproutIcon as Seedling, Scissors, Shovel } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { format, addDays, isSameDay } from "date-fns"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  completed: boolean
  category: string
  dueDate: string
  plantRelated?: boolean
  plantName?: string
  plantCount?: number
  recurring?: boolean
  lastCompleted?: string | null
  description?: string
  icon?: string
  postponed?: boolean
  originalDueDate?: string
  isPostponed?: boolean
}

// Motivational quotes for gardening
const motivationalQuotes = [
  "The glory of gardening: hands in the dirt, head in the sun, heart with nature.",
  "A garden is a grand teacher. It teaches patience and careful watchfulness.",
  "To plant a garden is to believe in tomorrow.",
  "Gardening is the art that uses flowers and plants as paint, and the soil and sky as canvas.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "A society grows great when old men plant trees whose shade they know they shall never sit in.",
  "Gardens are not made by singing 'Oh, how beautiful,' and sitting in the shade.",
  "When the world wearies and society fails to satisfy, there is always the garden.",
  "Gardening adds years to your life and life to your years.",
  "The garden suggests there might be a place where we can meet nature halfway.",
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [quote, setQuote] = useState("")
  const { toast } = useToast()
  const [weather, setWeather] = useState<{ condition: string; temperature: number } | null>(null)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("garden-tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    } else {
      // Generate default tasks if none exist
      generateDefaultTasks()
    }

    // Set a random motivational quote
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("garden-tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  // Check for daily task reset
  useEffect(() => {
    const lastResetDate = localStorage.getItem("tasks-last-reset-date")
    const today = new Date().toDateString()

    if (lastResetDate !== today) {
      // Reset daily tasks
      const updatedTasks = tasks.map((task) => {
        if (task.recurring && task.completed) {
          return {
            ...task,
            completed: false,
            lastCompleted: task.completed ? new Date().toISOString() : task.lastCompleted,
          }
        }
        return task
      })

      setTasks(updatedTasks)
      localStorage.setItem("tasks-last-reset-date", today)

      // Show notification for new day's tasks
      toast({
        title: "Good Morning, Gardener!",
        description: "Your daily tasks have been refreshed. Let's make today productive!",
        variant: "default",
      })
    }
  }, [tasks, toast])

  // Add a function to postpone overdue tasks
  const postponeOverdueTasks = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const updatedTasks = tasks.map((task) => {
      try {
        // Skip completed tasks
        if (task.completed) return task

        // Check if task has due date and is overdue
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate)
          if (dueDate < today) {
            // Postpone to today
            return {
              ...task,
              dueDate: today.toISOString(),
              postponed: true,
              originalDueDate: task.dueDate,
            }
          }
        }
        return task
      } catch (error) {
        console.error("Error checking task due date:", error)
        return task
      }
    })

    // Only update if we actually postponed any tasks
    const postponedCount = updatedTasks.filter(
      (t) => t.postponed && t.postponed !== tasks.find((orig) => orig.id === t.id)?.postponed,
    ).length

    if (postponedCount > 0) {
      setTasks(updatedTasks)
      localStorage.setItem("garden-tasks", JSON.stringify(updatedTasks))

      toast({
        title: "Tasks Postponed",
        description: `${postponedCount} overdue ${postponedCount === 1 ? "task has" : "tasks have"} been postponed to today.`,
        variant: "default",
      })
    }
  }

  // Run postponement check on component mount
  useEffect(() => {
    // After tasks are loaded, check for overdue tasks
    if (tasks.length > 0) {
      postponeOverdueTasks()
    }
  }, [tasks.length])

  // Generate default tasks
  const generateDefaultTasks = () => {
    const today = new Date()
    const tomorrow = addDays(today, 1)
    const dayAfterTomorrow = addDays(today, 2)

    const defaultTasks: Task[] = [
      {
        id: "1",
        title: "Water your plants",
        completed: false,
        category: "watering",
        dueDate: today.toISOString(),
        recurring: true,
        description: "Give your plants a thorough watering, focusing on the root zone.",
        icon: "💧",
      },
      {
        id: "2",
        title: "Check for pests",
        completed: false,
        category: "maintenance",
        dueDate: today.toISOString(),
        recurring: true,
        description: "Inspect leaves and stems for signs of pests or disease.",
        icon: "🔍",
      },
      {
        id: "3",
        title: "Add compost to garden beds",
        completed: false,
        category: "fertilizing",
        dueDate: tomorrow.toISOString(),
        description: "Spread a thin layer of compost around your plants to enrich the soil.",
        icon: "🌱",
      },
      {
        id: "4",
        title: "Prune tomato plants",
        completed: false,
        category: "pruning",
        dueDate: dayAfterTomorrow.toISOString(),
        plantRelated: true,
        plantName: "Tomato",
        description: "Remove suckers and lower leaves to improve air circulation.",
        icon: "✂️",
      },
      {
        id: "5",
        title: "Harvest ripe vegetables",
        completed: false,
        category: "harvesting",
        dueDate: tomorrow.toISOString(),
        description: "Pick vegetables that are ready to be harvested.",
        icon: "🧺",
      },
    ]

    setTasks(defaultTasks)
    localStorage.setItem("garden-tasks", JSON.stringify(defaultTasks))
  }

  // Generate tasks based on plants in garden
  const generateTasksFromPlants = () => {
    // Get plants from garden planner
    const storedGarden = localStorage.getItem("garden-planner-data")
    if (!storedGarden) {
      toast({
        title: "No Garden Found",
        description: "Please add plants to your garden first.",
        variant: "destructive",
      })
      return
    }

    try {
      const gardenData = JSON.parse(storedGarden)
      const placedPlants = gardenData.placedPlants || []

      if (placedPlants.length === 0) {
        toast({
          title: "No Plants Found",
          description: "Please add plants to your garden first.",
          variant: "destructive",
        })
        return
      }

      // Group plants by type
      const plantGroups: Record<string, { count: number; plant: any }> = {}

      // Plant database with details
      const plantDatabase = [
        { id: "tomato", name: "Tomato", emoji: "🍅", waterNeeds: "medium", growthTime: 90 },
        { id: "carrot", name: "Carrot", emoji: "🥕", waterNeeds: "high", growthTime: 75 },
        { id: "lettuce", name: "Lettuce", emoji: "🥬", waterNeeds: "high", growthTime: 60 },
        { id: "cucumber", name: "Cucumber", emoji: "🥒", waterNeeds: "high", growthTime: 65 },
        { id: "bellpepper", name: "Bell Pepper", emoji: "🫑", waterNeeds: "medium", growthTime: 90 },
        { id: "spinach", name: "Spinach", emoji: "🥬", waterNeeds: "medium", growthTime: 45 },
        { id: "broccoli", name: "Broccoli", emoji: "🥦", waterNeeds: "medium", growthTime: 80 },
        { id: "corn", name: "Corn", emoji: "🌽", waterNeeds: "medium", growthTime: 90 },
        { id: "potato", name: "Potato", emoji: "🥔", waterNeeds: "low", growthTime: 100 },
        { id: "onion", name: "Onion", emoji: "🧅", waterNeeds: "low", growthTime: 120 },
        { id: "garlic", name: "Garlic", emoji: "🧄", waterNeeds: "low", growthTime: 240 },
        { id: "eggplant", name: "Eggplant", emoji: "🍆", waterNeeds: "medium", growthTime: 80 },
        { id: "apple", name: "Apple", emoji: "🍎", waterNeeds: "medium", growthTime: 180 },
        { id: "strawberry", name: "Strawberry", emoji: "🍓", waterNeeds: "medium", growthTime: 90 },
        { id: "rose", name: "Rose", emoji: "🌹", waterNeeds: "medium", growthTime: 120 },
        { id: "mint", name: "Mint", emoji: "🌿", waterNeeds: "medium", growthTime: 60 },
      ]

      // Group plants by type
      placedPlants.forEach((placedPlant: any) => {
        const plantId = placedPlant.plantId
        const plantInfo = plantDatabase.find((p) => p.id === plantId) || {
          id: plantId,
          name: plantId.charAt(0).toUpperCase() + plantId.slice(1),
          emoji: "🌱",
          waterNeeds: "medium",
          growthTime: 90,
        }

        if (!plantGroups[plantId]) {
          plantGroups[plantId] = {
            count: 1,
            plant: plantInfo,
          }
        } else {
          plantGroups[plantId].count++
        }
      })

      // Generate tasks based on grouped plants
      const today = new Date()
      const newTasks: Task[] = []

      Object.values(plantGroups).forEach(({ count, plant }) => {
        // Water task based on water needs
        const waterFrequency = plant.waterNeeds === "high" ? 1 : plant.waterNeeds === "medium" ? 2 : 3
        const wateringDate = new Date(today)

        newTasks.push({
          id: `water-${plant.id}-${Date.now()}`,
          title: count > 1 ? `Water ${plant.name} plants (${count})` : `Water ${plant.name}`,
          completed: false,
          category: "watering",
          dueDate: wateringDate.toISOString(),
          plantRelated: true,
          plantName: plant.name,
          plantCount: count,
          recurring: true,
          description: `${plant.name} needs watering every ${waterFrequency} days. You have ${count} plant${count > 1 ? "s" : ""}.`,
          icon: "💧",
        })

        // Fertilizing task
        const fertilizingDate = addDays(today, 7) // Weekly
        newTasks.push({
          id: `fertilize-${plant.id}-${Date.now()}`,
          title: count > 1 ? `Fertilize ${plant.name} plants (${count})` : `Fertilize ${plant.name}`,
          completed: false,
          category: "fertilizing",
          dueDate: fertilizingDate.toISOString(),
          plantRelated: true,
          plantName: plant.name,
          plantCount: count,
          recurring: true,
          description: `Apply organic fertilizer to your ${count} ${plant.name} plant${count > 1 ? "s" : ""}.`,
          icon: "🌱",
        })

        // Pruning task
        const pruningDate = addDays(today, 14) // Bi-weekly
        newTasks.push({
          id: `prune-${plant.id}-${Date.now()}`,
          title: count > 1 ? `Prune ${plant.name} plants (${count})` : `Prune ${plant.name}`,
          completed: false,
          category: "pruning",
          dueDate: pruningDate.toISOString(),
          plantRelated: true,
          plantName: plant.name,
          plantCount: count,
          description: `Remove dead or damaged parts from your ${count} ${plant.name} plant${count > 1 ? "s" : ""}.`,
          icon: "✂️",
        })

        // Harvesting task if applicable
        if (plant.growthTime) {
          const harvestDate = addDays(today, plant.growthTime)
          newTasks.push({
            id: `harvest-${plant.id}-${Date.now()}`,
            title: count > 1 ? `Harvest ${plant.name} (${count} plants)` : `Harvest ${plant.name}`,
            completed: false,
            category: "harvesting",
            dueDate: harvestDate.toISOString(),
            plantRelated: true,
            plantName: plant.name,
            plantCount: count,
            description: `Your ${count} ${plant.name} plant${count > 1 ? "s" : ""} should be ready for harvest.`,
            icon: "🧺",
          })
        }
      })

      // Add new tasks to existing tasks
      setTasks((prevTasks) => [...prevTasks, ...newTasks])

      // Show success message
      toast({
        title: "Tasks Generated",
        description: `${newTasks.length} tasks have been created based on your garden plants.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error generating tasks:", error)
      toast({
        title: "Error",
        description: "Failed to generate tasks from your garden.",
        variant: "destructive",
      })
    }
  }

  const addTask = () => {
    if (newTaskTitle.trim() === "") return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      category: "other",
      dueDate: new Date().toISOString(),
      icon: "📝",
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle("")

    toast({
      title: "Task Added",
      description: `"${newTaskTitle}" has been added to your tasks.`,
      variant: "default",
    })
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newCompleted = !task.completed

          // If task is being marked as completed, show confetti
          if (newCompleted) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            })

            // Show congratulatory toast
            toast({
              title: "Task Completed! 🎉",
              description: "Great job! Keep up the good work in your garden.",
              variant: "default",
            })
          }

          return {
            ...task,
            completed: newCompleted,
            lastCompleted: newCompleted ? new Date().toISOString() : task.lastCompleted,
          }
        }
        return task
      }),
    )
  }

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    setTasks(tasks.filter((task) => task.id !== id))

    toast({
      title: "Task Deleted",
      description: `"${taskToDelete?.title}" has been deleted.`,
      variant: "destructive",
    })
  }

  // Filter tasks based on active tab
  const getFilteredTasks = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let filteredTasks

    switch (activeTab) {
      case "all":
        filteredTasks = tasks
        break
      case "today":
        filteredTasks = tasks.filter((task) => {
          const taskDate = new Date(task.dueDate)
          taskDate.setHours(0, 0, 0, 0)
          return isSameDay(taskDate, today)
        })
        break
      case "upcoming":
        filteredTasks = tasks.filter((task) => {
          const taskDate = new Date(task.dueDate)
          taskDate.setHours(0, 0, 0, 0)
          return taskDate > today
        })
        break
      case "completed":
        filteredTasks = tasks.filter((task) => task.completed)
        break
      case "watering":
        filteredTasks = tasks.filter((task) => task.category === "watering")
        break
      case "fertilizing":
        filteredTasks = tasks.filter((task) => task.category === "fertilizing")
        break
      case "pruning":
        filteredTasks = tasks.filter((task) => task.category === "pruning")
        break
      case "harvesting":
        filteredTasks = tasks.filter((task) => task.category === "harvesting")
        break
      default:
        filteredTasks = tasks
        break
    }

    // After filtering by category, identify postponed tasks
    return filteredTasks.map((task) => {
      if (task.postponed) {
        return { ...task, isPostponed: true }
      }
      return task
    })
  }

  const filteredTasks = getFilteredTasks()

  // Get icon for task category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "watering":
        return <Droplets className="h-4 w-4 text-blue-500" />
      case "fertilizing":
        return <Seedling className="h-4 w-4 text-green-500" />
      case "pruning":
        return <Scissors className="h-4 w-4 text-red-500" />
      case "harvesting":
        return <Shovel className="h-4 w-4 text-amber-500" />
      case "maintenance":
        return <Sun className="h-4 w-4 text-yellow-500" />
      default:
        return <ListTodo className="h-4 w-4 text-gray-500" />
    }
  }

  // Add a function to navigate to garden planner
  const router = useRouter()
  const goToGardenPlanner = () => {
    router.push("/garden-planner")
  }

  useEffect(() => {
    // Check for garden alerts and tasks that need attention
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get tasks due today
    const tasksDueToday = tasks.filter((task) => {
      try {
        if (task.completed) return false
        const dueDate = new Date(task.dueDate)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate.getTime() === today.getTime()
      } catch (error) {
        return false
      }
    })

    // Show reminder for today's tasks
    if (tasksDueToday.length > 0) {
      toast({
        title: "Today's Garden Tasks",
        description: `You have ${tasksDueToday.length} tasks scheduled for today.`,
        variant: "default",
      })
    }

    // Check for overdue tasks
    const overdueTasks = tasks.filter((task) => {
      try {
        if (task.completed) return false
        const dueDate = new Date(task.dueDate)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate < today
      } catch (error) {
        return false
      }
    })

    // Show critical alert for overdue tasks
    if (overdueTasks.length > 0) {
      toast({
        title: "Overdue Garden Tasks",
        description: `You have ${overdueTasks.length} overdue tasks that need attention.`,
        variant: "destructive",
      })
    }
  }, [tasks, toast])

  return (
    <DashboardLayout>
      <motion.div
        className="flex flex-col gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-4">
          <motion.h1
            className="text-3xl font-bold flex items-center gap-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ListTodo className="h-8 w-8" />
            Garden Tasks
          </motion.h1>

          <motion.div
            className="bg-muted p-4 rounded-lg text-center italic"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            "{quote}"
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="md:col-span-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Task List</CardTitle>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add a new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                  />
                  <Button onClick={addTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <AnimatePresence>
                  {filteredTasks.length === 0 ? (
                    <motion.div
                      className="text-center py-8 text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      No tasks found. Add some tasks to get started!
                    </motion.div>
                  ) : (
                    <motion.div className="space-y-2">
                      {filteredTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          className={`flex items-start justify-between p-3 border rounded-lg ${
                            task.completed
                              ? "bg-muted/50"
                              : task.isPostponed
                                ? "bg-amber-50 dark:bg-amber-900/20"
                                : "hover:bg-muted/20"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTaskCompletion(task.id)}
                              id={`task-${task.id}`}
                              className="mt-1"
                            />
                            <div className="space-y-1">
                              <label
                                htmlFor={`task-${task.id}`}
                                className={`font-medium flex items-center gap-2 ${
                                  task.completed ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                <span className="text-lg">{task.icon}</span>
                                {task.title}
                                {task.plantCount && task.plantCount > 1 && (
                                  <span className="ml-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                                    {task.plantCount} plants
                                  </span>
                                )}
                                {task.category === "watering" && weather && weather.condition === "Rain" && (
                                  <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                    Rain forecast - may skip
                                  </span>
                                )}

                                {task.category === "planting" && weather && weather.temperature > 30 && (
                                  <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-full">
                                    Hot weather - water well
                                  </span>
                                )}
                                {task.recurring && (
                                  <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                    Recurring
                                  </span>
                                )}
                                {task.isPostponed && (
                                  <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                                    Postponed
                                  </span>
                                )}
                              </label>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  {getCategoryIcon(task.category)}
                                  <span className="capitalize">{task.category}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                                </div>
                                {task.plantRelated && task.plantName && (
                                  <span className="bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded text-green-800 dark:text-green-300">
                                    {task.plantName}
                                  </span>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            Delete
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Task Categories</CardTitle>
                <CardDescription>Filter tasks by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={activeTab === "watering" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("watering")}
                  >
                    <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                    Watering
                    <span className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full px-2 py-0.5">
                      {tasks.filter((t) => t.category === "watering").length}
                    </span>
                  </Button>

                  <Button
                    variant={activeTab === "fertilizing" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("fertilizing")}
                  >
                    <Seedling className="h-4 w-4 mr-2 text-green-500" />
                    Fertilizing
                    <span className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full px-2 py-0.5">
                      {tasks.filter((t) => t.category === "fertilizing").length}
                    </span>
                  </Button>

                  <Button
                    variant={activeTab === "pruning" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("pruning")}
                  >
                    <Scissors className="h-4 w-4 mr-2 text-red-500" />
                    Pruning
                    <span className="ml-auto bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-full px-2 py-0.5">
                      {tasks.filter((t) => t.category === "pruning").length}
                    </span>
                  </Button>

                  <Button
                    variant={activeTab === "harvesting" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("harvesting")}
                  >
                    <Shovel className="h-4 w-4 mr-2 text-amber-500" />
                    Harvesting
                    <span className="ml-auto bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs rounded-full px-2 py-0.5">
                      {tasks.filter((t) => t.category === "harvesting").length}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Generation</CardTitle>
                <CardDescription>Automatically create tasks based on your garden</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={generateTasksFromPlants}>
                  <Seedling className="h-4 w-4 mr-2" />
                  Generate Tasks from Plants
                </Button>

                <div className="mt-4 text-sm text-muted-foreground">
                  This will create watering, fertilizing, pruning, and harvesting tasks based on the plants in your
                  garden. Multiple plants of the same type will be grouped into a single task.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reminders</CardTitle>
                <CardDescription>Tasks due in the next few days</CardDescription>
              </CardHeader>
              <CardContent>
                {tasks.filter((task) => {
                  const taskDate = new Date(task.dueDate)
                  const today = new Date()
                  const threeDaysLater = addDays(today, 3)
                  return !task.completed && taskDate >= today && taskDate <= threeDaysLater
                }).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No upcoming reminders.</div>
                ) : (
                  <div className="space-y-2">
                    {tasks
                      .filter((task) => {
                        const taskDate = new Date(task.dueDate)
                        const today = new Date()
                        const threeDaysLater = addDays(today, 3)
                        return !task.completed && taskDate >= today && taskDate <= threeDaysLater
                      })
                      .slice(0, 3)
                      .map((task) => (
                        <div key={task.id} className="flex items-center gap-2 p-2 border rounded-md">
                          <Bell className="h-4 w-4 text-amber-500" />
                          <div>
                            <div className="text-sm font-medium">{task.title}</div>
                            <div className="text-xs text-muted-foreground">
                              Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
