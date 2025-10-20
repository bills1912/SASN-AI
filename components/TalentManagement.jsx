'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp, Award, Target, Code2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function TalentManagement({ user }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedNIP, setSelectedNIP] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [talentMapping, setTalentMapping] = useState(null);
  const [skillAnalysis, setSkillAnalysis] = useState(null);
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

  const loadProfile = async (nip) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/talent/profile/${nip}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedProfile(data.profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const generateTalentMapping = async () => {
    if (!selectedNIP) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/talent-mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nip: selectedNIP })
      });

      const data = await response.json();

      if (response.ok) {
        setTalentMapping(data.mapping);
        setSelectedProfile(data.profile);
        toast({
          title: 'Pemetaan Talenta Berhasil',
          description: 'Analisis talenta telah selesai dilakukan',
        });
      } else {
        throw new Error(data.error || 'Gagal generate talent mapping');
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

  const generateSkillAnalysis = async () => {
    if (!selectedNIP) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/skill-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nip: selectedNIP })
      });

      const data = await response.json();

      if (response.ok) {
        setSkillAnalysis(data.analysis);
        setSelectedProfile(data.profile);
        toast({
          title: 'Analisis Skill Berhasil',
          description: 'Analisis skill telah selesai dilakukan',
        });
      } else {
        throw new Error(data.error || 'Gagal generate skill analysis');
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

  useEffect(() => {
    if (selectedNIP) {
      loadProfile(selectedNIP);
    }
  }, [selectedNIP]);

  const get9BoxChartOption = () => {
    if (!talentMapping) return {};

    const { performance, potential, quadrant } = talentMapping;

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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Manajemen Talenta</h1>
          <p className="text-muted-foreground">
            Pemetaan talenta berbasis AI dengan analisis mendalam menggunakan 9-Box Grid Matrix
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

      {/* Profile Summary */}
      {selectedProfile && (
        <Card className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nama</p>
              <p className="font-semibold text-foreground">{selectedProfile.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Jabatan</p>
              <p className="font-semibold text-foreground">{selectedProfile.position}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Instansi</p>
              <p className="font-semibold text-foreground">{selectedProfile.agency}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Performance Score</p>
              <p className="font-semibold text-foreground">{selectedProfile.performanceScore}/100</p>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={generateTalentMapping} disabled={loading || !selectedNIP}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Target className="w-4 h-4 mr-2" />}
          Generate Pemetaan Talenta
        </Button>
        <Button onClick={generateSkillAnalysis} disabled={loading || !selectedNIP} variant="outline">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Code2 className="w-4 h-4 mr-2" />}
          Analisis Skill
        </Button>
      </div>

      {/* Talent Mapping Results */}
      {talentMapping && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* 9-Box Grid */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">9-Box Talent Matrix</h3>
            <ReactECharts
              option={get9BoxChartOption()}
              style={{ height: '400px' }}
              theme="dark"
            />
          </Card>

          {/* Talent Box Classification */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Klasifikasi Talenta</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
                <p className="text-sm text-muted-foreground mb-1">Talent Box</p>
                <p className="text-2xl font-bold text-blue-400">{talentMapping.talentBox}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Performance</p>
                  <p className="text-lg font-semibold text-foreground">{talentMapping.performance.level}</p>
                  <p className="text-xs text-muted-foreground mt-1">{talentMapping.performance.justification}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Potential</p>
                  <p className="text-lg font-semibold text-foreground">{talentMapping.potential.level}</p>
                  <p className="text-xs text-muted-foreground mt-1">{talentMapping.potential.justification}</p>
                </div>
              </div>

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

          {/* Career Path */}
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

          {/* Suitable Positions */}
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

          {/* Development Areas */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Area Pengembangan</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {talentMapping.developmentAreas.map((area, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-foreground">{area}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Recommendations */}
          <Card className="p-6 md:col-span-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rekomendasi AI</h3>
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

      {/* Skill Analysis Results */}
      {skillAnalysis && (
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
    </div>
  );
}