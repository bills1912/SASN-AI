'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Activity, Target, Award, AlertTriangle, TrendingUp, Newspaper } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function PerformanceAssessment({ user, currentView, selectedProfile: globalSelectedProfile }) {
  const [selectedProfile, setSelectedProfile] = useState(globalSelectedProfile);
  const [performanceData, setPerformanceData] = useState(null);
  const [performanceAnalysis, setPerformanceAnalysis] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasGeneratedData, setHasGeneratedData] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNews();
  }, []);

  // Sync with global selected profile
  useEffect(() => {
    if (globalSelectedProfile) {
      setSelectedProfile(globalSelectedProfile);
      loadAnalysisData(globalSelectedProfile.nip);
    }
  }, [globalSelectedProfile, currentView]);

  const loadNews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/performance/news', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNews(data.news);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    }
  };

  const loadAnalysisData = async (nip) => {
    if (!nip) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Load performance analysis
      const response = await fetch('/api/performance/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nip })
      });

      if (response.ok) {
        const data = await response.json();
        setPerformanceAnalysis(data.analysis);
        setPerformanceData(data.performanceData);
        setHasGeneratedData(true);
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
      setHasGeneratedData(false);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceQuadrantOption = () => {
    if (!performanceAnalysis) return {};

    const { quadrant } = performanceAnalysis;

    return {
      title: {
        text: 'Performance Quadrant',
        left: 'center',
        textStyle: { color: '#e2e8f0', fontSize: 16, fontWeight: 'bold' }
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        name: 'Performance Score',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        name: 'Potential Score',
        nameLocation: 'middle',
        nameGap: 40,
        axisLabel: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      series: [
        {
          type: 'scatter',
          symbolSize: 60,
          data: [[quadrant.x, quadrant.y]],
          itemStyle: {
            color: '#06b6d4',
            shadowBlur: 15,
            shadowColor: 'rgba(6, 182, 212, 0.5)'
          },
          label: {
            show: true,
            formatter: quadrant.category,
            color: '#fff',
            fontSize: 10
          },
          markLine: {
            lineStyle: { type: 'dashed', color: '#475569' },
            data: [
              { xAxis: 50 },
              { yAxis: 50 }
            ]
          }
        }
      ],
      backgroundColor: 'transparent',
      grid: { left: '15%', right: '5%', top: '15%', bottom: '15%' }
    };
  };

  const getScoreBreakdownOption = () => {
    if (!performanceData) return {};

    const scores = performanceData.scores;
    const categories = Object.keys(scores);
    const values = Object.values(scores);

    return {
      title: {
        text: 'Score Breakdown',
        left: 'center',
        textStyle: { color: '#e2e8f0', fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      xAxis: {
        type: 'category',
        data: categories.map(c => c.replace(/([A-Z])/g, ' $1').trim()),
        axisLabel: {
          rotate: 30,
          color: '#94a3b8',
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      series: [
        {
          type: 'bar',
          data: values,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#06b6d4' }
              ]
            },
            shadowBlur: 10,
            shadowColor: 'rgba(59, 130, 246, 0.3)'
          },
          label: {
            show: true,
            position: 'top',
            color: '#94a3b8',
            fontSize: 11
          }
        }
      ],
      backgroundColor: 'transparent',
      grid: { left: '10%', right: '5%', top: '15%', bottom: '25%' }
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data analisis kinerja...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {currentView === 'performance-overview' && 'Overview Kinerja'}
            {currentView === 'performance-classification' && 'Klasifikasi Kinerja'}
            {currentView === 'performance-strengths' && 'Kekuatan'}
            {currentView === 'performance-improvements' && 'Area Perbaikan'}
            {currentView === 'performance-recommendations' && 'Rekomendasi Pengembangan'}
            {currentView === 'performance-trends' && 'Trend & News ASN'}
            {currentView === 'performance-assessment' && 'Penilaian Kinerja'}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Hasil analisis kinerja berbasis AI untuk pegawai ASN
          </p>
        </div>
      </div>

      {/* Profile Card with 3D effect */}
      {selectedProfile && (
        <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl shadow-cyan-500/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 text-sm md:text-base">
            <div>
              <p className="text-xs md:text-sm text-slate-400 mb-1">Nama</p>
              <p className="font-semibold text-foreground">{selectedProfile.name}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-400 mb-1">Jabatan</p>
              <p className="font-semibold text-foreground">{selectedProfile.position}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-400 mb-1">Instansi</p>
              <p className="font-semibold text-foreground">{selectedProfile.agency}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-400 mb-1">Performance Score</p>
              <p className="text-lg md:text-xl font-bold text-cyan-400">{selectedProfile.performanceScore}/100</p>
            </div>
          </div>
        </Card>
      )}

      {/* NO DATA STATE */}
      {!hasGeneratedData && currentView !== 'performance-trends' && (
        <Card className="p-8 md:p-12 bg-gradient-to-br from-slate-900/30 to-slate-800/30 border-slate-700 shadow-lg">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Belum Ada Data Analisis</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              Silakan generate analisis kinerja terlebih dahulu di menu <span className="font-semibold text-cyan-500">Input Data</span>
            </p>
            <div className="inline-block p-3 md:p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <p className="text-xs md:text-sm text-cyan-400">
                <Activity className="w-4 h-4 inline mr-2" />
                Klik "Generate Analisis Kinerja" untuk memulai
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* PERFORMANCE OVERVIEW */}
      {currentView === 'performance-overview' && performanceAnalysis && hasGeneratedData && (
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Quadrant Chart */}
          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl shadow-blue-500/10">
            <ReactECharts
              option={getPerformanceQuadrantOption()}
              style={{ height: '350px' }}
              theme="dark"
            />
          </Card>

          {/* Score Breakdown */}
          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl shadow-cyan-500/10">
            <ReactECharts
              option={getScoreBreakdownOption()}
              style={{ height: '350px' }}
              theme="dark"
            />
          </Card>

          {/* Performance Data Card */}
          {performanceData && (
            <Card className="p-4 md:p-6 md:col-span-2 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-700/30 shadow-lg">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Data Kinerja</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-slate-800/50 rounded-lg shadow-inner">
                  <p className="text-xs text-slate-400 mb-1">Metode Penilaian</p>
                  <p className="text-sm font-semibold text-foreground">{performanceData.assessmentMethod}</p>
                </div>
                <div className="p-3 md:p-4 bg-slate-800/50 rounded-lg shadow-inner">
                  <p className="text-xs text-slate-400 mb-1">Total Score</p>
                  <p className="text-xl md:text-2xl font-bold text-cyan-400">{performanceData.totalScore}</p>
                </div>
                <div className="p-3 md:p-4 bg-slate-800/50 rounded-lg shadow-inner">
                  <p className="text-xs text-slate-400 mb-1">Predikat</p>
                  <p className="text-sm font-semibold text-green-400">{performanceData.predicate}</p>
                </div>
                <div className="p-3 md:p-4 bg-slate-800/50 rounded-lg shadow-inner">
                  <p className="text-xs text-slate-400 mb-1">Periode</p>
                  <p className="text-xs font-medium text-foreground">{performanceData.period}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* CLASSIFICATION */}
      {currentView === 'performance-classification' && performanceAnalysis && hasGeneratedData && (
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl shadow-cyan-500/10">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Klasifikasi</h3>
            <div className="space-y-4">
              <div className="p-4 md:p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                <p className="text-xs md:text-sm text-slate-400 mb-2">Classification</p>
                <p className="text-2xl md:text-3xl font-bold text-cyan-400">{performanceAnalysis.classification}</p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg shadow-inner">
                <p className="text-sm font-medium text-foreground mb-2">Quadrant Category</p>
                <p className="text-base md:text-lg font-semibold text-cyan-300">{performanceAnalysis.quadrant.category}</p>
                <p className="text-xs md:text-sm text-slate-400 mt-2">{performanceAnalysis.quadrant.description}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl shadow-blue-500/10">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Performance Trend</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg shadow-inner">
                {performanceAnalysis.trends.direction === 'improving' && (
                  <TrendingUp className="w-8 h-8 text-green-400" />
                )}
                {performanceAnalysis.trends.direction === 'stable' && (
                  <Activity className="w-8 h-8 text-blue-400" />
                )}
                {performanceAnalysis.trends.direction === 'declining' && (
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                )}
                <div>
                  <p className="font-semibold text-foreground capitalize">{performanceAnalysis.trends.direction}</p>
                  <p className="text-xs md:text-sm text-slate-400">{performanceAnalysis.trends.analysis}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* STRENGTHS */}
      {currentView === 'performance-strengths' && performanceAnalysis && hasGeneratedData && (
        <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            <h3 className="text-base md:text-lg font-semibold text-foreground">Kekuatan</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {performanceAnalysis.strengths.map((strength, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20 shadow-lg shadow-green-500/10">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-foreground text-sm md:text-base">{strength.area}</p>
                  <span className="text-base md:text-lg font-bold text-green-400">{strength.score}%</span>
                </div>
                <p className="text-xs md:text-sm text-slate-400">{strength.evidence}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* IMPROVEMENTS */}
      {currentView === 'performance-improvements' && performanceAnalysis && hasGeneratedData && (
        <div className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
              <h3 className="text-base md:text-lg font-semibold text-foreground">Area Perbaikan</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              {performanceAnalysis.weaknesses.map((weakness, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-foreground text-sm md:text-base">{weakness.area}</p>
                    <span className="text-base md:text-lg font-bold text-yellow-400">{weakness.score}%</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400">{weakness.impact}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Risk Factors */}
          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
              <h3 className="text-base md:text-lg font-semibold text-foreground">Risk Factors</h3>
            </div>
            <div className="space-y-3">
              {performanceAnalysis.riskFactors.map((risk, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20 shadow-lg shadow-red-500/10">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-foreground text-sm md:text-base">{risk.factor}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      risk.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                      risk.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400">{risk.mitigation}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* RECOMMENDATIONS */}
      {currentView === 'performance-recommendations' && performanceAnalysis && hasGeneratedData && (
        <div className="space-y-4 md:space-y-6">
          {/* Technical Recommendations */}
          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl shadow-blue-500/10">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Rekomendasi Teknis</h3>
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              {performanceAnalysis.recommendations.technical.map((rec, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20 shadow-lg shadow-blue-500/10">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-foreground text-sm md:text-base">{rec.action}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                      rec.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Timeline: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Non-Technical Recommendations */}
          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl shadow-purple-500/10">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Rekomendasi Non-Teknis</h3>
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              {performanceAnalysis.recommendations.nonTechnical.map((rec, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20 shadow-lg shadow-purple-500/10">
                  <p className="font-medium text-foreground mb-1 text-sm md:text-base">{rec.action}</p>
                  <p className="text-xs text-purple-400 mb-2">Type: {rec.type}</p>
                  <p className="text-xs md:text-sm text-slate-400">{rec.benefit}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Development Plan */}
          <Card className="p-4 md:p-6 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-700/30 shadow-xl shadow-cyan-500/10">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Rencana Pengembangan (Quarterly)</h3>
            <div className="grid md:grid-cols-4 gap-3 md:gap-4">
              {performanceAnalysis.developmentPlan.map((plan, idx) => (
                <div key={idx} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 shadow-inner">
                  <p className="font-semibold text-cyan-400 mb-2 text-sm">{plan.quarter}</p>
                  <p className="text-xs md:text-sm font-medium text-foreground mb-2">Focus: {plan.focus}</p>
                  <ul className="space-y-1">
                    {plan.activities.map((activity, actIdx) => (
                      <li key={actIdx} className="text-xs text-slate-400 flex items-start">
                        <span className="text-cyan-400 mr-1">•</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TRENDS & NEWS */}
      {currentView === 'performance-trends' && news.length > 0 && (
        <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Newspaper className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
            <h3 className="text-base md:text-lg font-semibold text-foreground">Berita & Trend ASN Terkini</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {news.map((item, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20 hover:border-cyan-500/40 transition-all shadow-lg hover:shadow-cyan-500/20">
                <p className="font-medium text-foreground mb-2 text-sm md:text-base">{item.title}</p>
                <p className="text-xs md:text-sm text-slate-400 mb-2 line-clamp-2">{item.summary}</p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{item.source}</span>
                  <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
