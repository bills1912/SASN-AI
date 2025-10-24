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
  Users, 
  AlertCircle,
  Filter,
  X,
  Search,
  Download,
  TrendingUp,
  Award,
  Target,
  RefreshCw,
  Eye,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

export default function KepalaInstansiDashboard({ user }) {
  const [employees, setEmployees] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [meritIndex, setMeritIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Detail modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filters
  const [filterBox, setFilterBox] = useState('all');
  const [filterPosition, setFilterPosition] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    if (user?.institution) {
      loadEmployeesAndAnalysis();
      loadMeritIndex();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [analysisResults, filterBox, filterPosition, searchQuery]);

  const loadEmployeesAndAnalysis = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Load employees and their analysis
      const response = await fetch(`/api/talent/institution-employees/${encodeURIComponent(user.institution)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees);
        setAnalysisResults(data.analysis);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data pegawai',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMeritIndex = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get institution details with merit index
      const response = await fetch(`/api/merit/institution/${encodeURIComponent(user.institution)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMeritIndex(data.institution);
      }
    } catch (error) {
      console.error('Error loading merit index:', error);
    }
  };

  const applyFilters = () => {
    if (!analysisResults?.employees) {
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

  const exportToCSV = async () => {
    if (!analysisResults) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/talent/export-institution-analysis/${encodeURIComponent(user.institution)}`, {
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

  const uniqueBoxes = analysisResults?.employees
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard Kepala Instansi
        </h1>
        <p className="text-muted-foreground">
          {user.institution} - {user.name}
        </p>
      </div>

      {/* Institution Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Pegawai</p>
              <p className="text-2xl font-bold text-foreground">{employees.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Teranalisis</p>
              <p className="text-2xl font-bold text-green-600">
                {analysisResults?.totalEmployees || 0}
              </p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Merit Index</p>
              <p className="text-2xl font-bold text-purple-600">
                {meritIndex?.merit_index?.toFixed(1) || 'N/A'}
              </p>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-sm font-semibold text-foreground">
                {analysisResults ? 'Tersedia' : 'Belum Tersedia'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Merit System Index Details */}
      {meritIndex && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Merit System Index - {user.institution}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Compliance Score</p>
              <p className="text-2xl font-bold text-purple-600">{meritIndex.compliance_score}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Talent Pipeline</p>
              <p className="text-2xl font-bold text-blue-600">{meritIndex.talent_pipeline}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Training Adequacy</p>
              <p className="text-2xl font-bold text-green-600">{meritIndex.training_adequacy}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResults ? (
        <>
          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Filter & Pencarian</h3>
              </div>
              <Button
                onClick={loadEmployeesAndAnalysis}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
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

              <div className="flex items-end gap-2">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                >
                  <Download className="w-4 h-4" />
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
              Daftar Pegawai & Hasil Analisis Talenta
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
                          <Badge className={`${getBoxColor(employee.talentBox)} text-white text-xs`}>
                            {employee.talentBox}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">
                          <div className="space-y-1">
                            {(employee.recommendedPositions || []).slice(0, 2).map((pos, idx) => (
                              <div key={idx} className="text-xs">
                                • {typeof pos === 'string' ? pos : pos.position}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Button
                            onClick={() => openDetailModal(employee)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </Button>
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
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Belum Ada Hasil Analisis Manajemen Talenta
            </h3>
            <p className="text-muted-foreground mb-4">
              Administrator belum menjalankan analisis manajemen talenta untuk instansi Anda. 
              Hubungi administrator untuk menjalankan analisis.
            </p>
            <p className="text-sm text-muted-foreground">
              Total pegawai di instansi Anda: <span className="font-semibold text-foreground">{employees.length}</span>
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

              {/* 9-Box Classification with Visual Matrix */}
              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Klasifikasi 9-Box Talent Matrix
                </h3>
                
                {/* 9-Box Visual Matrix */}
                <div className="mb-4">
                  <div className="relative w-full max-w-md mx-auto aspect-square">
                    {/* Grid */}
                    <div className="grid grid-cols-3 grid-rows-3 gap-1 h-full">
                      {/* Row 3 (High Performance) */}
                      <div className="bg-yellow-200 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 rounded flex items-center justify-center text-xs font-medium p-1">
                        <span className="text-center">Solid Professional</span>
                      </div>
                      <div className="bg-green-300 dark:bg-green-900/40 border border-green-500 dark:border-green-700 rounded flex items-center justify-center text-xs font-medium p-1">
                        <span className="text-center">High Performer</span>
                      </div>
                      <div className="bg-green-400 dark:bg-green-800/50 border border-green-600 dark:border-green-600 rounded flex items-center justify-center text-xs font-medium p-1">
                        <span className="text-center">Star/Top Talent</span>
                      </div>
                      
                      {/* Row 2 (Medium Performance) */}
                      <div className="bg-orange-200 dark:bg-orange-900/30 border border-orange-400 dark:border-orange-700 rounded flex items-center justify-center text-xs font-medium p-1">
                        <span className="text-center">Inconsistent</span>
                      </div>
                      <div className="bg-yellow-300 dark:bg-yellow-800/40 border border-yellow-500 dark:border-yellow-600 rounded flex items-center justify-center text-xs font-medium p-1">
                        <span className="text-center">Core Player</span>
                      </div>
                      <div className="bg-blue-300 dark:bg-blue-900/40 border border-blue-500 dark:border-blue-700 rounded flex items-center justify-center text-xs font-medium p-1">
                        <span className="text-center">High Potential</span>
                      </div>
                      
                      {/* Row 1 (Low Performance) */}
                      <div className="bg-red-300 dark:bg-red-900/30 border border-red-500 dark:border-red-700 rounded flex items-center justify-center text-xs font-medium p-1">
                        <span className="text-center">Underperformer</span>
                      </div>
                      <div className="bg-orange-300 dark:bg-orange-800/40 border border-orange-500 dark:border-orange-600 rounded flex items-center justify-center text-xs font-medium p-1">
                        <span className="text-center">Risk</span>
                      </div>
                      <div className="bg-purple-300 dark:bg-purple-900/40 border border-purple-500 dark:border-purple-700 rounded flex items-center justify-center text-xs font-medium p-1">
                        <span className="text-center">Enigma</span>
                      </div>
                    </div>
                    
                    {/* Position Marker */}
                    {selectedEmployee.performance?.score && selectedEmployee.potential?.score && (
                      <div 
                        className="absolute w-6 h-6 bg-red-600 border-4 border-white dark:border-slate-900 rounded-full shadow-lg animate-pulse z-10"
                        style={{
                          left: `${((selectedEmployee.potential.score - 0.5) / 3) * 100}%`,
                          bottom: `${((selectedEmployee.performance.score - 0.5) / 3) * 100}%`,
                          transform: 'translate(-50%, 50%)'
                        }}
                        title={`Performance: ${selectedEmployee.performance.score}, Potential: ${selectedEmployee.potential.score}`}
                      />
                    )}
                    
                    {/* Axis Labels */}
                    <div className="absolute -bottom-6 left-0 right-0 text-center text-xs font-semibold text-muted-foreground">
                      Potential (Potensi) →
                    </div>
                    <div className="absolute -left-16 top-0 bottom-0 flex items-center">
                      <span className="text-xs font-semibold text-muted-foreground transform -rotate-90 whitespace-nowrap">
                        Performance (Kinerja) →
                      </span>
                    </div>
                    
                    {/* Scale Labels */}
                    <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">Low</div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">Med</div>
                    <div className="absolute -bottom-6 right-0 text-xs text-muted-foreground">High</div>
                    
                    <div className="absolute -left-8 bottom-0 text-xs text-muted-foreground">Low</div>
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Med</div>
                    <div className="absolute -left-8 top-0 text-xs text-muted-foreground">High</div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-red-600 border-2 border-white rounded-full"></div>
                      <span className="text-xs text-muted-foreground">Posisi Pegawai</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
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
