'use client'

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/types/logo"

interface LogoHistoryProps {
  logos: Logo[];
  setLogos: React.Dispatch<React.SetStateAction<Logo[]>>;
}

const LogoHistory: React.FC<LogoHistoryProps> = ({ logos, setLogos }) => {
  const addSampleLogo = () => {
    const newLogo: Logo = {
      id: logos.length + 1,
      url: `/placeholder.svg?height=200&width=200&text=Logo${logos.length + 1}`,
    };
    setLogos([...logos, newLogo]);
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Logo History</h3>
      {logos.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">No logos generated yet.</p>
          <Button onClick={addSampleLogo}>Add Sample Logo</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {logos.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center">
                <img
                  src={item.url}
                  alt={`Logo ${item.id}`}
                  className="w-16 h-16 rounded-md mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Logo #{item.id}</h4>
                  <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </aside>
  )
}

export default LogoHistory