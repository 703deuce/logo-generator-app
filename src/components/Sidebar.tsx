import React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart2, FileText, Users, Key, Settings } from "lucide-react"

export default function Sidebar() {
  return (
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
          {[ 
            { icon: BarChart2, label: "Metrics" },
            { icon: FileText, label: "Reports" },
            { icon: Users, label: "Assistants", active: true },
            { icon: Key, label: "API Keys" },
            { icon: Settings, label: "Settings" },
          ].map(({ icon: Icon, label, active }) => (
            <li key={label}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${active ? "text-purple-600 bg-purple-50" : ""}`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}