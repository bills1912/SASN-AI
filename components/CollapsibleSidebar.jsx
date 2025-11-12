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
  FileBarChart,
  Database,
  Cpu,
  BookOpen,
  Shield,
  Building2
} from 'lucide-react';

export default function CollapsibleSidebar({ currentView, setCurrentView, user, onLogout, theme, toggleTheme }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [talentExpanded, setTalentExpanded] = useState(true);
  const [meritExpanded, setMeritExpanded] = useState(false);
  const [systemInfoExpanded, setSystemInfoExpanded] = useState(false);

  // ASN-only menus
  const asnMenuItems = [
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
        { id: 'career-path', label: 'Career Path', icon: TrendingUp },
        { id: 'job-recommendation', label: 'Rekomendasi Jabatan', icon: CheckCircle },
        { id: 'skill-analysis', label: 'Analisis Skill', icon: Code },
        { id: 'development-area', label: 'Area Pengembangan', icon: TargetIcon }
      ]
    }
  ];

  // Add role-specific menus
  let allMenuItems = [];
  
  if (user?.role === 'admin') {
    allMenuItems = [
      {
        id: 'institution-talent-analysis',
        label: 'Analisis Talenta Institusi',
        icon: Building2,
        section: 'admin'
      },
      {
        id: 'merit-system-index',
        label: 'Merit System Index',
        icon: Database,
        section: 'admin',
        submenu: [
          { id: 'merit-dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'merit-institutions', label: 'Analisis Institusi', icon: ChartBar },
          { id: 'merit-comparison', label: 'Perbandingan', icon: TrendingUp }
        ]
      },
      {
        id: 'system-info',
        label: 'System Info',
        icon: Cpu,
        section: 'admin',
        submenu: [
          { id: 'system-overview', label: 'System Overview', icon: Activity },
          { id: 'technical-docs', label: 'Technical Documentation', icon: FileBarChart }
        ]
      }
    ];
  } else if (user?.role === 'kepala_instansi') {
    allMenuItems = [
      {
        id: 'kepala-dashboard',
        label: 'Dashboard Kepala Instansi',
        icon: Building2,
        section: 'main'
      }
    ];
  } else if (user?.role === 'asn') {
    allMenuItems = asnMenuItems;
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div className={cn(
      "flex flex-col h-full",
      isMobile ? "w-full" : ""
    )}>
      {/* Header */}
      <div className={cn(
        "border-b border-sidebar-border transition-all duration-300",
        isCollapsed && !isMobile ? "p-4" : "p-6"
      )}>
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <img 
                  src="https://customer-assets.emergentagent.com/job_text-spacing/artifacts/v42vd93c_2.png" 
                  alt="MeritChain Logo" 
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'brightness(2.5) saturate(2) contrast(1.2) hue-rotate(-10deg)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<svg class="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
                  }}
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground leading-tight">MeritChain</h1>
                <p className="text-xs text-muted-foreground">AI Talent Management</p>
              </div>
            </div>
          )}
          
          {isCollapsed && !isMobile && (
            <div className="relative w-10 h-10 flex-shrink-0 mx-auto">
              <img 
                src="https://customer-assets.emergentagent.com/job_text-spacing/artifacts/v42vd93c_2.png" 
                alt="MeritChain Logo" 
                className="w-full h-full object-contain"
                style={{
                  filter: 'brightness(2.5) saturate(2) contrast(1.2) hue-rotate(-10deg)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<svg class="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
                }}
              />
            </div>
          )}
          
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
              className="text-muted-foreground hover:text-sidebar-accent-foreground lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {allMenuItems.map((item) => (
          <div key={item.id}>
            {item.section === 'main' && (
              <button
                onClick={() => {
                  setCurrentView(item.id);
                  // Auto close mobile sidebar
                  if (isMobile) {
                    setIsMobileOpen(false);
                  }
                }}
                title={isCollapsed ? item.label : ''}
                className={cn(
                  "w-full flex items-center transition-colors",
                  isCollapsed && !isMobile ? "justify-center px-4 py-3" : "space-x-3 px-6 py-3",
                  currentView === item.id
                    ? "bg-cyan-600 dark:bg-cyan-600 text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
                      ? "bg-sidebar-accent text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
                  <div className="bg-sidebar-accent/50">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        onClick={() => {
                          setCurrentView(subitem.id);
                          // Auto close mobile sidebar
                          if (isMobile) {
                            setIsMobileOpen(false);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center space-x-3 pl-14 pr-6 py-2.5 transition-colors",
                          currentView === subitem.id
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-900"
                            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-sidebar-accent/80"
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

            {item.section === 'admin' && item.submenu && (
              <div>
                <button
                  onClick={() => {
                    if (isCollapsed && !isMobile) {
                      setIsCollapsed(false);
                    }
                    // Toggle appropriate state based on menu item
                    if (item.id === 'merit-system-index') {
                      setMeritExpanded(!meritExpanded);
                    } else if (item.id === 'system-info') {
                      setSystemInfoExpanded(!systemInfoExpanded);
                    }
                    setCurrentView(item.id);
                  }}
                  title={isCollapsed ? item.label : ''}
                  className={cn(
                    "w-full flex items-center transition-colors border-t border-border",
                    isCollapsed && !isMobile ? "justify-center px-4 py-3" : "justify-between px-6 py-3",
                    (item.id === 'merit-system-index' && currentView.startsWith('merit')) ||
                    (item.id === 'system-info' && (currentView.startsWith('system') || currentView.startsWith('technical'))) ||
                    currentView === item.id
                      ? item.id === 'merit-system-index' 
                        ? "bg-purple-600 text-white"
                        : "bg-blue-600 text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
                    (item.id === 'merit-system-index' ? meritExpanded : systemInfoExpanded) 
                      ? <ChevronUp className="w-4 h-4" /> 
                      : <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {((item.id === 'merit-system-index' && meritExpanded) || 
                  (item.id === 'system-info' && systemInfoExpanded)) && 
                  (!isCollapsed || isMobile) && item.submenu && (
                  <div className="bg-sidebar-accent/50">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        onClick={() => {
                          setCurrentView(subitem.id);
                          // Auto close mobile sidebar
                          if (isMobile) {
                            setIsMobileOpen(false);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center space-x-3 pl-14 pr-6 py-2.5 transition-colors",
                          currentView === subitem.id
                            ? item.id === 'merit-system-index'
                              ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-slate-900"
                              : "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-900"
                            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-sidebar-accent/80"
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

            {item.section === 'admin' && !item.submenu && (
              <button
                onClick={() => {
                  setCurrentView(item.id);
                  // Auto close mobile sidebar
                  if (isMobile) {
                    setIsMobileOpen(false);
                  }
                }}
                title={isCollapsed ? item.label : ''}
                className={cn(
                  "w-full flex items-center transition-colors border-t border-border",
                  isCollapsed && !isMobile ? "justify-center px-4 py-3" : "space-x-3 px-6 py-3",
                  currentView === item.id
                    ? "bg-purple-600 text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("flex-shrink-0", isCollapsed && !isMobile ? "w-6 h-6" : "w-5 h-5")} />
                {(!isCollapsed || isMobile) && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={cn(
        "border-t border-border p-4 space-y-3",
        isCollapsed && !isMobile && "items-center"
      )}>
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs font-medium text-sidebar-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role === 'admin' ? 'Administrator' : 'ASN'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTheme('light')}
                className={cn(
                  "text-muted-foreground hover:text-sidebar-accent-foreground",
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
                  "text-muted-foreground hover:text-sidebar-accent-foreground",
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
                  "text-muted-foreground hover:text-sidebar-accent-foreground",
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
              className="text-muted-foreground hover:text-sidebar-accent-foreground"
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
            className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
            className="w-full text-muted-foreground hover:text-sidebar-accent-foreground"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Copyright */}
      {(!isCollapsed || isMobile) && (
        <div className="px-4 py-2 text-center border-t border-border">
          <p className="text-xs text-muted-foreground">© 2024 - Proposal Hackathon BKN</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button - Only show when sidebar is closed */}
      {!isMobileOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 right-4 z-[60] lg:hidden bg-sidebar/90 backdrop-blur text-sidebar-foreground hover:bg-sidebar-accent shadow-lg border border-sidebar-border"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-sidebar z-[56] transform transition-transform duration-300 lg:hidden overflow-y-auto",
        isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-0"
      )}>
        <SidebarContent isMobile={true} />
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <SidebarContent />
      </div>

      {/* Collapse Toggle Button - Outside sidebar, on the right edge */}
      <Button
        variant="ghost"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "hidden lg:flex absolute z-20 items-center justify-center transition-all duration-300",
          "bg-sidebar-accent hover:bg-slate-700",
          "text-muted-foreground hover:text-sidebar-accent-foreground",
          "rounded-lg border border-sidebar-border",
          "w-8 h-8",
          "top-4",
          isCollapsed ? "left-[84px]" : "left-[292px]"
        )}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </Button>
    </>
  );
}
