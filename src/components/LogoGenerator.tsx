'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, HelpCircle, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/types/logo"
import LogoDetail from "./LogoDetail";

interface LogoGeneratorProps {
  logos: Logo[];
  setLogos: React.Dispatch<React.SetStateAction<Logo[]>>;
}

const LogoGenerator: React.FC<LogoGeneratorProps> = ({ logos, setLogos }) => {
  const [prompt, setPrompt] = useState("")
  const [color, setColor] = useState("")
  const [industry, setIndustry] = useState("")
  const [style, setStyle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/generate-logos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          prompt: `${prompt} Color: ${color}, Industry: ${industry}, Style: ${style}`,
          width: '1024',
          height: '768',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate logos');
      }

      const data = await response.json();
      const generatedLogos = data.logos.map((url: string, index: number) => ({
        id: logos.length + index + 1,
        url: url,
      }));

      setLogos([...logos, ...generatedLogos]);
    } catch (error) {
      console.error('Error generating logos:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogoClick = (logo: Logo) => {
    setSelectedLogo(logo);
  };

  const handleBackClick = () => {
    setSelectedLogo(null);
  };

  const handleLogoUpdate = (updatedLogo: Logo) => {
    const updatedLogos = logos.map((logo) =>
      logo.id === updatedLogo.id ? updatedLogo : logo
    );
    setLogos(updatedLogos);
    setSelectedLogo(updatedLogo);
  };

  return (
    <main className="flex-1 overflow-y-auto border-l border-r border-gray-200">
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
        <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
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
                  className="w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                    Color Scheme
                  </label>
                  <Select value={color} onValueChange={setColor}>
                    <SelectTrigger id="color" className="w-full border border-gray-300 rounded-md">
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
                    <SelectTrigger id="industry" className="w-full border border-gray-300 rounded-md">
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
                    <SelectTrigger id="style" className="w-full border border-gray-300 rounded-md">
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
              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800 rounded-md py-2 px-4 border border-transparent"
                disabled={isLoading}
              >
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
                <Card key={logo.id} className="overflow-hidden border border-gray-200 rounded-lg cursor-pointer" onClick={() => handleLogoClick(logo)}>
                  <CardContent className="p-4">
                    <img
                      src={logo.url}
                      alt={`Generated Logo ${logo.id}`}
                      className="w-full h-auto rounded-lg mb-4"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Logo {logo.id}</span>
                      <Button variant="outline" size="sm" className="border-gray-300 rounded-md">
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

      {selectedLogo && (
        <LogoDetail
          logo={selectedLogo}
          onBack={handleBackClick}
          onUpdate={handleLogoUpdate}
        />
      )}
    </main>
  )
}

export default LogoGenerator