'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Link as LinkIcon, Loader2, Target, Code2, TrendingUp } from 'lucide-react';

export default function InputData({ user }) {
  const [documentContent, setDocumentContent] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [selectedNIP, setSelectedNIP] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

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
        setProfiles(data.profiles);
        if (data.profiles.length > 0) {
          setSelectedNIP(data.profiles[0].nip);
        }
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const handleDocumentAnalysis = async () => {
    if (!documentContent.trim()) {
      toast({
        title: 'Error',
        description: 'Mohon masukkan konten dokumen',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedNIP) {
      toast({
        title: 'Error',
        description: 'Mohon masukkan NIP',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: documentContent,
          nip: selectedNIP
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Analisis Berhasil',
          description: 'Dokumen telah dianalisis dengan AI',
        });
        setDocumentContent('');
      } else {
        throw new Error(data.error || 'Gagal menganalisis dokumen');
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

  const handlePortfolioAnalysis = async () => {
    if (!portfolioUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Mohon masukkan URL portfolio',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedNIP) {
      toast({
        title: 'Error',
        description: 'Mohon masukkan NIP',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/analyze-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          portfolioUrl,
          nip: selectedNIP
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Analisis Berhasil',
          description: 'Portfolio telah dianalisis dengan AI',
        });
        setPortfolioUrl('');
      } else {
        throw new Error(data.error || 'Gagal menganalisis portfolio');
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Input Data ASN</h1>
        <p className="text-muted-foreground">
          Input data dokumen penilaian, portfolio, dan informasi lainnya untuk analisis talenta berbasis AI
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Document Analysis */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Analisis Dokumen</h2>
              <p className="text-sm text-muted-foreground">Upload dokumen penilaian kinerja</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nip-doc">NIP Pegawai</Label>
              <Input
                id="nip-doc"
                placeholder="Contoh: 199002152015031002"
                value={selectedNIP}
                onChange={(e) => setSelectedNIP(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="document">Konten Dokumen</Label>
              <Textarea
                id="document"
                rows={10}
                placeholder="Paste konten dokumen penilaian kinerja, sertifikat, atau dokumen lainnya..."
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handleDocumentAnalysis}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Analisis Dokumen
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Portfolio Analysis */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Analisis Portfolio</h2>
              <p className="text-sm text-muted-foreground">Analisis LinkedIn atau portfolio online</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nip-portfolio">NIP Pegawai</Label>
              <Input
                id="nip-portfolio"
                placeholder="Contoh: 199002152015031002"
                value={selectedNIP}
                onChange={(e) => setSelectedNIP(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="portfolio-url">URL Portfolio</Label>
              <Input
                id="portfolio-url"
                type="url"
                placeholder="https://linkedin.com/in/username atau portfolio URL"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Sumber yang Didukung:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• LinkedIn Profile</li>
                <li>• Personal Website/Portfolio</li>
                <li>• GitHub Profile</li>
                <li>• Professional Portfolio Sites</li>
              </ul>
            </div>

            <Button
              onClick={handlePortfolioAnalysis}
              disabled={loading}
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
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Analisis Portfolio
                </>
              )}
            </Button>
          </div>
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
            <p className="text-sm text-muted-foreground">
              Sistem ini menggunakan AI (GPT-4o) untuk menganalisis dokumen dan portfolio secara mendalam.
              AI akan mengekstrak skill teknis, soft skill, pengalaman, prestasi, dan memberikan penilaian
              kompetensi yang komprehensif. Data yang dianalisis akan digunakan untuk pemetaan talenta dan
              rekomendasi jabatan.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}