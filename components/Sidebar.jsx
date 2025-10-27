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
  CheckCircle
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, user, onLogout, theme, toggleTheme }) {
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
      section: 'performance'
    }
  ];

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <img 
              src="https://customer-assets.emergentagent.com/job_text-spacing/artifacts/v42vd93c_2.png" 
              alt="MeritChain Logo" 
              className="w-full h-full object-contain"
              style={{
                filter: 'brightness(2.5) saturate(2) contrast(1.2) hue-rotate(-10deg)'
              }}
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<svg class="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MeritChain</h1>
            <p className="text-xs text-slate-400">AI Talent Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.section === 'main' && (
              <button
                onClick={() => setCurrentView(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors",
                  currentView === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )}

            {item.section === 'talent' && (
              <div>
                <button
                  onClick={() => {
                    setTalentExpanded(!talentExpanded);
                    setCurrentView(item.id);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-3 text-left transition-colors",
                    currentView.startsWith('talent') || currentView === item.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {talentExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {talentExpanded && item.submenu && (
                  <div className="bg-slate-800/50">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        onClick={() => setCurrentView(subitem.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 pl-14 pr-6 py-2.5 text-left transition-colors",
                          currentView === subitem.id
                            ? "text-blue-400 bg-slate-900"
                            : "text-slate-400 hover:text-white hover:bg-slate-900"
                        )}
                      >
                        <subitem.icon className="w-4 h-4" />
                        <span className="text-sm">{subitem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {item.section === 'performance' && (
              <button
                onClick={() => {
                  setPerformanceExpanded(!performanceExpanded);
                  setCurrentView(item.id);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-3 text-left transition-colors",
                  currentView === item.id
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {performanceExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4 space-y-3">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-400 hover:text-white"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Copyright */}
      <div className="px-4 py-2 text-center border-t border-slate-800">
        <p className="text-xs text-slate-500">© 2024 - Proposal Hackathon BKN</p>
      </div>
    </div>
  );
}