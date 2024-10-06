'use client'

import React, { useState } from "react"
import Sidebar from "./Sidebar"
import LogoGenerator from "./LogoGenerator"
import LogoHistory from "./LogoHistory"  // Comment out or remove this line if LogoHistory doesn't exist yet
import { Logo } from "@/types/logo"

export default function LogoGeneratorDashboard() {
  const [logos, setLogos] = useState<Logo[]>([])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <LogoGenerator logos={logos} setLogos={setLogos} />
      <LogoHistory logos={logos} setLogos={setLogos} />
    </div>
  )
}
