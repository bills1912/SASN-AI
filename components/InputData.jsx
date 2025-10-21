'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button'  ;
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Link as LinkIcon, Loader2, Target, Code2, TrendingUp } from 'lucide-react';

export default function InputDataNew({ user, selectedProfile: globalSelectedProfile, setSelectedProfile: setGlobalSelectedProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(globalSelectedProfile);
  const [loading, setLoading] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [uploadingCert, setUploadingCert] = useState(false);
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
        
        // If individual user, filter only their profile
        if (!isAdmin && userNIP) {
          const userProfile = data.profiles.find(p => p.nip === userNIP);
          setProfiles(userProfile ? [userProfile] : []);
          setSelectedProfile(userProfile || null);
          setGlobalSelectedProfile?.(userProfile || null);
        } else {
          // Admin sees all profiles
          setProfiles(data.profiles);
          if (data.profiles.length > 0) {
            setSelectedProfile(data.profiles[0]);
            setGlobalSelectedProfile?.(data.profiles[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
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
    console.log('Generating talent mapping for NIP:', selectedProfile.nip);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'exists' : 'missing');
      
      const response = await fetch('/api/talent/talent-mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nip: selectedProfile.nip })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        toast({
          title: 'Pemetaan Talenta Berhasil! ✓',
          description: 'Hasil dapat dilihat di menu Manajemen Talenta → Pemetaan Talenta',
          duration: 5000,
        });
      } else {
        throw new Error(data.error || 'Gagal generate talent mapping');
      }
    } catch (error) {
      console.error('Error generating talent mapping:', error);
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
    console.log('Generating skill analysis for NIP:', selectedProfile.nip);
    
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

      console.log('Skill analysis response status:', response.status);
      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Analisis Skill Berhasil! ✓',
          description: 'Hasil dapat dilihat di menu Manajemen Talenta → Analisis Skill',
          duration: 5000,
        });
      } else {
        throw new Error(data.error || 'Gagal generate skill analysis');
      }
    } catch (error) {
      console.error('Error generating skill analysis:', error);
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
    console.log('Generating performance analysis for NIP:', selectedProfile.nip);
    
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

      console.log('Performance analysis response status:', response.status);
      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Analisis Kinerja Berhasil! ✓',
          description: 'Hasil dapat dilihat di menu Penilaian Kinerja',
          duration: 5000,
        });
      } else {
        throw new Error(data.error || 'Gagal generate performance analysis');
      }
    } catch (error) {
      console.error('Error generating performance analysis:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePortfolio = async () => {
    if (!selectedProfile || !portfolioLink) {
      toast({
        title: 'Error',
        description: 'Pastikan pegawai dipilih dan link portfolio diisi',
        variant: 'destructive'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/update-portfolio', {
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
        toast({
          title: 'Portfolio Link Disimpan',
          description: 'Link portfolio berhasil ditambahkan ke profil',
        });
      } else {
        throw new Error(data.error || 'Gagal menyimpan link');
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedProfile) return;

    setUploadingCert(true);

    try {
      const uploadedFiles = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'File Terlalu Besar',
            description: `${file.name} melebihi 5MB`,
            variant: 'destructive'
          });
          continue;
        }

        // Convert to base64
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        uploadedFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64
        });
      }

      // Send to backend
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/upload-certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nip: selectedProfile.nip,
          certifications: uploadedFiles
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCertifications([...certifications, ...uploadedFiles]);
        toast({
          title: 'Sertifikat Berhasil Diunggah',
          description: `${uploadedFiles.length} file berhasil ditambahkan`,
        });
        // Clear file input
        event.target.value = '';
      } else {
        throw new Error(data.error || 'Gagal upload sertifikat');
      }
    } catch (error) {
      console.error('Error uploading certifications:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUploadingCert(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Input Data & Analisis ASN</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Pilih pegawai dari daftar dan generate analisis talenta atau kinerja
        </p>
      </div>

      {/* Select Pegawai - Only for Admin */}
      <Card className="p-4 md:p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <Label className="text-base font-semibold">
                  {isAdmin ? 'Pilih Pegawai untuk Analisis' : 'Data Pegawai Anda'}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {isAdmin 
                    ? 'Data pegawai diambil dari API Instansi yang terintegrasi' 
                    : 'Informasi profil dan analisis pribadi Anda'
                  }
                </p>
              </div>
              {isAdmin && (
                <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <p className="text-xs font-medium text-blue-400">Admin</p>
                </div>
              )}
              {!isAdmin && (
                <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                  <p className="text-xs font-medium text-purple-400">Pegawai</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Dropdown for Admin, Display only for User */}
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

      {/* Portfolio & Certification Section */}
      {selectedProfile && (
        <Card className="p-4 md:p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Portfolio & Sertifikasi (Opsional)
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Data ini akan digunakan sebagai landasan tambahan dalam penilaian kinerja dan manajemen talenta
          </p>
          
          <div className="space-y-4">
            {/* Portfolio Link */}
            <div>
              <Label htmlFor="portfolioLink" className="text-sm font-medium mb-1.5">
                Link Portfolio
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="portfolioLink"
                    type="url"
                    placeholder="https://portfolio.example.com"
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tambahkan link ke portfolio online Anda (LinkedIn, GitHub, website pribadi, dll)
              </p>
            </div>

            {/* Certification Upload */}
            <div>
              <Label htmlFor="certifications" className="text-sm font-medium mb-1.5">
                Unggah Sertifikasi
              </Label>
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-slate-600 transition-colors cursor-pointer">
                <Input
                  id="certifications"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <label htmlFor="certifications" className="cursor-pointer">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Klik untuk unggah sertifikat
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, JPG, PNG (Maks 5MB per file)
                  </p>
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Unggah sertifikat pelatihan, kursus, atau penghargaan yang relevan
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Analysis Actions */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {/* Talent Mapping */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">Pemetaan Talenta</h3>
              <p className="text-xs text-muted-foreground">9-Box Grid Analysis</p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">
            Generate analisis pemetaan talenta dengan 9-box grid matrix
          </p>
          <Button
            onClick={generateTalentMapping}
            disabled={loading || !selectedProfile}
            className="w-full"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Generate Pemetaan
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Hasil: <span className="font-medium text-blue-500">Manajemen Talenta</span>
          </p>
        </Card>

        {/* Skill Analysis */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">Analisis Skill</h3>
              <p className="text-xs text-muted-foreground">Deep Skill Assessment</p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">
            Analisis mendalam technical & soft skills, identifikasi gaps
          </p>
          <Button
            onClick={generateSkillAnalysis}
            disabled={loading || !selectedProfile}
            className="w-full"
            variant="outline"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Code2 className="w-4 h-4 mr-2" />
                Generate Analisis
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Hasil: <span className="font-medium text-purple-500">Analisis Skill</span>
          </p>
        </Card>

        {/* Performance Analysis */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">Analisis Kinerja</h3>
              <p className="text-xs text-muted-foreground">Performance Assessment</p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">
            Analisis kinerja komprehensif dengan quadrant classification
          </p>
          <Button
            onClick={generatePerformanceAnalysis}
            disabled={loading || !selectedProfile}
            className="w-full"
            variant="outline"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate Analisis
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Hasil: <span className="font-medium text-cyan-500">Penilaian Kinerja</span>
          </p>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="p-4 md:p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Tentang Analisis AI</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-3">
              Sistem menggunakan AI (GPT-4o) untuk analisis mendalam. Data diambil dari API Instansi yang terintegrasi.
            </p>
            <div className="mt-3 p-3 bg-background/50 rounded-lg border border-border">
              <p className="text-xs font-medium text-foreground mb-1">Workflow:</p>
              <p className="text-xs text-muted-foreground">
                1. Pilih Pegawai → 2. Generate Analisis → 3. Lihat hasil di menu terkait
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
