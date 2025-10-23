'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Database, BarChart3, TrendingUp, Loader2, RefreshCw, Building2, Award, Target } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function MeritSystemIndex({ user, currentView }) {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/merit/institutions-list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInstitutions(data.institutions || []);
      }
    } catch (error) {
      console.error('Error loading institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeInstitutions = async () => {
    setScraping(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/merit/scrape-institutions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Scraping Berhasil',
          description: `${data.scraped_count} institusi berhasil di-scrape`,
        });
        loadInstitutions();
      } else {
        throw new Error('Scraping failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal melakukan scraping institusi',
        variant: 'destructive'
      });
    } finally {
      setScraping(false);
    }
  };

  const getComparisonChartOption = () => {
    if (institutions.length === 0) return {};

    return {
      title: {
        text: 'Perbandingan Merit System Index',
        left: 'center',
        textStyle: { color: '#e2e8f0' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['Merit Index', 'Compliance', 'Talent Pipeline', 'Training'],
        bottom: 10,
        textStyle: { color: '#94a3b8' }
      },
      xAxis: {
        type: 'category',
        data: institutions.slice(0, 10).map(i => i.name),
        axisLabel: {
          rotate: 45,
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
          name: 'Merit Index',
          type: 'bar',
          data: institutions.slice(0, 10).map(i => i.merit_index || 0),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#8b5cf6' },
                { offset: 1, color: '#6366f1' }
              ]
            }
          }
        },
        {
          name: 'Compliance',
          type: 'line',
          data: institutions.slice(0, 10).map(i => i.compliance_score || 0),
          itemStyle: { color: '#22c55e' }
        },
        {
          name: 'Talent Pipeline',
          type: 'line',
          data: institutions.slice(0, 10).map(i => i.talent_pipeline_strength || 0),
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: 'Training',
          type: 'line',
          data: institutions.slice(0, 10).map(i => i.training_adequacy || 0),
          itemStyle: { color: '#f59e0b' }
        }
      ],
      backgroundColor: 'transparent',
      grid: { left: '10%', right: '5%', top: '15%', bottom: '25%' }
    };
  };
  const getTopInstitutionsChartOptions = () => {
    // Detect mobile screen
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // Shorten institution names for mobile
    const formatName = (name) => {
      if (!isMobile) return name;
      // Shorten long names for mobile
      const words = name.split(' ');
      if (words.length > 3) {
        return words.slice(0, 3).join(' ') + '...';
      }
      if (name.length > 25) {
        return name.substring(0, 25) + '...';
      }
      return name;
    };

    return {
      title: {
        text: 'Perbandingan Merit System Index',
        left: 'center',
        top: 10,
        textStyle: { 
          color: '#f1f5f9', 
          fontSize: isMobile ? 12 : 16 
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        confine: true, // Keep tooltip within chart container on mobile
        formatter: function(params) {
          // Show full name in tooltip
          const institution = institutions[params[0].dataIndex];
          let result = `<strong>${institution?.name || 'Unknown'}</strong><br/>`;
          params.forEach(param => {
            result += `${param.marker} ${param.seriesName}: ${param.value}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['Merit Index', 'Compliance', 'Talent Pipeline', 'Training'],
        bottom: 10,
        textStyle: { color: '#94a3b8', fontSize: isMobile ? 10 : 12 },
        orient: isMobile ? 'horizontal' : 'horizontal',
        itemGap: isMobile ? 5 : 10,
        itemWidth: isMobile ? 15 : 25
      },
      grid: {
        left: isMobile ? '5%' : '3%',
        right: isMobile ? '5%' : '4%',
        bottom: isMobile ? '20%' : '15%',
        top: isMobile ? '15%' : '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: institutions.slice(0, 10).map(i => formatName(i.name)),
        axisLabel: {
          rotate: isMobile ? 65 : 45,
          color: '#94a3b8',
          fontSize: isMobile ? 8 : 10,
          interval: 0, // Show all labels
          formatter: function(value) {
            // Further truncate if still too long on mobile
            if (isMobile && value.length > 20) {
              return value.substring(0, 18) + '...';
            }
            return value;
          }
        },
        axisLine: { lineStyle: { color: '#475569' } }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { 
          color: '#94a3b8',
          fontSize: isMobile ? 10 : 12
        },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      series: [
        {
          name: 'Merit Index',
          type: 'bar',
          data: institutions.slice(0, 10).map(i => i.merit_index || 0),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#8b5cf6' },
                { offset: 1, color: '#6366f1' }
              ]
            }
          }
        },
        {
          name: 'Compliance',
          type: 'line',
          data: institutions.slice(0, 10).map(i => i.compliance_score || 0),
          itemStyle: { color: '#22c55e' }
        },
        {
          name: 'Talent Pipeline',
          type: 'line',
          data: institutions.slice(0, 10).map(i => i.talent_pipeline_strength || 0),
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: 'Training',
          type: 'line',
          data: institutions.slice(0, 10).map(i => i.training_adequacy || 0),
          itemStyle: { color: '#f59e0b' }
        }
      ],
      backgroundColor: 'transparent'
    };
  };

  // DASHBOARD VIEW
  if (currentView === 'merit-dashboard' || currentView === 'merit-system-index') {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Merit System Index Dashboard
            </h1>
            <p className="text-muted-foreground">
              Analisis AI-based Merit System untuk Institusi Pemerintah
            </p>
          </div>
          <Button
            onClick={handleScrapeInstitutions}
            disabled={scraping}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {scraping ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Scrape Data Institusi
              </>
            )}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Institusi</p>
                <p className="text-3xl font-bold text-purple-400">{institutions.length}</p>
              </div>
              <Building2 className="w-10 h-10 text-purple-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rata-rata Merit Index</p>
                <p className="text-3xl font-bold text-blue-400">
                  {institutions.length > 0
                    ? Math.round(institutions.reduce((sum, i) => sum + (i.merit_index || 0), 0) / institutions.length)
                    : 0}
                </p>
              </div>
              <Award className="w-10 h-10 text-blue-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Compliance Tertinggi</p>
                <p className="text-3xl font-bold text-green-400">
                  {institutions.length > 0
                    ? Math.round(Math.max(...institutions.map(i => i.compliance_score || 0)))
                    : 0}
                </p>
              </div>
              <Target className="w-10 h-10 text-green-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data Tersedia</p>
                <p className="text-3xl font-bold text-orange-400">
                  {institutions.filter(i => i.merit_index > 0).length}
                </p>
              </div>
              <Database className="w-10 h-10 text-orange-400" />
            </div>
          </Card>
        </div>

        {/* Comparison Chart */}
        {institutions.length > 0 ? (
          <Card className="p-6">
            <ReactECharts
              option={getComparisonChartOption()}
              style={{ height: '400px' }}
              theme="dark"
            />
          </Card>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Data</h3>
              <p className="text-muted-foreground mb-4">
                Klik tombol "Scrape Data Institusi" untuk memulai pengumpulan data
              </p>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // INSTITUTIONS ANALYSIS VIEW
  if (currentView === 'merit-institutions') {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analisis Institusi
          </h1>
          <p className="text-muted-foreground">
            Detail analisis Merit System untuk setiap institusi
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
        ) : institutions.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {institutions.map((institution, idx) => (
              <Card key={idx} className="p-6 hover:border-purple-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {institution.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{institution.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-400">
                      {institution.merit_index || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Merit Index</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Compliance Score</span>
                      <span className="font-semibold text-green-400">{institution.compliance_score || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${institution.compliance_score || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Talent Pipeline</span>
                      <span className="font-semibold text-blue-400">{institution.talent_pipeline_strength || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${institution.talent_pipeline_strength || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Training Adequacy</span>
                      <span className="font-semibold text-orange-400">{institution.training_adequacy || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${institution.training_adequacy || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Total Pegawai:</span> {institution.employee_count || 'N/A'} | 
                    <span className="ml-2 font-medium">Confidence:</span> {institution.confidence || 0}%
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Data</h3>
              <p className="text-muted-foreground">
                Silakan scrape data institusi terlebih dahulu
              </p>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // COMPARISON VIEW
  if (currentView === 'merit-comparison') {
    const topInstitutions = [...institutions]
      .sort((a, b) => (b.merit_index || 0) - (a.merit_index || 0))
      .slice(0, 10);

    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Perbandingan Institusi
          </h1>
          <p className="text-muted-foreground">
            Ranking dan perbandingan Merit System Index
          </p>
        </div>

        {topInstitutions.length > 0 ? (
          <>
            {/* Chart */}
            <Card className="p-6">
              <ReactECharts
                option={getComparisonChartOption()}
                style={{ height: '500px' }}
                theme="dark"
              />
            </Card>

            {/* Ranking Table - Mobile Responsive */}
            <Card className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">
                Top 10 Institusi Berdasarkan Merit Index
              </h3>
              <div className="space-y-3">
                {topInstitutions.map((institution, idx) => (
                  <div
                    key={idx}
                    className="p-3 md:p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    {/* Header with Rank and Name */}
                    <div className="flex items-start space-x-3 md:space-x-4 mb-3 md:mb-0">
                      <div className={`
                        w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-base md:text-lg flex-shrink-0
                        ${idx === 0 ? 'bg-yellow-500 text-yellow-900' :
                          idx === 1 ? 'bg-slate-400 text-slate-900' :
                          idx === 2 ? 'bg-orange-600 text-orange-100' :
                          'bg-slate-700 text-slate-300'}
                      `}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm md:text-base text-foreground truncate">{institution.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{institution.type}</p>
                      </div>
                    </div>
                    
                    {/* Metrics - Stack on mobile, inline on desktop */}
                    <div className="grid grid-cols-2 md:flex md:items-center md:justify-end gap-3 md:gap-6 mt-3 md:mt-0">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-muted-foreground">Merit Index</p>
                        <p className="text-lg md:text-2xl font-bold text-purple-400">{institution.merit_index || 0}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xs text-muted-foreground">Compliance</p>
                        <p className="text-base md:text-lg font-semibold text-green-400">{institution.compliance_score || 0}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xs text-muted-foreground">Pipeline</p>
                        <p className="text-base md:text-lg font-semibold text-blue-400">{institution.talent_pipeline_strength || 0}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xs text-muted-foreground">Training</p>
                        <p className="text-base md:text-lg font-semibold text-orange-400">{institution.training_adequacy || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Data</h3>
              <p className="text-muted-foreground">
                Data perbandingan akan tersedia setelah scraping institusi
              </p>
            </div>
          </Card>
        )}
      </div>
    );
  }

  return null;
}
