'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import CollapsibleSidebar from '@/components/CollapsibleSidebar';
import TalentManagement from '@/components/TalentManagement';
import PerformanceAssessment from '@/components/PerformanceAssessment';
import InputData from '@/components/InputData';
import { CheckCircle, Target, TrendingUp, BarChart3 } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  // Full Page Login (Landing + Login Combined)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 flex items-center justify-center p-4 md:p-0">
        <div className="w-full h-screen flex flex-col md:flex-row">
          {/* Left Side - Information */}
          <div className="flex-1 flex items-center justify-center p-8 md:p-16">
            <div className="max-w-xl w-full space-y-8">
              {/* Logo & Title */}
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                    Sistem AI untuk
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                    Manajemen ASN
                  </span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Platform terintegrasi untuk analisis talenta dan penilaian kinerja ASN berbasis Artificial Intelligence
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                      Analisis Talenta Komprehensif
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Pemetaan kompetensi dan potensi ASN menggunakan AI
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                      Penilaian Kinerja Real-time
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Evaluasi kinerja berbasis data dan rekomendasi AI
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                      Dashboard Analytics
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Visualisasi data dan insights untuk pengambilan keputusan
                    </p>
                  </div>
                </div>
              </div>

              {/* Partner Institutions */}
              <div className="pt-8 border-t border-slate-300 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 text-center">
                  Lembaga Partner
                </h3>
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="flex items-center justify-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/fx0bhszm_Logo_Setneg_RI.svg.png" 
                      alt="Sekretariat Negara RI" 
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/ambe7iyn_1554355505_Logo-LAN-Baru-Transparan.png" 
                      alt="Lembaga Administrasi Negara" 
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/ixe1euh2_Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg.png" 
                      alt="Badan Pusat Statistik" 
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm hover:shadow-md transition-shadow col-start-1">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/9m5rcvx3_Logo_PANRB.png" 
                      alt="Kementerian PANRB" 
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm hover:shadow-md transition-shadow col-start-2">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/qdsh946f_Logo_Badan_Kepegawaian_Negara.png" 
                      alt="Badan Kepegawaian Negara" 
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login */}
          <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  Selamat Datang
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Login ke sistem ASN Talent AI
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="username" className="text-slate-700 dark:text-slate-300 font-medium">
                    Email
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-2 h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    placeholder="asn@bkn.go.id"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-2 h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    placeholder="••••••••"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {loginLoading ? 'Memproses...' : 'Login'}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Demo Mode: Gunakan email dan password apapun untuk login
                </p>
              </div>
            </div>
          </div>
        </div>
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

        {/* Main Content with proper boundaries */}
        <div className="flex-1 overflow-auto lg:ml-0">
          {/* Content container with proper spacing from sidebar */}
          <div className="p-4 md:p-6">
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