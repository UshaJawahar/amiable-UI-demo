'use client'

import React, { createContext, useContext, useState } from 'react'

interface SidebarContextType {
  isDesktopMenuOpen: boolean
  setIsDesktopMenuOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ isDesktopMenuOpen, setIsDesktopMenuOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
} 