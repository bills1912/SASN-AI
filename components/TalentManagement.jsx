'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Award, Target, Code2, Loader2, AlertCircle, Shield, Lock, CheckCircle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import NineBoxMatrix from '@/components/NineBoxMatrix';
import DetailedNineBoxMatrix from '@/components/DetailedNineBoxMatrix';

export default function TalentManagement({ user, currentView, selectedProfile: globalSelectedProfile }) {
  const [selectedProfile, setSelectedProfile] = useState(globalSelectedProfile);
  const [talentMapping, setTalentMapping] = useState(null);
  const [skillAnalysis, setSkillAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasGeneratedData, setHasGeneratedData] = useState(false);
  
  // Blockchain state
  const [blockchainStats, setBlockchainStats] = useState(null);
  const [meritAudit, setMeritAudit] = useState(null);
  const [credentialHistory, setCredentialHistory] = useState([]);
  
  const { toast } = useToast();

  const loadAnalysisData = async (nip) => {
    if (!nip) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Load talent mapping if needed
      if (currentView === 'talent-mapping' || currentView === 'analysis-summary' || 
          currentView === 'job-recommendation' || currentView === 'development-area') {
        const mappingResponse = await fetch('/api/talent/talent-mapping', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ nip })
        });

        if (mappingResponse.ok) {
          const data = await mappingResponse.json();
          setTalentMapping(data.mapping);
          setHasGeneratedData(true);
        }
      }

      // Load skill analysis if needed
      if (currentView === 'skill-analysis') {
        const skillResponse = await fetch('/api/talent/skill-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ nip })
        });

        if (skillResponse.ok) {
          const data = await skillResponse.json();
          setSkillAnalysis(data.analysis);
          setHasGeneratedData(true);
        }
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load blockchain data for security verification
  const loadBlockchainData = async (nip) => {
    if (!nip) return;

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      // Get blockchain statistics
      const statsRes = await fetch('/api/blockchain/statistics', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setBlockchainStats(statsData.statistics);
      }

      // Get merit audit trail
      const auditRes = await fetch(`/api/blockchain/merit-audit/${nip}`, { headers });
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setMeritAudit(auditData.audit);
      }

      // Get credential history
      const historyRes = await fetch(`/api/blockchain/history/${nip}`, { headers });
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setCredentialHistory(historyData.history || []);
      }
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  };

  // Sync with global selected profile and load blockchain data
  useEffect(() => {
    if (globalSelectedProfile) {
      setSelectedProfile(globalSelectedProfile);
      loadAnalysisData(globalSelectedProfile.nip);
      loadBlockchainData(globalSelectedProfile.nip);
    }
  }, [globalSelectedProfile, currentView]);

  const get9BoxChartOption = () => {
    if (!talentMapping) return {};

    const { performance, potential } = talentMapping;

    return {
      title: {
        text: '9-Box Talent Matrix',
        left: 'center',
        textStyle: { color: '#e2e8f0' }
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 3,
        interval: 1,
        name: 'Performance',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: (value) => {
            if (value === 1) return 'Low';
            if (value === 2) return 'Medium';
            if (value === 3) return 'High';
            return '';
          },
          color: '#94a3b8'
        },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 3,
        interval: 1,
        name: 'Potential',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: (value) => {
            if (value === 1) return 'Low';
            if (value === 2) return 'Medium';
            if (value === 3) return 'High';
            return '';
          },
          color: '#94a3b8'
        },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      series: [
        {
          type: 'scatter',
          symbolSize: 60,
          data: [[performance.score, potential.score]],
          itemStyle: {
            color: '#3b82f6',
            shadowBlur: 10,
            shadowColor: '#3b82f6'
          },
          label: {
            show: true,
            formatter: selectedProfile?.name || 'ASN',
            color: '#fff',
            fontSize: 12
          }
        }
      ],
      backgroundColor: 'transparent',
      grid: { left: '15%', right: '5%', top: '15%', bottom: '15%' }
    };
  };

  const getSkillRadarOption = () => {
    if (!skillAnalysis) return {};

    const { technicalSkills } = skillAnalysis;
    const topSkills = technicalSkills.slice(0, 6);

    return {
      title: {
        text: 'Skill Proficiency Radar',
        left: 'center',
        textStyle: { color: '#e2e8f0' }
      },
      radar: {
        indicator: topSkills.map(s => ({ name: s.skill, max: 100 })),
        splitArea: {
          areaStyle: {
            color: ['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']
          }
        },
        axisLine: { lineStyle: { color: '#334155' } },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: topSkills.map(s => s.proficiency),
              name: 'Current',
              areaStyle: { color: 'rgba(59, 130, 246, 0.3)' },
              lineStyle: { color: '#3b82f6' },
              itemStyle: { color: '#3b82f6' }
            },
            {
              value: topSkills.map(s => s.benchmark),
              name: 'Benchmark',
              areaStyle: { color: 'rgba(34, 197, 94, 0.2)' },
              lineStyle: { color: '#22c55e', type: 'dashed' },
              itemStyle: { color: '#22c55e' }
            }
          ]
        }
      ],
      legend: {
        data: ['Current', 'Benchmark'],
        bottom: 10,
        textStyle: { color: '#94a3b8' }
      },
      backgroundColor: 'transparent'
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data analisis...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {currentView === 'talent-mapping' && 'Pemetaan Talenta'}
            {currentView === 'analysis-summary' && 'Ringkasan Analisis'}
            {currentView === 'job-recommendation' && 'Rekomendasi Jabatan'}
            {currentView === 'skill-analysis' && 'Analisis Skill'}
            {currentView === 'development-area' && 'Area Pengembangan'}
            {currentView === 'talent-management' && 'Manajemen Talenta'}
          </h1>
          <p className="text-muted-foreground">
            Hasil analisis talenta berbasis AI untuk pegawai ASN
          </p>
        </div>
      </div>

      {/* Profile Summary with Blockchain Security */}
      {selectedProfile && (
        <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold text-foreground">{selectedProfile.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedProfile.position} - {selectedProfile.agency}</p>
              <p className="text-xs text-muted-foreground">NIP: {selectedProfile.nip}</p>
            </div>
            
            {/* Blockchain Security Indicators */}
            <div className="flex flex-wrap gap-2">
              {blockchainStats?.blockchainValid && (
                <Badge variant="success" className="flex items-center gap-1 text-xs">
                  <Shield className="w-3 h-3" />
                  Blockchain Verified
                </Badge>
              )}
              {meritAudit && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Lock className="w-3 h-3" />
                  {meritAudit.totalRecords} Records
                </Badge>
              )}
              {meritAudit?.meritBasedPromotions > 0 && (
                <Badge className="bg-purple-500 text-white flex items-center gap-1 text-xs">
                  <Award className="w-3 h-3" />
                  Merit Score: {meritAudit.averageMeritScore}
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4">
            <div className="p-3 bg-white dark:bg-slate-900/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Nama</p>
              <p className="font-semibold text-sm text-foreground truncate">{selectedProfile.name}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Jabatan</p>
              <p className="font-semibold text-sm text-foreground truncate">{selectedProfile.position}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Instansi</p>
              <p className="font-semibold text-sm text-foreground truncate">{selectedProfile.agency}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Performance Score</p>
              <p className="font-semibold text-sm text-foreground">{selectedProfile.performanceScore}/100</p>
            </div>
          </div>

          {/* Blockchain Security Info */}
          {meritAudit && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-green-800 dark:text-green-400">Data Secured by Blockchain</p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {meritAudit.totalRecords} records verified • {meritAudit.performanceRecords} performance assessments • 
                    {meritAudit.meritBasedPromotions} merit-based promotions • Blockchain integrity: Valid
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* TALENT MAPPING VIEW */}
      {currentView === 'talent-mapping' && talentMapping && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 9-Box Matrix - Sesuai Menpan RB */}
          <Card className="p-4 md:p-6">
            <NineBoxMatrix 
              position={{
                box: talentMapping.boxNumber || 5,
                label: talentMapping.talentBox,
                quadrant: `Potensi: ${talentMapping.potential?.level || 'Medium'}, Kinerja: ${talentMapping.performance?.level || 'Medium'}`,
                priority: talentMapping.priority || 'Medium'
              }}
              showLabels={true}
            />
          </Card>

          {/* Talent Box Classification with Real-time Calculation */}
          <Card className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Klasifikasi Talenta (Real-time)</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Talent Box</p>
                  <Badge variant="outline" className="text-xs">
                    Box {talentMapping.boxNumber || 5}
                  </Badge>
                </div>
                <p className="text-xl md:text-2xl font-bold text-blue-400">{talentMapping.talentBox}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Priority: <span className="font-semibold">{talentMapping.priority}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Kinerja (Sumbu Y)</p>
                    <Badge className="bg-purple-500 text-white text-xs">
                      {talentMapping.performance.sumbuY?.toFixed(2) || '0.00'}/3.0
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{talentMapping.performance.level}</p>
                  <p className="text-xs text-muted-foreground mt-1">{talentMapping.performance.justification}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Potensi (Sumbu X)</p>
                    <Badge className="bg-green-500 text-white text-xs">
                      {talentMapping.potential.sumbuX?.toFixed(2) || '0.00'}/3.0
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{talentMapping.potential.level}</p>
                  <p className="text-xs text-muted-foreground mt-1">{talentMapping.potential.justification}</p>
                </div>
              </div>

              {/* Breakdown Sumbu X (jika ada) */}
              {talentMapping.potential.breakdown && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs font-semibold text-green-800 dark:text-green-400 mb-2">
                    Breakdown Sumbu X (Potensi):
                  </p>
                  <div className="space-y-1 text-xs">
                    {Object.entries(talentMapping.potential.breakdown).map(([key, data]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-muted-foreground capitalize">
                          {key === 'jobFit' ? 'Job Fit' :
                           key === 'gapPotensi' ? 'Gap Potensi' :
                           key === 'diklatTeknis' ? 'Diklat Teknis' :
                           key === 'pendidikan' ? 'Pendidikan' :
                           key === 'pengalaman' ? 'Pengalaman' : key}:
                        </span>
                        <span className="font-mono text-foreground">
                          {data.converted} × {(data.weight * 100).toFixed(0)}% = {data.score.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Risk Level</p>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  talentMapping.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                  talentMapping.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {talentMapping.riskLevel}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ANALYSIS SUMMARY VIEW */}
      {currentView === 'analysis-summary' && talentMapping && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Ringkasan Pemetaan Talenta</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Kategori Talenta</p>
                <p className="text-2xl font-bold text-blue-400">{talentMapping.talentBox}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">Performance</p>
                  <p className="text-lg font-semibold text-foreground">{talentMapping.performance.level}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">Potential</p>
                  <p className="text-lg font-semibold text-foreground">{talentMapping.potential.level}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">AI Recommendations</h3>
            <ul className="space-y-2">
              {talentMapping.recommendations.slice(0, 5).map((rec, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span className="text-sm text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* JOB RECOMMENDATION VIEW */}
      {currentView === 'job-recommendation' && talentMapping && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-foreground">Career Path Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {talentMapping.careerPath.map((path, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-muted-foreground">{path}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-semibold text-foreground">Rekomendasi Jabatan</h3>
            </div>
            <div className="space-y-3">
              {talentMapping.suitablePositions.map((pos, idx) => (
                <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-foreground">{pos.position}</p>
                    <span className="text-sm font-semibold text-blue-400">{pos.fit}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{pos.reason}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* SKILL ANALYSIS VIEW */}
      {currentView === 'skill-analysis' && skillAnalysis && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Skill Radar */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Proficiency vs Benchmark</h3>
            <ReactECharts
              option={getSkillRadarOption()}
              style={{ height: '400px' }}
              theme="dark"
            />
          </Card>

          {/* Overall Score */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Overall Skill Assessment</h3>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="12"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      strokeDasharray={`${skillAnalysis.overallScore * 5.02} 502`}
                      strokeLinecap="round"
                      transform="rotate(-90 96 96)"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <p className="text-4xl font-bold text-foreground">{skillAnalysis.overallScore}</p>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Skill Gaps */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Skill Gaps Analysis</h3>
            <div className="space-y-3">
              {skillAnalysis.skillGaps.map((gap, idx) => (
                <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-foreground">{gap.skill}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      gap.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                      gap.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {gap.priority} Priority
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current: {gap.currentLevel}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Required: {gap.requiredLevel}%</p>
                    </div>
                  </div>
                  <div className="mt-2 bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${gap.currentLevel}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* DEVELOPMENT AREA VIEW */}
      {currentView === 'development-area' && talentMapping && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Area Pengembangan</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {talentMapping.developmentAreas.map((area, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-foreground">{area}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rekomendasi Pengembangan</h3>
            <ul className="space-y-2">
              {talentMapping.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* NO DATA STATE */}
      {!talentMapping && !skillAnalysis && (
        <Card className="p-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Data Analisis</h3>
            <p className="text-muted-foreground mb-4">
              Silakan generate analisis terlebih dahulu di menu <span className="font-semibold text-blue-500">Input Data</span>
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
