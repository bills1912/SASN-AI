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
import InputData from '@/components/InputData';
import SystemInfo from '@/components/SystemInfo';
import SystemOverview from '@/components/SystemOverview';
import TechnicalDocumentation from '@/components/TechnicalDocumentation';
import MeritSystemIndex from '@/components/MeritSystemIndex';
import MeritSystemBlockchain from '@/components/MeritSystemBlockchain';
import InstitutionTalentAnalysis from '@/components/InstitutionTalentAnalysis';
import KepalaInstansiDashboard from '@/components/KepalaInstansiDashboard';
import { CheckCircle, Target, TrendingUp, BarChart3, Eye, EyeOff, RefreshCw, Sun, Moon, Monitor } from 'lucide-react';

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
  const [currentView, setCurrentView] = useState('');
  const [theme, setTheme] = useState('system'); // default to system
  const [selectedProfile, setSelectedProfile] = useState(null); // Global selected profile
  const { toast } = useToast();

  // Set default view based on user role
  useEffect(() => {
    if (user) {
      if (user.role === 'kepala_instansi') {
        setCurrentView('kepala-dashboard');
      } else if (user.role === 'admin') {
        setCurrentView('institution-talent-analysis');
      } else if (user.role === 'asn' && !currentView) {
        setCurrentView('input-data');
      }
    }
  }, [user]);

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

    // Load theme preference and apply
    const savedTheme = localStorage.getItem('theme') || 'system'; // Default to system instead of light
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Apply theme based on preference
  const applyTheme = (themeMode) => {
    if (themeMode === 'system') {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('System prefers dark mode:', systemPrefersDark);
      
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    console.log('Theme applied:', themeMode, 'Dark mode active:', document.documentElement.classList.contains('dark'));
  };

  // Toggle theme
  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    console.log('Toggling theme from', theme, 'to', nextTheme);
    
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    // Apply theme immediately
    setTimeout(() => {
      applyTheme(nextTheme);
    }, 0);
    
    toast({
      title: 'Theme Changed',
      description: `Theme set to ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} mode`,
      duration: 2000
    });
  };

  // Watch theme changes and apply
  useEffect(() => {
    console.log('=== Theme effect triggered ===');
    console.log('Current theme:', theme);
    console.log('System prefers dark:', window.matchMedia('(prefers-color-scheme: dark)').matches);
    console.log('Document has dark class before:', document.documentElement.classList.contains('dark'));
    
    applyTheme(theme);
    
    console.log('Document has dark class after:', document.documentElement.classList.contains('dark'));
    console.log('=== Theme effect complete ===');
  }, [theme]);

  // Listen to system theme changes when in system mode
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

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
        
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('savedEmail', username);
          localStorage.setItem('savedPassword', password);
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }
        
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
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedPassword');
    }
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('');
    // Reset form
    if (!rememberMe) {
      setUsername('');
      setPassword('');
      setRememberMe(false);
    }
    // Always generate new captcha on logout
    generateCaptcha();
    toast({
      title: 'Logout Berhasil',
      description: 'Anda telah keluar dari sistem',
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
      <div className={`min-h-screen flex items-center justify-center p-0 ${theme === 'dark' ? 'bg-[#0f1d3d]' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'}`}>
        <div className="w-full min-h-screen flex flex-col md:flex-row">
          {/* Left Side - Information (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 items-center justify-center p-8 md:p-12">
            <div className="max-w-lg w-full space-y-6">
              {/* Title (Logo removed as requested) */}
              <div className="flex flex-col items-start">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  <span className={`text-transparent bg-clip-text ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-gradient-to-r from-blue-600 to-cyan-600'}`}>
                    Sistem AI untuk
                  </span>
                  <br />
                  <span className={`text-transparent bg-clip-text ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-gradient-to-r from-blue-600 to-cyan-600'}`}>
                    Manajemen ASN
                  </span>
                </h1>
                <p className={theme === 'dark' ? 'text-base text-slate-300' : 'text-base text-slate-700'}>
                  Platform terintegrasi untuk analisis talenta dan penilaian kinerja ASN berbasis Artificial Intelligence
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className={theme === 'dark' ? 'w-5 h-5 text-purple-400' : 'w-5 h-5 text-blue-600'} />
                  </div>
                  <div>
                    <h3 className={theme === 'dark' ? 'font-semibold text-white text-sm mb-0.5' : 'font-semibold text-slate-900 text-sm mb-0.5'}>
                      Analisis Talenta Komprehensif
                    </h3>
                    <p className={theme === 'dark' ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>
                      Pemetaan kompetensi dan potensi ASN menggunakan AI
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className={theme === 'dark' ? 'w-5 h-5 text-purple-400' : 'w-5 h-5 text-blue-600'} />
                  </div>
                  <div>
                    <h3 className={theme === 'dark' ? 'font-semibold text-white text-sm mb-0.5' : 'font-semibold text-slate-900 text-sm mb-0.5'}>
                      Penilaian Kinerja Real-time
                    </h3>
                    <p className={theme === 'dark' ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>
                      Evaluasi kinerja berbasis data dan rekomendasi AI
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className={theme === 'dark' ? 'w-5 h-5 text-purple-400' : 'w-5 h-5 text-blue-600'} />
                  </div>
                  <div>
                    <h3 className={theme === 'dark' ? 'font-semibold text-white text-sm mb-0.5' : 'font-semibold text-slate-900 text-sm mb-0.5'}>
                      Dashboard Analytics
                    </h3>
                    <p className={theme === 'dark' ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>
                      Visualisasi data dan insights untuk pengambilan keputusan
                    </p>
                  </div>
                </div>
              </div>

              {/* Partner Institutions */}
              <div className={`pt-6 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-sm font-semibold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Lembaga Partner
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/fx0bhszm_Logo_Setneg_RI.svg.png" 
                      alt="Sekretariat Negara RI" 
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/ambe7iyn_1554355505_Logo-LAN-Baru-Transparan.png" 
                      alt="Lembaga Administrasi Negara" 
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/ixe1euh2_Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg.png" 
                      alt="Badan Pusat Statistik" 
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/9m5rcvx3_Logo_PANRB.png" 
                      alt="Kementerian PANRB" 
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/qdsh946f_Logo_Badan_Kepegawaian_Negara.png" 
                      alt="Badan Kepegawaian Negara" 
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login (Full screen on mobile) */}
          <div className="flex-1 flex items-center justify-center p-6 md:p-12 min-h-screen relative">
            {/* Theme Switcher - Top Right */}
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className={`absolute top-6 right-6 z-10 ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              }`}
              title={`Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)} mode`}
            >
              {theme === 'light' && <Sun className="w-5 h-5" />}
              {theme === 'dark' && <Moon className="w-5 h-5" />}
              {theme === 'system' && <Monitor className="w-5 h-5" />}
            </Button>

            <div className="w-full max-w-md space-y-6">
              {!showForgotPassword ? (
                <>
                  {/* Mobile Header */}
                  <div className="text-center md:hidden mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        MeritChain
                      </span>
                    </h1>
                    <p className="text-xs text-slate-400">
                      Sistem Manajemen ASN
                    </p>
                  </div>

                  {/* Login Header with Logo */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
                      <img 
                        src="https://customer-assets.emergentagent.com/job_text-spacing/artifacts/v42vd93c_2.png" 
                        alt="MeritChain Logo" 
                        className="w-full h-full object-contain"
                        style={{
                          filter: theme === 'dark' 
                            ? 'brightness(2.5) saturate(2) contrast(1.2) hue-rotate(-10deg)'
                            : 'brightness(1) saturate(1.5) contrast(1.1)'
                        }}
                        onError={(e) => {
                          // Fallback to gradient icon
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          parent.className = 'inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4';
                          parent.innerHTML = '<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
                        }}
                      />
                    </div>
                    <h2 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Selamat Datang
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Login ke sistem ASN Talent AI
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="username" className={`font-medium text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Email/Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={`mt-1.5 h-11 ${
                          theme === 'dark' 
                            ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
                        placeholder="asn@bkn.go.id"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" className={`font-medium text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Password
                      </Label>
                      <div className="relative mt-1.5">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className={`h-11 pr-10 ${
                            theme === 'dark'
                              ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500'
                              : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                            theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                          }`}
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
                      <Label className={`font-medium text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Captcha
                      </Label>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className={`flex-1 h-11 border rounded-md flex items-center justify-center font-mono text-lg font-bold tracking-widest select-none ${
                          theme === 'dark'
                            ? 'bg-slate-800 border-slate-700 text-white'
                            : 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-900'
                        }`} style={{
                          letterSpacing: '0.3em',
                          textShadow: theme === 'dark' ? '2px 2px 4px rgba(0,0,0,0.3)' : '1px 1px 2px rgba(0,0,0,0.1)'
                        }}>
                          {captchaText}
                        </div>
                        <Button
                          type="button"
                          onClick={generateCaptcha}
                          variant="outline"
                          className={`h-11 px-3 ${
                            theme === 'dark'
                              ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                              : 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        required
                        className={`mt-2 h-11 ${
                          theme === 'dark'
                            ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
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
                          className={theme === 'dark' ? 'border-slate-600' : 'border-slate-400'}
                        />
                        <label
                          htmlFor="remember"
                          className={`text-sm cursor-pointer ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
                        >
                          Ingat saya
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
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
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
                      Demo Mode: Gunakan username: admin, password: admin123
                    </p>
                  </div>

                  {/* Mobile Partner Logos */}
                  <div className={`md:hidden pt-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-xs text-center mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Lembaga Partner</p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <div className="p-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20">
                        <img 
                          src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/fx0bhszm_Logo_Setneg_RI.svg.png" 
                          alt="Setneg" 
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                      <div className="p-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20">
                        <img 
                          src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/ambe7iyn_1554355505_Logo-LAN-Baru-Transparan.png" 
                          alt="LAN" 
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                      <div className="p-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20">
                        <img 
                          src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/ixe1euh2_Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg.png" 
                          alt="BPS" 
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                      <div className="p-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20">
                        <img 
                          src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/9m5rcvx3_Logo_PANRB.png" 
                          alt="PANRB" 
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                      <div className="p-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20">
                        <img 
                          src="https://customer-assets.emergentagent.com/job_3fe8df70-7265-4c86-97fd-875d5fa187eb/artifacts/qdsh946f_Logo_Badan_Kepegawaian_Negara.png" 
                          alt="BKN" 
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <h2 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Lupa Password
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Masukkan email Anda untuk reset password
                    </p>
                  </div>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="resetEmail" className={`font-medium text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Email
                      </Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        className={`mt-1.5 h-11 ${
                          theme === 'dark'
                            ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
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
                      className={`w-full text-sm text-center ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
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
    <div className={`h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen bg-background">
        <CollapsibleSidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Main Content with proper boundaries and scrollable */}
        <div className="flex-1 h-screen overflow-y-auto w-full">
          {/* Content container with proper spacing from sidebar and mobile menu button */}
          <div className="p-4 md:p-6 pt-16 lg:pt-6">
            {/* Kepala Instansi Dashboard */}
            {currentView === 'kepala-dashboard' && user?.role === 'kepala_instansi' && (
              <KepalaInstansiDashboard user={user} />
            )}
            
            {/* Admin & ASN Views */}
            {currentView === 'input-data' && (user?.role === 'admin' || user?.role === 'asn') && (
              <InputData 
                user={user} 
                selectedProfile={selectedProfile}
                setSelectedProfile={setSelectedProfile}
              />
            )}
            {(currentView === 'talent-management' || currentView.startsWith('talent-') || currentView.startsWith('analysis-') || currentView.startsWith('job-') || currentView.startsWith('skill-') || currentView.startsWith('development-')) && (user?.role === 'admin' || user?.role === 'asn') && (
              <TalentManagement 
                user={user} 
                currentView={currentView}
                selectedProfile={selectedProfile}
              />
            )}
            
            {/* Admin Only Views */}
            {currentView === 'institution-talent-analysis' && user?.role === 'admin' && (
              <InstitutionTalentAnalysis user={user} />
            )}
            {(currentView === 'merit-system-index' || currentView.startsWith('merit-')) && user?.role === 'admin' && (
              <MeritSystemIndex 
                user={user} 
                currentView={currentView}
              />
            )}
            {currentView === 'system-info' && <SystemInfo />}
            {currentView === 'system-overview' && <SystemOverview />}
            {currentView === 'technical-docs' && <TechnicalDocumentation />}
          </div>
        </div>
      </div>
    </div>
  );
}