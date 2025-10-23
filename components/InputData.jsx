'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LinkIcon, Loader2, Target, Code2, TrendingUp, ExternalLink, FileText } from 'lucide-react';

export default function InputData({ user, selectedProfile: globalSelectedProfile, setSelectedProfile: setGlobalSelectedProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(globalSelectedProfile);
  const [loading, setLoading] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [extractingPortfolio, setExtractingPortfolio] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [inputMode, setInputMode] = useState('link'); // 'link' or 'file'
  const [uploadedFile, setUploadedFile] = useState(null);
  const { toast } = useToast();
  
  // Check if user is admin or individual
  const isAdmin = user?.role === 'admin';
  const userNIP = user?.nip;

  useEffect(() => {
    loadProfiles();
  }, []);

  // Sync with global selected profile
  useEffect(() => {
    if (globalSelectedProfile) {
      setSelectedProfile(globalSelectedProfile);
    }
  }, [globalSelectedProfile]);

  const loadProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/profiles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter based on role
        if (!isAdmin && userNIP) {
          const userProfile = data.profiles.find(p => p.nip === userNIP);
          setProfiles(userProfile ? [userProfile] : []);
          if (userProfile) {
            setSelectedProfile(userProfile);
            setGlobalSelectedProfile?.(userProfile);
          }
        } else {
          setProfiles(data.profiles);
          if (data.profiles.length > 0 && !selectedProfile) {
            setSelectedProfile(data.profiles[0]);
            setGlobalSelectedProfile?.(data.profiles[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const handleExtractPortfolio = async () => {
    if (!portfolioLink || !selectedProfile) {
      toast({
        title: 'Error',
        description: 'Pastikan pegawai dipilih dan link portfolio diisi',
        variant: 'destructive'
      });
      return;
    }

    setExtractingPortfolio(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/extract-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nip: selectedProfile.nip,
          portfolioLink: portfolioLink
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPortfolioData(data.extractedData);
        toast({
          title: 'Portfolio Berhasil Diekstrak! ✓',
          description: 'Data dari portfolio telah berhasil diambil dan akan digunakan dalam analisis',
          duration: 5000,
        });
      } else {
        throw new Error(data.error || 'Gagal ekstrak portfolio');
      }
    } catch (error) {
      console.error('Error extracting portfolio:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setExtractingPortfolio(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !selectedProfile) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Format File Tidak Didukung',
        description: 'Hanya file PDF, DOC, dan DOCX yang didukung',
        variant: 'destructive'
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Terlalu Besar',
        description: 'Ukuran maksimal file adalah 10MB',
        variant: 'destructive'
      });
      return;
    }

    setUploadedFile(file);
    setExtractingPortfolio(true);

    try {
      // Convert to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/extract-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nip: selectedProfile.nip,
          fileName: file.name,
          fileData: base64,
          fileType: file.type
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPortfolioData(data.extractedData);
        toast({
          title: 'Resume Berhasil Diekstrak! ✓',
          description: 'Data dari resume/CV telah berhasil diambil dan akan digunakan dalam analisis',
          duration: 5000,
        });
      } else {
        throw new Error(data.error || 'Gagal ekstrak resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      setUploadedFile(null);
    } finally {
      setExtractingPortfolio(false);
    }
  };

  const generateTalentMapping = async () => {
    if (!selectedProfile) {
      toast({
        title: 'Error',
        description: 'Pilih pegawai terlebih dahulu',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/talent-mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nip: selectedProfile.nip })
      });

      if (response.ok) {
        toast({
          title: 'Pemetaan Talenta Berhasil',
          description: 'Hasil dapat dilihat di menu Manajemen Talenta → Pemetaan Talenta',
        });
      } else {
        throw new Error('Gagal generate talent mapping');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSkillAnalysis = async () => {
    if (!selectedProfile) {
      toast({
        title: 'Error',
        description: 'Pilih pegawai terlebih dahulu',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/skill-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nip: selectedProfile.nip })
      });

      if (response.ok) {
        toast({
          title: 'Analisis Skill Berhasil',
          description: 'Hasil dapat dilihat di menu Manajemen Talenta → Analisis Skill',
        });
      } else {
        throw new Error('Gagal generate skill analysis');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePerformanceAnalysis = async () => {
    if (!selectedProfile) {
      toast({
        title: 'Error',
        description: 'Pilih pegawai terlebih dahulu',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/performance/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nip: selectedProfile.nip })
      });

      if (response.ok) {
        toast({
          title: 'Analisis Kinerja Berhasil',
          description: 'Hasil dapat dilihat di menu Penilaian Kinerja',
        });
      } else {
        throw new Error('Gagal generate performance analysis');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Input Data & Analisis ASN</h1>
        <p className="text-muted-foreground">
          Pilih pegawai dan generate analisis talenta atau kinerja. Hasil analisis dapat dilihat di menu masing-masing.
        </p>
      </div>

      {/* Select ASN */}
      <Card className="p-4 md:p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Pilih Pegawai untuk Analisis</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Pilih pegawai yang akan dianalisis
            </p>
          </div>
          
          {isAdmin ? (
            <Select 
              value={selectedProfile?.nip} 
              onValueChange={(nip) => {
                const profile = profiles.find(p => p.nip === nip);
                setSelectedProfile(profile);
                setGlobalSelectedProfile?.(profile);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Pegawai" />
              </SelectTrigger>
              <SelectContent className="max-w-[calc(100vw-2rem)]">
                {profiles.map(profile => (
                  <SelectItem key={profile.nip} value={profile.nip}>
                    <div className="flex items-center w-full">
                      <span className="font-medium truncate">{profile.name}</span>
                      <span className="hidden md:inline text-xs text-muted-foreground ml-auto pl-3">{profile.position}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            selectedProfile && (
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                    {selectedProfile.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">{selectedProfile.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedProfile.position}</p>
                  </div>
                </div>
              </div>
            )
          )}

          {selectedProfile && (
            <Card className="p-4 bg-muted/50 border-muted">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">NIP</p>
                  <p className="font-medium">{selectedProfile.nip}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Jabatan</p>
                  <p className="font-medium">{selectedProfile.position}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Instansi</p>
                  <p className="font-medium">{selectedProfile.agency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Grade</p>
                  <p className="font-medium">{selectedProfile.grade}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* Portfolio Section */}
      {selectedProfile && (
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Portfolio & Resume (Opsional)
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tambahkan link atau upload resume untuk ekstraksi data otomatis
              </p>
            </div>
            
            {/* Mode Switch */}
            <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setInputMode('link')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  inputMode === 'link'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LinkIcon className="w-4 h-4 inline mr-1" />
                Link
              </button>
              <button
                onClick={() => setInputMode('file')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  inputMode === 'file'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1" />
                Upload
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {inputMode === 'link' ? (
              // Link Input Mode
              <>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="url"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      placeholder="https://linkedin.com/in/username atau https://github.com/username"
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={handleExtractPortfolio}
                    disabled={!portfolioLink || extractingPortfolio}
                    className="whitespace-nowrap"
                  >
                    {extractingPortfolio ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Ekstrak...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ekstrak Data
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mendukung: LinkedIn, GitHub, portfolio pribadi, atau profil profesional lainnya
                </p>
              </>
            ) : (
              // File Upload Mode
              <>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={extractingPortfolio}
                    className="hidden"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {extractingPortfolio ? (
                      <>
                        <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 animate-spin" />
                        <p className="text-sm font-medium text-foreground mb-1">
                          Mengekstrak data...
                        </p>
                      </>
                    ) : uploadedFile ? (
                      <>
                        <FileText className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className="text-sm font-medium text-foreground mb-1">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB - Klik untuk ganti file
                        </p>
                      </>
                    ) : (
                      <>
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm font-medium text-foreground mb-1">
                          Klik untuk upload Resume/CV
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOC, DOCX (Maks 10MB)
                        </p>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload resume/CV Anda dalam format PDF atau Word untuk ekstraksi otomatis
                </p>
              </>
            )}
            
            {/* Portfolio Data Preview */}
            {portfolioData && (
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground mb-1">Data Portfolio Berhasil Diekstrak</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Data telah disimpan dan akan digunakan dalam analisis talenta & kinerja
                    </p>
                    {portfolioData.summary && (
                      <p className="text-xs text-foreground italic">"{portfolioData.summary}"</p>
                    )}
                    {portfolioData.skills && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {portfolioData.skills.technical?.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Card>
      )}

      {/* Analysis Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Talent Mapping */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Pemetaan Talenta</h3>
              <p className="text-xs text-muted-foreground">9-Box Grid Analysis</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Generate analisis pemetaan talenta dengan 9-box grid matrix, mencakup performance vs potential analysis.
          </p>
          <Button
            onClick={generateTalentMapping}
            disabled={loading || !selectedProfile}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Generate Pemetaan Talenta
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Hasil di: <span className="font-medium text-blue-500">Manajemen Talenta → Pemetaan Talenta</span>
          </p>
        </Card>

        {/* Skill Analysis */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Analisis Skill</h3>
              <p className="text-xs text-muted-foreground">Deep Skill Assessment</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Generate analisis mendalam terhadap technical & soft skills, identifikasi skill gaps dan emerging skills.
          </p>
          <Button
            onClick={generateSkillAnalysis}
            disabled={loading || !selectedProfile}
            className="w-full"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Code2 className="w-4 h-4 mr-2" />
                Generate Analisis Skill
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Hasil di: <span className="font-medium text-purple-500">Manajemen Talenta → Analisis Skill</span>
          </p>
        </Card>

        {/* Performance Analysis */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Analisis Kinerja</h3>
              <p className="text-xs text-muted-foreground">Performance Assessment</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Generate analisis kinerja komprehensif dengan quadrant classification dan development recommendations.
          </p>
          <Button
            onClick={generatePerformanceAnalysis}
            disabled={loading || !selectedProfile}
            className="w-full"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate Analisis Kinerja
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Hasil di: <span className="font-medium text-cyan-500">Penilaian Kinerja</span>
          </p>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Tentang Analisis AI</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Sistem ini menggunakan AI (GPT-4o) untuk menganalisis data ASN secara mendalam. Setiap analisis akan:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Mengekstrak dan menganalisis kompetensi, skill, dan prestasi</li>
              <li>• Memberikan penilaian objektif berdasarkan data komprehensif</li>
              <li>• Menghasilkan rekomendasi pengembangan yang actionable</li>
              <li>• Menyimpan hasil untuk dapat dilihat di menu terkait</li>
            </ul>
            <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border">
              <p className="text-xs font-medium text-foreground mb-1">Workflow:</p>
              <p className="text-xs text-muted-foreground">
                1. Pilih ASN → 2. Generate Analisis → 3. Lihat hasil di menu Manajemen Talenta atau Penilaian Kinerja
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
