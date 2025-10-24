'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Play, 
  Loader2, 
  Download, 
  Users, 
  CheckCircle,
  AlertCircle,
  Filter,
  X,
  Search,
  FileSpreadsheet,
  Eye,
  ChevronRight
} from 'lucide-react';

export default function InstitutionTalentAnalysis({ user }) {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  
  // Detail modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filters
  const [filterBox, setFilterBox] = useState('all');
  const [filterPosition, setFilterPosition] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    loadInstitutions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [analysisResults, filterBox, filterPosition, searchQuery]);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/institutions-list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInstitutions(data.institutions);
      }
    } catch (error) {
      console.error('Error loading institutions:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat daftar instansi',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadExistingAnalysis = async (institutionName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/talent/institution-analysis/${encodeURIComponent(institutionName)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResults(data.analysis);
        toast({
          title: 'Data Ditemukan',
          description: 'Hasil analisis sebelumnya berhasil dimuat',
        });
      } else {
        setAnalysisResults(null);
      }
    } catch (error) {
      console.error('Error loading existing analysis:', error);
      setAnalysisResults(null);
    }
  };

  const handleInstitutionChange = (value) => {
    setSelectedInstitution(value);
    setAnalysisResults(null);
    setFilterBox('all');
    setFilterPosition('');
    setSearchQuery('');
    
    // Load existing analysis if available
    loadExistingAnalysis(value);
  };

  const runBulkAnalysis = async () => {
    if (!selectedInstitution) {
      toast({
        title: 'Pilih Instansi',
        description: 'Silakan pilih instansi terlebih dahulu',
        variant: 'destructive'
      });
      return;
    }

    setAnalyzing(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/analyze-institution-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ institutionName: selectedInstitution })
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysisResults({
          institutionName: data.institutionName,
          analyzedAt: data.analyzedAt,
          totalEmployees: data.totalEmployees,
          employees: data.employees,
          summary: data.summary
        });

        toast({
          title: 'Analisis Selesai',
          description: `Berhasil menganalisis ${data.totalEmployees} pegawai dari ${data.institutionName}`,
        });
      } else {
        toast({
          title: 'Analisis Gagal',
          description: data.error || 'Terjadi kesalahan saat analisis',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error running analysis:', error);
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat menjalankan analisis',
        variant: 'destructive'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const applyFilters = () => {
    if (!analysisResults) {
      setFilteredResults([]);
      return;
    }

    let filtered = [...analysisResults.employees];

    // Filter by 9-box
    if (filterBox !== 'all') {
      filtered = filtered.filter(emp => emp.talentBox === filterBox);
    }

    // Filter by recommended position
    if (filterPosition) {
      filtered = filtered.filter(emp => {
        const positions = emp.recommendedPositions || [];
        return positions.some(p => {
          const posName = typeof p === 'string' ? p : p.position;
          return posName.toLowerCase().includes(filterPosition.toLowerCase());
        });
      });
    }

    // Search by name or NIP
    if (searchQuery) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.nip.includes(searchQuery)
      );
    }

    setFilteredResults(filtered);
  };

  const clearFilters = () => {
    setFilterBox('all');
    setFilterPosition('');
    setSearchQuery('');
  };

  const exportToExcel = async () => {
    if (!analysisResults) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/talent/export-institution-analysis/${encodeURIComponent(selectedInstitution)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Convert to CSV
        const employees = data.exportData.employees;
        const headers = Object.keys(employees[0]);
        const csvContent = [
          headers.join(','),
          ...employees.map(emp => 
            headers.map(h => {
              const val = emp[h];
              // Escape commas and quotes
              return typeof val === 'string' && (val.includes(',') || val.includes('"'))
                ? `"${val.replace(/"/g, '""')}"`
                : val;
            }).join(',')
          )
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', data.filename.replace('.json', '.csv'));
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: 'Export Berhasil',
          description: 'Data berhasil diexport ke CSV',
        });
      }
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: 'Export Gagal',
        description: 'Terjadi kesalahan saat export data',
        variant: 'destructive'
      });
    }
  };

  const getBoxColor = (boxName) => {
    if (!boxName) return 'bg-gray-500';
    if (boxName.includes('High Performer') || boxName.includes('Star')) return 'bg-green-500';
    if (boxName.includes('High Potential')) return 'bg-blue-500';
    if (boxName.includes('Solid') || boxName.includes('Core')) return 'bg-yellow-500';
    if (boxName.includes('Underperformer') || boxName.includes('Risk')) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const uniqueBoxes = analysisResults 
    ? [...new Set(analysisResults.employees.map(e => e.talentBox).filter(Boolean))]
    : [];

  const openDetailModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedEmployee(null);
    setShowDetailModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Analisis Manajemen Talenta per Instansi
        </h1>
        <p className="text-muted-foreground">
          Jalankan analisis manajemen talenta untuk seluruh pegawai di instansi secara bersamaan
        </p>
      </div>

      {/* Institution Selection & Actions */}
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="institution">Pilih Instansi</Label>
            <Select value={selectedInstitution} onValueChange={handleInstitutionChange}>
              <SelectTrigger id="institution" className="w-full">
                <SelectValue placeholder="Pilih instansi..." />
              </SelectTrigger>
              <SelectContent>
                {institutions.map((inst) => (
                  <SelectItem key={inst.name} value={inst.name}>
                    <div className="flex items-center justify-between w-full">
                      <span>{inst.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({inst.employeeCount} pegawai)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedInstitution && institutions.find(i => i.name === selectedInstitution)?.hasAnalysis && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Sudah ada hasil analisis sebelumnya
              </p>
            )}
          </div>

          <div className="flex items-end gap-2">
            <Button
              onClick={runBulkAnalysis}
              disabled={!selectedInstitution || analyzing}
              className="flex-1"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Jalankan Analisis
                </>
              )}
            </Button>
            
            {analysisResults && (
              <Button
                onClick={exportToExcel}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </div>

        {selectedInstitution && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>
              Instansi yang dipilih: <span className="font-semibold text-foreground">{selectedInstitution}</span>
            </span>
            <span className="ml-auto text-xs">
              {institutions.find(i => i.name === selectedInstitution)?.employeeCount || 0} pegawai
            </span>
          </div>
        )}
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <>
          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pegawai</p>
                  <p className="text-2xl font-bold text-foreground">{analysisResults.totalEmployees}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Berhasil Dianalisis</p>
                  <p className="text-2xl font-bold text-green-600">{analysisResults.summary?.successfulAnalyses || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gagal</p>
                  <p className="text-2xl font-bold text-red-600">{analysisResults.summary?.failedAnalyses || 0}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Terakhir Dianalisis</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(analysisResults.analyzedAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <FileSpreadsheet className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Filter & Pencarian</h3>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs">Kategori 9-Box</Label>
                <Select value={filterBox} onValueChange={setFilterBox}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {uniqueBoxes.map(box => (
                      <SelectItem key={box} value={box}>{box}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Rekomendasi Jabatan</Label>
                <Input
                  placeholder="Cari jabatan..."
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Cari Nama/NIP</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Nama atau NIP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Filter
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Menampilkan {filteredResults.length} dari {analysisResults.totalEmployees} pegawai
            </p>
          </Card>

          {/* Results Table */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Hasil Analisis Pegawai
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">No</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">NIP</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Nama</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Jabatan</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Kategori 9-Box</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Rekomendasi Jabatan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.length > 0 ? (
                    filteredResults.map((employee, index) => (
                      <tr key={employee.nip} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-2 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="py-3 px-2 text-sm font-mono text-foreground">{employee.nip}</td>
                        <td className="py-3 px-2 text-sm font-medium text-foreground">{employee.name}</td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">{employee.position}</td>
                        <td className="py-3 px-2">
                          {employee.error ? (
                            <Badge variant="destructive" className="text-xs">
                              Error
                            </Badge>
                          ) : (
                            <Badge className={`${getBoxColor(employee.talentBox)} text-white text-xs`}>
                              {employee.talentBox}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">
                          {employee.error ? (
                            <span className="text-red-500 text-xs">{employee.error}</span>
                          ) : (
                            <div className="space-y-1">
                              {(employee.recommendedPositions || []).slice(0, 2).map((pos, idx) => (
                                <div key={idx} className="text-xs">
                                  • {typeof pos === 'string' ? pos : pos.position}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-muted-foreground">
                        Tidak ada data yang sesuai dengan filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* No Results State */}
      {!analysisResults && !analyzing && (
        <Card className="p-12">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Belum Ada Hasil Analisis
            </h3>
            <p className="text-muted-foreground mb-4">
              Pilih instansi dan klik tombol "Jalankan Analisis" untuk memulai analisis manajemen talenta
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
