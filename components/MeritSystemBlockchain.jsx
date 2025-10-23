'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  CheckCircle, 
  Lock, 
  FileCheck, 
  Award,
  TrendingUp,
  History,
  Database,
  AlertCircle,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

export default function MeritSystemBlockchain({ user, selectedProfile }) {
  const [blockchainStats, setBlockchainStats] = useState(null);
  const [meritAudit, setMeritAudit] = useState(null);
  const [credentialHistory, setCredentialHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedProfile) {
      loadBlockchainData();
    }
  }, [selectedProfile]);

  const loadBlockchainData = async () => {
    if (!selectedProfile) return;

    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      // Get blockchain statistics
      const statsRes = await fetch('/api/blockchain/statistics', { headers });
      const statsData = await statsRes.json();
      
      if (statsRes.ok) {
        setBlockchainStats(statsData.statistics);
      }

      // Get merit audit trail for selected profile
      const auditRes = await fetch(`/api/blockchain/merit-audit/${selectedProfile.nip}`, { headers });
      const auditData = await auditRes.json();
      
      if (auditRes.ok) {
        setMeritAudit(auditData.audit);
      }

      // Get credential history
      const historyRes = await fetch(`/api/blockchain/history/${selectedProfile.nip}`, { headers });
      const historyData = await historyRes.json();
      
      if (historyRes.ok && historyData.history) {
        setCredentialHistory(historyData.history);
      }

    } catch (error) {
      console.error('Error loading blockchain data:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data blockchain',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCredential = async (credentialHash) => {
    setVerifying(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/blockchain/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          nip: selectedProfile.nip,
          credentialHash
        })
      });

      const data = await res.json();

      if (data.verification && data.verification.verified) {
        toast({
          title: '✓ Kredensial Terverifikasi',
          description: 'Data telah diverifikasi melalui blockchain',
        });
      } else {
        toast({
          title: 'Verifikasi Gagal',
          description: data.verification?.message || 'Gagal verifikasi',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memverifikasi kredensial',
        variant: 'destructive'
      });
    } finally {
      setVerifying(false);
    }
  };

  const exportAuditTrail = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/blockchain/export/${selectedProfile.nip}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const data = await res.json();
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merit-audit-${selectedProfile.nip}-${Date.now()}.json`;
      a.click();

      toast({
        title: 'Export Berhasil',
        description: 'Audit trail telah diunduh',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal export audit trail',
        variant: 'destructive'
      });
    }
  };

  if (!selectedProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Shield className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Pilih Pegawai</h3>
        <p className="text-muted-foreground">
          Pilih pegawai untuk melihat data blockchain dan merit system
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" />
            Merit System Blockchain
          </h1>
          <p className="text-muted-foreground mt-1">
            Sistem manajemen talenta berbasis merit dengan keamanan blockchain
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadBlockchainData} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {meritAudit && (
            <Button onClick={exportAuditTrail} variant="default">
              <Download className="w-4 h-4 mr-2" />
              Export Audit
            </Button>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{selectedProfile.name}</h2>
            <p className="text-sm text-muted-foreground">NIP: {selectedProfile.nip}</p>
            <p className="text-sm text-muted-foreground">{selectedProfile.position} - {selectedProfile.agency}</p>
          </div>
          <Badge variant={blockchainStats?.blockchainValid ? 'success' : 'destructive'} className="flex items-center gap-1">
            {blockchainStats?.blockchainValid ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Blockchain Valid
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                Invalid
              </>
            )}
          </Badge>
        </div>
      </Card>

      {/* Blockchain Statistics */}
      {blockchainStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Blocks</p>
                <p className="text-2xl font-bold text-foreground">{blockchainStats.totalBlocks}</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credentials</p>
                <p className="text-2xl font-bold text-foreground">{blockchainStats.credentialRecords}</p>
              </div>
              <FileCheck className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold text-foreground">{blockchainStats.performanceRecords}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Career Moves</p>
                <p className="text-2xl font-bold text-foreground">{blockchainStats.careerMovementRecords}</p>
              </div>
              <Award className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Merit Audit Summary */}
      {meritAudit && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            Merit System Audit Trail
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{meritAudit.totalRecords}</p>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{meritAudit.performanceRecords}</p>
              <p className="text-sm text-muted-foreground">Penilaian Kinerja</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{meritAudit.meritBasedPromotions}</p>
              <p className="text-sm text-muted-foreground">Promosi Merit</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{meritAudit.averageMeritScore}</p>
              <p className="text-sm text-muted-foreground">Avg Merit Score</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-400">
              Blockchain integrity: <strong>{meritAudit.blockchainIntegrity ? 'VALID' : 'INVALID'}</strong>
            </p>
          </div>
        </Card>
      )}

      {/* Detailed History */}
      <Card className="p-6">
        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="space-y-4 mt-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-green-500" />
              Credential History (Blockchain-Verified)
            </h3>
            
            {(!credentialHistory || credentialHistory.filter(h => h.type === 'CREDENTIAL').length === 0) ? (
              <p className="text-muted-foreground text-center py-8">Belum ada kredensial yang tercatat</p>
            ) : (
              <div className="space-y-3">
                {credentialHistory.filter(h => h.type === 'CREDENTIAL').map((item, idx) => (
                  <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{item.data.credentialType}</Badge>
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-foreground">{item.data.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.data.institution}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Issued: {new Date(item.data.dateIssued).toLocaleDateString('id-ID')}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            Block: #{item.blockIndex}
                          </code>
                          <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[200px]">
                            Hash: {item.blockHash.substring(0, 16)}...
                          </code>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => verifyCredential(item.data.credentialHash)}
                        disabled={verifying}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Verify
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 mt-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Performance Records (Immutable)
            </h3>
            
            {(!credentialHistory || credentialHistory.filter(h => h.type === 'PERFORMANCE').length === 0) ? (
              <p className="text-muted-foreground text-center py-8">Belum ada penilaian kinerja tercatat</p>
            ) : (
              <div className="space-y-3">
                {credentialHistory.filter(h => h.type === 'PERFORMANCE').map((item, idx) => (
                  <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{item.data.category}</Badge>
                          <Badge className="bg-purple-500">Score: {item.data.score}</Badge>
                          <Badge className="bg-blue-500">Merit: {item.data.meritScore}</Badge>
                        </div>
                        <h4 className="font-semibold text-foreground">Periode: {item.data.period}</h4>
                        <p className="text-sm text-muted-foreground">Penilai: {item.data.assessor}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Tanggal: {new Date(item.data.assessmentDate).toLocaleDateString('id-ID')}
                        </p>
                        <div className="mt-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            Block: #{item.blockIndex} | {new Date(item.timestamp).toLocaleString('id-ID')}
                          </code>
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="career" className="space-y-4 mt-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              Career Movement History
            </h3>
            
            {credentialHistory.filter(h => h.type === 'CAREER_MOVEMENT').length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Belum ada mutasi/promosi tercatat</p>
            ) : (
              <div className="space-y-3">
                {credentialHistory.filter(h => h.type === 'CAREER_MOVEMENT').map((item, idx) => (
                  <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{item.data.movementType}</Badge>
                          {item.data.meritBased && (
                            <Badge variant="success" className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Merit-Based
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-foreground">
                          {item.data.fromPosition} → {item.data.toPosition}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.data.fromInstitution} → {item.data.toInstitution}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Efektif: {new Date(item.data.effectiveDate).toLocaleDateString('id-ID')}
                        </p>
                        {item.data.meritBased && (
                          <div className="mt-2 flex gap-2">
                            <Badge className="bg-blue-500">Merit Score: {item.data.meritScore}</Badge>
                            <Badge className="bg-green-500">Match: {item.data.competencyMatch}%</Badge>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Approved by:</p>
                        <p className="text-sm font-medium">{item.data.approvedBy}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4 mt-4">
            <h3 className="font-semibold flex items-center gap-2">
              <History className="w-5 h-5 text-blue-500" />
              Talent Assessment History
            </h3>
            
            {credentialHistory.filter(h => h.type === 'TALENT_ASSESSMENT').length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Belum ada assessment tercatat</p>
            ) : (
              <div className="space-y-3">
                {credentialHistory.filter(h => h.type === 'TALENT_ASSESSMENT').map((item, idx) => (
                  <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{item.data.assessmentType}</Badge>
                          <Badge>{item.data.quadrant}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Performance Level</p>
                            <p className="font-semibold">{item.data.performanceLevel}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Potential Level</p>
                            <p className="font-semibold">{item.data.potentialLevel}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Assessed by: {item.data.assessedBy}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Date: {new Date(item.data.assessmentDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Blockchain Info */}
      <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/20 dark:to-slate-900/20">
        <div className="flex items-start gap-4">
          <Shield className="w-12 h-12 text-blue-500" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Keamanan Blockchain</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Semua data kredensial, penilaian kinerja, dan mutasi karier disimpan dalam blockchain yang terdesentralisasi 
              dan tidak dapat diubah (immutable). Setiap perubahan akan tercatat dan dapat diaudit.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                SHA-256 Encryption
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Tamper-Proof
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <History className="w-3 h-3" />
                Full Audit Trail
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Merit-Based Transparency
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
