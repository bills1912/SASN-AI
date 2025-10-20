'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import CollapsibleSidebar from '@/components/CollapsibleSidebar';
import TalentManagement from '@/components/TalentManagement';
import PerformanceAssessment from '@/components/PerformanceAssessment';
import InputData from '@/components/InputData';
import { CheckCircle, Target, TrendingUp, BarChart3, Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [currentView, setCurrentView] = useState('input-data');
  const [theme, setTheme] = useState('dark');
  const { toast } = useToast();

  // Generate captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);
    setCaptchaInput('');
  };

  useEffect(() => {
    // Generate initial captcha
    generateCaptcha();
    
    // Check for existing token or remember me
    const token = localStorage.getItem('token');
    const remembered = localStorage.getItem('rememberMe');
    
    if (token && remembered === 'true') {
      verifyToken(token);
    } else if (!remembered) {
      localStorage.removeItem('token');
      setLoading(false);
    } else {
      setLoading(false);
    }

    // Load saved credentials if remember me is enabled
    if (remembered === 'true') {
      const savedEmail = localStorage.getItem('savedEmail');
      const savedPassword = localStorage.getItem('savedPassword');
      if (savedEmail) setUsername(savedEmail);
      if (savedPassword) setPassword(savedPassword);
      setRememberMe(true);
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Generate new captcha whenever user comes to login page
  useEffect(() => {
    if (!isAuthenticated) {
      generateCaptcha();
    }
  }, [isAuthenticated]);

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
    
    // Validate captcha
    if (captchaInput !== captchaText) {
      toast({
        title: 'Captcha Salah',
        description: 'Silakan masukkan captcha dengan benar',
        variant: 'destructive'
      });
      generateCaptcha();
      return;
    }
    
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
        localStorage.setItem('rememberMe', rememberMe.toString());
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
        generateCaptcha();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat login',
        variant: 'destructive'
      });
      generateCaptcha();
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    // Simulate password reset
    toast({
      title: 'Email Terkirim',
      description: `Link reset password telah dikirim ke ${resetEmail}`,
    });
    
    setShowForgotPassword(false);
    setResetEmail('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (!rememberMe) {
      localStorage.removeItem('rememberMe');
    }
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
      <div className="min-h-screen bg-[#0f1d3d] flex items-center justify-center p-4 md:p-0">
        <div className="w-full h-screen flex flex-col md:flex-row">
          {/* Left Side - Information */}
          <div className="flex-1 flex items-center justify-center p-8 md:p-12">
            <div className="max-w-lg w-full space-y-6">
              {/* Logo & Title */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    Sistem AI untuk
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    Manajemen ASN
                  </span>
                </h1>
                <p className="text-base text-slate-300">
                  Platform terintegrasi untuk analisis talenta dan penilaian kinerja ASN berbasis Artificial Intelligence
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-0.5">
                      Analisis Talenta Komprehensif
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pemetaan kompetensi dan potensi ASN menggunakan AI
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-0.5">
                      Penilaian Kinerja Real-time
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evaluasi kinerja berbasis data dan rekomendasi AI
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-0.5">
                      Dashboard Analytics
                    </h3>
                    <p className="text-xs text-slate-400">
                      Visualisasi data dan insights untuk pengambilan keputusan
                    </p>
                  </div>
                </div>
              </div>

              {/* Partner Institutions */}
              <div className="pt-6 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-white mb-4 text-center">
                  Lembaga Partner
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/fx0bhszm_Logo_Setneg_RI.svg.png" 
                    alt="Sekretariat Negara RI" 
                    className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <img 
                    src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/ambe7iyn_1554355505_Logo-LAN-Baru-Transparan.png" 
                    alt="Lembaga Administrasi Negara" 
                    className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <img 
                    src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/ixe1euh2_Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg.png" 
                    alt="Badan Pusat Statistik" 
                    className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <img 
                    src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/9m5rcvx3_Logo_PANRB.png" 
                    alt="Kementerian PANRB" 
                    className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <img 
                    src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/qdsh946f_Logo_Badan_Kepegawaian_Negara.png" 
                    alt="Badan Kepegawaian Negara" 
                    className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login */}
          <div className="flex-1 flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-md space-y-6">
              {!showForgotPassword ? (
                <>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Selamat Datang
                    </h2>
                    <p className="text-sm text-slate-400">
                      Login ke sistem ASN Talent AI
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-slate-300 font-medium text-sm">
                        Email
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1.5 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        placeholder="asn@bkn.go.id"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-slate-300 font-medium text-sm">
                        Password
                      </Label>
                      <div className="relative mt-1.5">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Captcha */}
                    <div>
                      <Label className="text-slate-300 font-medium text-sm">
                        Captcha
                      </Label>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-11 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center font-mono text-lg font-bold text-white tracking-widest select-none" style={{
                          letterSpacing: '0.3em',
                          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}>
                          {captchaText}
                        </div>
                        <Button
                          type="button"
                          onClick={generateCaptcha}
                          variant="outline"
                          className="h-11 px-3 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        required
                        className="mt-2 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        placeholder="Masukkan captcha"
                      />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={setRememberMe}
                          className="border-slate-600"
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm text-slate-400 cursor-pointer"
                        >
                          Ingat saya
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Lupa password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full h-11 text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 mt-6"
                    >
                      {loginLoading ? 'Memproses...' : 'Login'}
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-xs text-slate-500">
                      Demo Mode: Gunakan email dan password apapun untuk login
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Lupa Password
                    </h2>
                    <p className="text-sm text-slate-400">
                      Masukkan email Anda untuk reset password
                    </p>
                  </div>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="resetEmail" className="text-slate-300 font-medium text-sm">
                        Email
                      </Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        className="mt-1.5 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        placeholder="asn@bkn.go.id"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      Kirim Link Reset
                    </Button>

                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="w-full text-sm text-slate-400 hover:text-white text-center"
                    >
                      Kembali ke login
                    </button>
                  </form>
                </>
              )}
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