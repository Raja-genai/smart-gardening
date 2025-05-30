import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold">Smart Garden Planner</span>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/auth">Login</Link>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/auth?mode=signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Plan Your Perfect Garden</h1>
          <p className="text-xl text-gray-600 mb-8">
            Smart Garden Planner helps you design, plan, and maintain your garden based on local weather conditions and
            plant requirements specific to Indian climate.
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/auth?mode=signup">Get Started</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Weather-Based Planning</h2>
            <p className="text-gray-600">
              Get real-time weather data and recommendations for what to plant based on your local conditions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Visual Garden Planner</h2>
            <p className="text-gray-600">
              Design your garden layout with our interactive tool and see how your plants will grow together.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Indian Plant Database</h2>
            <p className="text-gray-600">
              Access information on plants that thrive in Indian climate conditions with region-specific advice.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-green-50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2023 Smart Garden Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
