"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, ListTodo, Calendar, Leaf, AlertTriangle } from "lucide-react"

interface Task {
  id: string
  title: string
  completed: boolean
  category: string
  dueDate?: string
  plantRelated?: boolean
  plantName?: string
}

interface Event {
  id: string
  title: string
  date: Date
  type: string
}

interface PlacedPlant {
  id: string
  name: string
  type: string
  x: number
  y: number
  plantedDate: string
}

export function DashboardWidgets() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [plants, setPlants] = useState<PlacedPlant[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load tasks
    const storedTasks = localStorage.getItem("garden-tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }

    // Load events
    const storedEvents = localStorage.getItem("garden-calendar-events")
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date),
      }))
      setEvents(parsedEvents)
    }

    // Load plants
    const storedGarden = localStorage.getItem("garden-planner-data")
    if (storedGarden) {
      const parsedData = JSON.parse(storedGarden)
      if (parsedData.placedPlants) {
        setPlants(parsedData.placedPlants)
      }
    }
  }, [])

  // Calculate task completion percentage
  const taskCompletionPercentage =
    tasks.length > 0 ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0

  // Get upcoming events (next 7 days)
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date)
      const today = new Date()
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)
      return eventDate >= today && eventDate <= nextWeek
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  // Get pending tasks
  const pendingTasks = tasks.filter((task) => !task.completed).slice(0, 3)

  // Get recently added plants
  const recentPlants = [...plants]
    .sort((a, b) => new Date(b.plantedDate).getTime() - new Date(a.plantedDate).getTime())
    .slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Task Progress
          </CardTitle>
          <CardDescription>Track your garden task completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">
                {tasks.filter((task) => task.completed).length} of {tasks.length} tasks completed
              </div>
              <div className="text-sm font-medium">{taskCompletionPercentage}%</div>
            </div>
            <Progress value={taskCompletionPercentage} className="h-2" />

            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="space-y-2 pt-2">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No pending tasks. Great job!</div>
                ) : (
                  pendingTasks
                    .filter((task) => {
                      try {
                        // Only show tasks due today or in the future
                        if (!task.dueDate) return true
                        const dueDate = new Date(task.dueDate)
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return dueDate >= today
                      } catch (error) {
                        return true
                      }
                    })
                    .map((task) => (
                      <div key={task.id} className="flex items-center justify-between gap-2 p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">{task.title}</div>
                        </div>
                        {task.dueDate && (
                          <div className="text-xs text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))
                )}
              </TabsContent>
              <TabsContent value="overdue" className="space-y-2 pt-2">
                {tasks.filter((task) => {
                  try {
                    if (task.completed || !task.dueDate) return false
                    const dueDate = new Date(task.dueDate)
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return dueDate < today
                  } catch (error) {
                    return false
                  }
                }).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No overdue tasks. You're all caught up!</div>
                ) : (
                  tasks
                    .filter((task) => {
                      try {
                        if (task.completed || !task.dueDate) return false
                        const dueDate = new Date(task.dueDate)
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return dueDate < today
                      } catch (error) {
                        return false
                      }
                    })
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between gap-2 p-2 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <div className="text-sm">{task.title}</div>
                        </div>
                        <div className="text-xs text-red-500 font-medium">
                          Overdue: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                )}
              </TabsContent>
              <TabsContent value="completed" className="space-y-2 pt-2">
                {tasks.filter((task) => task.completed).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No completed tasks yet.</div>
                ) : (
                  tasks
                    .filter((task) => task.completed)
                    .slice(0, 3)
                    .map((task) => (
                      <div key={task.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <div className="text-sm">{task.title}</div>
                      </div>
                    ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Your next garden activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No upcoming events in the next 7 days.</div>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-2 p-2 border rounded-md">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Garden Overview
          </CardTitle>
          <CardDescription>Summary of your garden plants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Plants</div>
                <div className="text-lg font-medium">{plants.length}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Plant Types</div>
                <div className="text-lg font-medium">{new Set(plants.map((p) => p.type)).size}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Recently Added Plants</h4>
              {recentPlants.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No plants added yet.</div>
              ) : (
                <div className="space-y-2">
                  {recentPlants.map((plant, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                      <Leaf className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-sm font-medium">{plant.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">{plant.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
