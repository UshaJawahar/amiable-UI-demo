'use client'

import { useSidebar } from './SidebarContext'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isDesktopMenuOpen } = useSidebar()

  return (
    <div className={`transition-all duration-300 ${
      isDesktopMenuOpen ? 'lg:ml-64' : 'lg:ml-16'
    }`}>
      {/* Desktop Header Spacer */}
      <div className="hidden lg:block h-16"></div>
      {/* Mobile Header Spacer */}
      <div className="lg:hidden h-16"></div>
      {children}
    </div>
  )
} 