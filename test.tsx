"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, BarChart2, FileText, Users, Key, HelpCircle, Settings, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LogoGeneratorDashboard() {
  const [prompt, setPrompt] = useState("")
  const [color, setColor] = useState("")
  const [industry, setIndustry] = useState("")
  const [style, setStyle] = useState("")
  const [logos, setLogos] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulating API call to generate logos
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Replace this with actual API call to your AI model
    const generatedLogos = [
      { id: 1, url: "/placeholder.svg?height=200&width=200" },
      { id: 2, url: "/placeholder.svg?height=200&width=200" },
      { id: 3, url: "/placeholder.svg?height=200&width=200" },
      { id: 4, url: "/placeholder.svg?height=200&width=200" },
    ]
    setLogos(generatedLogos)
    setIsLoading(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-purple-600 rounded-md mr-2"></div>
          <h1 className="text-xl font-semibold">Logo AI</h1>
        </div>
        <div className="mb-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="96's team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="96">96's team</SelectItem>
              <SelectItem value="other">Other team</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart2 className="mr-2 h-4 w-4" />
                Metrics
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start text-purple-600 bg-purple-50">
                <Users className="mr-2 h-4 w-4" />
                Assistants
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Key className="mr-2 h-4 w-4" />
                API Keys
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Logo Generator</h2>
            <p className="text-sm text-gray-500">Create unique logos with AI</p>
          </div>
          <div className="flex items-center">
            <HelpCircle className="h-6 w-6 text-gray-400" />
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                    Describe your logo
                  </label>
                  <Input
                    id="prompt"
                    placeholder="E.g., A modern logo for a tech startup"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                      Color Scheme
                    </label>
                    <Select value={color} onValueChange={setColor}>
                      <SelectTrigger id="color">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vibrant">Vibrant</SelectItem>
                        <SelectItem value="pastel">Pastel</SelectItem>
                        <SelectItem value="monochrome">Monochrome</SelectItem>
                        <SelectItem value="earthy">Earthy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
                      Style
                    </label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger id="style">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                        <SelectItem value="futuristic">Futuristic</SelectItem>
                        <SelectItem value="handdrawn">Hand-drawn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Logos
                    </>
                  ) : (
                    "Generate Logos"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {logos.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Generated Logos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {logos.map((logo) => (
                  <Card key={logo.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <img
                        src={logo.url}
                        alt={`Generated Logo ${logo.id}`}
                        className="w-full h-auto rounded-lg mb-4"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Logo {logo.id}</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Logo History</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardContent className="p-4 flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-md mr-4"></div>
                <div>
                  <h4 className="font-semibold">Logo #{item}</h4>
                  <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </aside>
    </div>
  )
}