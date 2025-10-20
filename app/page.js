'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import CollapsibleSidebar from '@/components/CollapsibleSidebar';
import LandingPage from '@/components/LandingPage';
import TalentManagement from '@/components/TalentManagement';
import PerformanceAssessment from '@/components/PerformanceAssessment';
import InputData from '@/components/InputData';
import { Moon, Sun } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [currentView, setCurrentView] = useState('input-data');
  const [theme, setTheme] = useState('dark');
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        setShowLanding(false);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setShowLanding(false);
        toast({
          title: 'Login Berhasil',
          description: `Selamat datang, ${data.user.name}!`,
        });
      } else {
        toast({
          title: 'Login Gagal',
          description: data.error || 'Username atau password salah',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat login',
        variant: 'destructive'
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setShowLanding(true);
    setUser(null);
    setCurrentView('input-data');
    toast({
      title: 'Logout Berhasil',
      description: 'Anda telah keluar dari sistem',
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast({
      title: 'Tema Diubah',
      description: `Tema ${newTheme === 'dark' ? 'gelap' : 'terang'} diaktifkan`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Landing Page
  if (showLanding && !isAuthenticated) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 md:p-8 bg-slate-900/50 backdrop-blur border-slate-700">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Selamat Datang</h1>
            <p className="text-slate-400">Login ke sistem ASN Talent AI</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-slate-300">Email</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-2 bg-slate-800/50 border-slate-700 text-white"
                placeholder="Masukkan email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 bg-slate-800/50 border-slate-700 text-white"
                placeholder="Masukkan password"
              />
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {loginLoading ? 'Memproses...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Demo Mode:</p>
            <p className="text-xs text-slate-300">Gunakan email dan password apapun untuk login</p>
          </div>
        </Card>
      </div>
    );
  }

  // Main App
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex min-h-screen bg-background">
        <CollapsibleSidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:ml-0">
            {currentView === 'input-data' && <InputData user={user} />}
            {(currentView === 'talent-management' || currentView.startsWith('talent-') || currentView.startsWith('analysis-') || currentView.startsWith('job-') || currentView.startsWith('skill-') || currentView.startsWith('development-')) && (
              <TalentManagement user={user} currentView={currentView} />
            )}
            {(currentView === 'performance-assessment' || currentView.startsWith('performance-')) && (
              <PerformanceAssessment user={user} currentView={currentView} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}