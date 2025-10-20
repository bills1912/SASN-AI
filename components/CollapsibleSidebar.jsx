'use client'

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  ChartBar,
  ChevronDown,
  ChevronUp,
  LogOut,
  Moon,
  Sun,
  BarChart3,
  Code,
  TrendingUp,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Activity,
  AlertTriangle,
  Award,
  Target as TargetIcon,
  FileBarChart
} from 'lucide-react';

export default function CollapsibleSidebar({ currentView, setCurrentView, user, onLogout, theme, toggleTheme }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [talentExpanded, setTalentExpanded] = useState(true);
  const [performanceExpanded, setPerformanceExpanded] = useState(false);

  const menuItems = [
    {
      id: 'input-data',
      label: 'Input Data',
      icon: FileText,
      section: 'main'
    },
    {
      id: 'talent-management',
      label: 'Manajemen Talenta',
      icon: Users,
      section: 'talent',
      submenu: [
        { id: 'talent-mapping', label: 'Pemetaan Talenta', icon: BarChart3 },
        { id: 'analysis-summary', label: 'Ringkasan Analisis', icon: ChartBar },
        { id: 'job-recommendation', label: 'Rekomendasi Jabatan', icon: CheckCircle },
        { id: 'skill-analysis', label: 'Analisis Skill', icon: Code },
        { id: 'development-area', label: 'Area Pengembangan', icon: TrendingUp }
      ]
    },
    {
      id: 'performance-assessment',
      label: 'Penilaian Kinerja',
      icon: ChartBar,
      section: 'performance',
      submenu: [
        { id: 'performance-overview', label: 'Overview Kinerja', icon: Activity },
        { id: 'performance-classification', label: 'Klasifikasi', icon: TargetIcon },
        { id: 'performance-strengths', label: 'Kekuatan', icon: Award },
        { id: 'performance-improvements', label: 'Area Perbaikan', icon: AlertTriangle },
        { id: 'performance-recommendations', label: 'Rekomendasi', icon: TrendingUp },
        { id: 'performance-trends', label: 'Trend & News', icon: FileBarChart }
      ]
    }
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className={cn(
      "flex flex-col h-full",
      isMobile ? "w-full" : ""
    )}>
      {/* Header */}
      <div className={cn(
        "border-b border-slate-800 transition-all duration-300",
        isCollapsed && !isMobile ? "p-4" : "p-6"
      )}>
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">ASTA-CITA AI</h1>
                <p className="text-xs text-slate-400">BKN Hackathon 2024</p>
              </div>
            </div>
          )}
          
          {isCollapsed && !isMobile && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          )}
          
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
              className="text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.section === 'main' && (
              <button
                onClick={() => setCurrentView(item.id)}
                title={isCollapsed ? item.label : ''}
                className={cn(
                  "w-full flex items-center transition-colors",
                  isCollapsed && !isMobile ? "justify-center px-4 py-3" : "space-x-3 px-6 py-3",
                  currentView === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("flex-shrink-0", isCollapsed && !isMobile ? "w-6 h-6" : "w-5 h-5")} />
                {(!isCollapsed || isMobile) && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            )}

            {item.section === 'talent' && (
              <div>
                <button
                  onClick={() => {
                    if (isCollapsed && !isMobile) {
                      setIsCollapsed(false);
                    }
                    setTalentExpanded(!talentExpanded);
                    setCurrentView(item.id);
                  }}
                  title={isCollapsed ? item.label : ''}
                  className={cn(
                    "w-full flex items-center transition-colors",
                    isCollapsed && !isMobile ? "justify-center px-4 py-3" : "justify-between px-6 py-3",
                    currentView.startsWith('talent') || currentView === item.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "flex items-center",
                    !isCollapsed || isMobile ? "space-x-3" : ""
                  )}>
                    <item.icon className={cn("flex-shrink-0", isCollapsed && !isMobile ? "w-6 h-6" : "w-5 h-5")} />
                    {(!isCollapsed || isMobile) && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                  {(!isCollapsed || isMobile) && (
                    talentExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {talentExpanded && (!isCollapsed || isMobile) && item.submenu && (
                  <div className="bg-slate-800/50">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        onClick={() => setCurrentView(subitem.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 pl-14 pr-6 py-2.5 transition-colors",
                          currentView === subitem.id
                            ? "text-blue-400 bg-slate-900"
                            : "text-slate-400 hover:text-white hover:bg-slate-900"
                        )}
                      >
                        <subitem.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{subitem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {item.section === 'performance' && (
              <div>
                <button
                  onClick={() => {
                    if (isCollapsed && !isMobile) {
                      setIsCollapsed(false);
                    }
                    setPerformanceExpanded(!performanceExpanded);
                    setCurrentView(item.id);
                  }}
                  title={isCollapsed ? item.label : ''}
                  className={cn(
                    "w-full flex items-center transition-colors",
                    isCollapsed && !isMobile ? "justify-center px-4 py-3" : "justify-between px-6 py-3",
                    currentView.startsWith('performance') || currentView === item.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "flex items-center",
                    !isCollapsed || isMobile ? "space-x-3" : ""
                  )}>
                    <item.icon className={cn("flex-shrink-0", isCollapsed && !isMobile ? "w-6 h-6" : "w-5 h-5")} />
                    {(!isCollapsed || isMobile) && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                  {(!isCollapsed || isMobile) && (
                    performanceExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {performanceExpanded && (!isCollapsed || isMobile) && item.submenu && (
                  <div className="bg-slate-800/50">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        onClick={() => setCurrentView(subitem.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 pl-14 pr-6 py-2.5 transition-colors",
                          currentView === subitem.id
                            ? "text-cyan-400 bg-slate-900"
                            : "text-slate-400 hover:text-white hover:bg-slate-900"
                        )}
                      >
                        <subitem.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{subitem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={cn(
        "border-t border-slate-800 p-4 space-y-3",
        isCollapsed && !isMobile && "items-center"
      )}>
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.role === 'admin' ? 'Administrator' : 'ASN'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTheme('light')}
                className={cn(
                  "text-slate-400 hover:text-white",
                  theme === 'light' && "text-yellow-400"
                )}
                title="Light Mode"
              >
                <Sun className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTheme('dark')}
                className={cn(
                  "text-slate-400 hover:text-white",
                  theme === 'dark' && "text-blue-400"
                )}
                title="Dark Mode"
              >
                <Moon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTheme('system')}
                className={cn(
                  "text-slate-400 hover:text-white",
                  theme === 'system' && "text-purple-400"
                )}
                title="System Mode"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Button>
            </div>
          </div>
        )}

        {(isCollapsed && !isMobile) && (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const themes = ['light', 'dark', 'system'];
                const currentIndex = themes.indexOf(theme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                toggleTheme(nextTheme);
              }}
              className="text-slate-400 hover:text-white"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Sun className="w-4 h-4" /> : 
               theme === 'dark' ? <Moon className="w-4 h-4" /> :
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
              }
            </Button>
          </div>
        )}

        {(!isCollapsed || isMobile) && (
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        )}

        {(isCollapsed && !isMobile) && (
          <Button
            onClick={onLogout}
            variant="ghost"
            size="icon"
            title="Logout"
            className="w-full text-slate-400 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Copyright */}
      {(!isCollapsed || isMobile) && (
        <div className="px-4 py-2 text-center border-t border-slate-800">
          <p className="text-xs text-slate-500">© 2024 - Proposal Hackathon BKN</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-[60] lg:hidden bg-slate-900/90 backdrop-blur text-white hover:bg-slate-800 shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-slate-900 z-[56] transform transition-transform duration-300 lg:hidden overflow-y-auto",
        isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-0"
      )}>
        <SidebarContent isMobile={true} />
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <SidebarContent />
        
        {/* Collapse Toggle Button - Inside Sidebar */}
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute top-4 z-20 flex items-center justify-center transition-all duration-300",
            "bg-slate-800 hover:bg-slate-700",
            "text-slate-400 hover:text-white",
            "rounded-lg border border-slate-700",
            "w-8 h-8",
            isCollapsed ? "right-4" : "right-4"
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </>
  );
}
