'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2, Newspaper } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function PerformanceAssessment({ user }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedNIP, setSelectedNIP] = useState('');
  const [performanceData, setPerformanceData] = useState(null);
  const [performanceAnalysis, setPerformanceAnalysis] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
    loadNews();
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

  const analyzePerformance = async () => {
    if (!selectedNIP) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/performance/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nip: selectedNIP })
      });

      const data = await response.json();

      if (response.ok) {
        setPerformanceAnalysis(data.analysis);
        setPerformanceData(data.performanceData);
        toast({
          title: 'Analisis Kinerja Berhasil',
          description: 'Analisis kinerja telah selesai dilakukan',
        });
      } else {
        throw new Error(data.error || 'Gagal menganalisis kinerja');
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

  const getPerformanceQuadrantOption = () => {
    if (!performanceAnalysis) return {};

    const { quadrant } = performanceAnalysis;

    return {
      title: {
        text: 'Performance Quadrant',
        left: 'center',
        textStyle: { color: '#e2e8f0' }
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
            shadowBlur: 10,
            shadowColor: '#06b6d4'
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

  const getPerformanceScoresOption = () => {
    if (!performanceData) return {};

    const scores = performanceData.scores;
    const categories = Object.keys(scores);
    const values = Object.values(scores);

    return {
      title: {
        text: 'Performance Scores Breakdown',
        left: 'center',
        textStyle: { color: '#e2e8f0' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      xAxis: {
        type: 'category',
        data: categories.map(c => c.replace(/([A-Z])/g, ' $1').trim()),
        axisLabel: {
          rotate: 45,
          color: '#94a3b8'
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
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#06b6d4' }
            ])
          },
          label: {
            show: true,
            position: 'top',
            color: '#94a3b8'
          }
        }
      ],
      backgroundColor: 'transparent',
      grid: { left: '10%', right: '5%', top: '15%', bottom: '25%' }
    };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Penilaian Kinerja</h1>
          <p className="text-muted-foreground">
            Analisis kinerja pegawai berbasis AI dengan klasifikasi mendalam dan rekomendasi pengembangan
          </p>
        </div>
        <Select value={selectedNIP} onValueChange={setSelectedNIP}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Pilih ASN" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map(profile => (
              <SelectItem key={profile.nip} value={profile.nip}>
                {profile.name} - {profile.nip}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Button */}
      <Button onClick={analyzePerformance} disabled={loading || !selectedNIP}>
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
        Analisis Kinerja dengan AI
      </Button>

      {/* Performance Data */}
      {performanceData && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Data Kinerja</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Instansi</p>
              <p className="font-semibold text-foreground">{performanceData.agency}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Metode Penilaian</p>
              <p className="font-semibold text-foreground">{performanceData.assessmentMethod}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Score</p>
              <p className="text-2xl font-bold text-blue-400">{performanceData.totalScore}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Predikat</p>
              <p className="font-semibold text-green-400">{performanceData.predicate}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Performance Analysis */}
      {performanceAnalysis && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Performance Quadrant */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Performance Quadrant</h3>
            <ReactECharts
              option={getPerformanceQuadrantOption()}
              style={{ height: '400px' }}
              theme="dark"
            />
          </Card>

          {/* Performance Scores */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Score Breakdown</h3>
            <ReactECharts
              option={getPerformanceScoresOption()}
              style={{ height: '400px' }}
              theme="dark"
            />
          </Card>

          {/* Classification */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Klasifikasi Kinerja</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                <p className="text-sm text-muted-foreground mb-1">Classification</p>
                <p className="text-2xl font-bold text-cyan-400">{performanceAnalysis.classification}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Quadrant Category</p>
                <p className="text-lg font-semibold text-foreground">{performanceAnalysis.quadrant.category}</p>
                <p className="text-sm text-muted-foreground mt-2">{performanceAnalysis.quadrant.description}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Trend Direction</p>
                <div className="flex items-center space-x-2">
                  {performanceAnalysis.trends.direction === 'improving' && (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  )}
                  {performanceAnalysis.trends.direction === 'stable' && (
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  )}
                  {performanceAnalysis.trends.direction === 'declining' && (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <p className="text-lg font-semibold text-foreground capitalize">{performanceAnalysis.trends.direction}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{performanceAnalysis.trends.analysis}</p>
              </div>
            </div>
          </Card>

          {/* Strengths */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-foreground">Kekuatan</h3>
            </div>
            <div className="space-y-3">
              {performanceAnalysis.strengths.map((strength, idx) => (
                <div key={idx} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-foreground">{strength.area}</p>
                    <span className="text-sm font-semibold text-green-400">{strength.score}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{strength.evidence}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Weaknesses */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-foreground">Area Perbaikan</h3>
            </div>
            <div className="space-y-3">
              {performanceAnalysis.weaknesses.map((weakness, idx) => (
                <div key={idx} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-foreground">{weakness.area}</p>
                    <span className="text-sm font-semibold text-yellow-400">{weakness.score}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{weakness.impact}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Risk Factors */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-foreground">Risk Factors</h3>
            </div>
            <div className="space-y-3">
              {performanceAnalysis.riskFactors.map((risk, idx) => (
                <div key={idx} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-foreground">{risk.factor}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      risk.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                      risk.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Technical Recommendations */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rekomendasi Pengembangan Teknis</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {performanceAnalysis.recommendations.technical.map((rec, idx) => (
                <div key={idx} className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-foreground">{rec.action}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                      rec.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Timeline: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Non-Technical Recommendations */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rekomendasi Pengembangan Non-Teknis</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {performanceAnalysis.recommendations.nonTechnical.map((rec, idx) => (
                <div key={idx} className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="font-medium text-foreground mb-1">{rec.action}</p>
                  <p className="text-xs text-purple-400 mb-2">Type: {rec.type}</p>
                  <p className="text-sm text-muted-foreground">{rec.benefit}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Development Plan */}
          <Card className="p-6 md:col-span-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rencana Pengembangan (Quarterly)</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {performanceAnalysis.developmentPlan.map((plan, idx) => (
                <div key={idx} className="p-4 bg-background/50 rounded-lg border border-border">
                  <p className="font-semibold text-blue-400 mb-2">{plan.quarter}</p>
                  <p className="text-sm font-medium text-foreground mb-2">Focus: {plan.focus}</p>
                  <ul className="space-y-1">
                    {plan.activities.map((activity, actIdx) => (
                      <li key={actIdx} className="text-xs text-muted-foreground flex items-start">
                        <span className="text-blue-400 mr-1">•</span>
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

      {/* ASN News & Trends */}
      {news.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Newspaper className="w-5 h-5 text-cyan-500" />
            <h3 className="text-lg font-semibold text-foreground">Berita & Trend ASN Terkini</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {news.map((item, idx) => (
              <div key={idx} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <p className="font-medium text-foreground mb-2">{item.title}</p>
                <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
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
