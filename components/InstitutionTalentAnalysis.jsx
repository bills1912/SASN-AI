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
  ChevronRight,
  TrendingUp,
  Target
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
                    <th className="text-center py-3 px-2 text-sm font-semibold text-foreground">Aksi</th>
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
                        <td className="py-3 px-2 text-center">
                          {!employee.error && (
                            <Button
                              onClick={() => openDetailModal(employee)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Detail
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-muted-foreground">
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

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Detail Analisis Manajemen Talenta
            </DialogTitle>
            <DialogDescription>
              Hasil analisis lengkap untuk {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && selectedEmployee.fullAnalysis && (
            <div className="space-y-6 mt-4">
              {/* Employee Info */}
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Nama</p>
                    <p className="font-semibold text-foreground">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">NIP</p>
                    <p className="font-semibold text-foreground font-mono">{selectedEmployee.nip}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Jabatan</p>
                    <p className="font-semibold text-foreground">{selectedEmployee.position}</p>
                  </div>
                </div>
              </Card>

              {/* 9-Box Classification */}
              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Klasifikasi 9-Box Talent Matrix
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Kategori Talenta</p>
                    <Badge className={`${getBoxColor(selectedEmployee.talentBox)} text-white text-sm`}>
                      {selectedEmployee.talentBox}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">Box #{selectedEmployee.boxNumber}</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Priority Level</p>
                    <p className="text-lg font-bold text-foreground">{selectedEmployee.priority}</p>
                  </div>
                </div>
              </Card>

              {/* Performance & Potential */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">
                    Performance (Kinerja)
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Level:</span>
                      <Badge variant="outline">{selectedEmployee.performance?.level}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span className="font-semibold text-foreground">{selectedEmployee.performance?.score}/3</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                      {selectedEmployee.performance?.justification}
                    </p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">
                    Potential (Potensi)
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Level:</span>
                      <Badge variant="outline">{selectedEmployee.potential?.level}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span className="font-semibold text-foreground">{selectedEmployee.potential?.score}/3</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                      {selectedEmployee.potential?.justification}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Recommended Positions */}
              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-green-600" />
                  Rekomendasi Jabatan
                </h3>
                <div className="space-y-3">
                  {(selectedEmployee.recommendedPositions || []).map((pos, idx) => (
                    <div key={idx} className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-foreground text-sm">
                          {typeof pos === 'string' ? pos : pos.position}
                        </p>
                        {pos.fit && (
                          <Badge className="bg-green-600 text-white text-xs">
                            Fit: {pos.fit}%
                          </Badge>
                        )}
                      </div>
                      {pos.reason && (
                        <p className="text-xs text-muted-foreground">{pos.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Development Areas */}
              {selectedEmployee.developmentAreas && selectedEmployee.developmentAreas.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    Area Pengembangan
                  </h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedEmployee.developmentAreas.map((area, idx) => (
                      <div key={idx} className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-800">
                        <p className="text-sm text-foreground">{area}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Risk Assessment */}
              {selectedEmployee.riskLevel && (
                <Card className="p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Risk Assessment
                  </h3>
                  <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                    selectedEmployee.riskLevel === 'High' ? 'bg-red-500/20 text-red-600' :
                    selectedEmployee.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-green-500/20 text-green-600'
                  }`}>
                    Risk Level: {selectedEmployee.riskLevel}
                  </div>
                </Card>
              )}

              {/* AI Recommendations */}
              {selectedEmployee.fullAnalysis?.recommendations && (
                <Card className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">
                    Rekomendasi AI
                  </h3>
                  <ul className="space-y-2">
                    {selectedEmployee.fullAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button onClick={closeDetailModal} variant="outline">
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
