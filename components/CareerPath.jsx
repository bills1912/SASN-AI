'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, Target, Award, BookOpen, ExternalLink, 
  CheckCircle, Clock, Sparkles, RefreshCw, X, ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CareerPath({ user }) {
  const [careerPath, setCareerPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCareerPath();
  }, []);

  const fetchCareerPath = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/career-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nip: user.nip })
      });

      const data = await response.json();
      
      if (data.success) {
        setCareerPath(data.careerPath);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching career path:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat career path',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const regenerateCareerPath = async () => {
    setGenerating(true);
    await fetchCareerPath();
    setGenerating(false);
    toast({
      title: 'Career Path Updated',
      description: 'Career path Anda telah diperbarui dengan rekomendasi terbaru',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Generating personalized career path...</p>
        </div>
      </div>
    );
  }

  if (!careerPath) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Gagal memuat career path</p>
        <Button onClick={fetchCareerPath} className="mt-4">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Career Path Personalized
          </h1>
          <p className="text-muted-foreground">
            Roadmap pengembangan karir berdasarkan analisis AI & talent mapping
          </p>
        </div>
        <Button
          onClick={regenerateCareerPath}
          disabled={generating}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Regenerate'}
        </Button>
      </div>

      {/* Current Status Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/50">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Posisi Saat Ini</h2>
            <p className="text-sm text-muted-foreground">Status talent & jabatan Anda</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-muted-foreground mb-1">Jabatan</p>
            <p className="text-lg font-bold text-foreground">{careerPath.currentPosition}</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-muted-foreground mb-1">Grade</p>
            <p className="text-lg font-bold text-foreground">{careerPath.currentLevel}</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-muted-foreground mb-1">Talent Box</p>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/50">
              {careerPath.talentBox}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Vertical Career Timeline with Curved Path */}
      <div className="relative py-12 px-4 md:px-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-2xl overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        {/* START Badge */}
        <div className="relative z-10 flex justify-center mb-8">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-xl border-4 border-white dark:border-slate-900">
            <span className="text-white text-lg font-bold">START</span>
          </div>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Center Line - Curved Path with SVG */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 hidden md:block">
            <svg className="absolute inset-0 w-full h-full" style={{ left: '-50px', width: '100px' }}>
              <defs>
                <linearGradient id="pathGradientVertical" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  <stop offset="25%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                  <stop offset="75%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              
              {/* Curved S-path */}
              <path
                d="M 50,0 Q 50,100 80,200 T 50,400 Q 20,600 50,800 T 50,1200"
                stroke="url(#pathGradientVertical)"
                strokeWidth="6"
                fill="none"
                opacity="0.8"
                strokeDasharray="15,10"
                className="drop-shadow-lg"
              />
            </svg>
          </div>

          {/* Timeline Items */}
          <div className="space-y-16 md:space-y-24">
            {careerPath.stages.map((stage, index) => (
              <div 
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col gap-8`}
              >
                {/* Card */}
                <div className="w-full md:w-5/12">
                  <div 
                    className="cursor-pointer transform hover:scale-105 transition-all duration-300"
                    onClick={() => setSelectedStage(stage)}
                  >
                    <div className="relative group">
                      <div className={`absolute -inset-2 bg-gradient-to-r ${
                        index === 0 ? 'from-blue-500 to-cyan-500' :
                        index === 1 ? 'from-purple-500 to-pink-500' :
                        index === 2 ? 'from-cyan-500 to-teal-500' :
                        'from-amber-500 to-orange-500'
                      } rounded-2xl blur-xl opacity-30 group-hover:opacity-50 animate-pulse`}></div>
                      
                      <Card className={`relative p-6 shadow-xl border-2 ${
                        index === 0 ? 'border-blue-300 dark:border-blue-700' :
                        index === 1 ? 'border-purple-300 dark:border-purple-700' :
                        index === 2 ? 'border-cyan-300 dark:border-cyan-700' :
                        'border-amber-300 dark:border-amber-700'
                      } backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 hover:shadow-2xl transition-all duration-300`}>
                        <Badge className={`mb-3 bg-gradient-to-r ${
                          index === 0 ? 'from-blue-500 to-cyan-500' :
                          index === 1 ? 'from-purple-500 to-pink-500' :
                          index === 2 ? 'from-cyan-500 to-teal-500' :
                          'from-amber-500 to-orange-500'
                        } shadow-lg`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {stage.year}
                        </Badge>
                        <h3 className="font-bold text-xl mb-2 text-foreground">{stage.position}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{stage.level}</p>
                        <div className={`flex items-center gap-2 text-sm mb-4 ${
                          index === 0 ? 'text-blue-500' :
                          index === 1 ? 'text-purple-500' :
                          index === 2 ? 'text-cyan-500' :
                          'text-amber-500'
                        }`}>
                          <Sparkles className="w-4 h-4" />
                          <span className="font-semibold">{stage.focus}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {stage.skills.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="link" className={`p-0 h-auto text-sm ${
                          index === 0 ? 'text-blue-500 hover:text-blue-700' :
                          index === 1 ? 'text-purple-500 hover:text-purple-700' :
                          index === 2 ? 'text-cyan-500 hover:text-cyan-700' :
                          'text-amber-500 hover:text-amber-700'
                        }`}>
                          Lihat detail lengkap <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-1/2 -translate-x-1/2 z-20 hidden md:block">
                  <div className="relative">
                    <div className={`absolute -inset-3 bg-gradient-to-r ${
                      index === 0 ? 'from-blue-500 to-cyan-500' :
                      index === 1 ? 'from-purple-500 to-pink-500' :
                      index === 2 ? 'from-cyan-500 to-teal-500' :
                      'from-amber-500 to-orange-500'
                    } rounded-full blur-xl opacity-50 animate-pulse`}></div>
                    
                    <div className={`relative bg-gradient-to-br ${
                      index === 0 ? 'from-blue-500 via-blue-600 to-cyan-500' :
                      index === 1 ? 'from-purple-500 via-purple-600 to-pink-500' :
                      index === 2 ? 'from-cyan-500 via-cyan-600 to-teal-500' :
                      'from-amber-500 via-amber-600 to-orange-500'
                    } w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-900`}>
                      <span className="text-white text-2xl font-bold">{index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Spacer for opposite side */}
                <div className="w-full md:w-5/12 hidden md:block"></div>

                {/* Mobile Number Badge */}
                <div className="md:hidden absolute -top-4 left-4">
                  <div className={`bg-gradient-to-br ${
                    index === 0 ? 'from-blue-500 via-blue-600 to-cyan-500' :
                    index === 1 ? 'from-purple-500 via-purple-600 to-pink-500' :
                    index === 2 ? 'from-cyan-500 via-cyan-600 to-teal-500' :
                    'from-amber-500 via-amber-600 to-orange-500'
                  } w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-900`}>
                    <span className="text-white text-lg font-bold">{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FINISH Badge */}
        <div className="relative z-10 flex justify-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-xl border-4 border-white dark:border-slate-900">
            <span className="text-white text-lg font-bold">FINISH</span>
          </div>
        </div>
      </div>

      {/* Key Milestones */}
      <Card className="p-6 border-2 border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-lg shadow-amber-500/50">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Key Milestones</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {careerPath.keyMilestones.map((milestone, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{milestone}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Success Metrics */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg shadow-green-500/50">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Success Metrics</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {careerPath.successMetrics.map((metric, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-green-200 dark:border-green-800">
              <Target className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{metric}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedStage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge variant="outline" className="mb-2 border-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedStage.year}
                  </Badge>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {selectedStage.position}
                  </h2>
                  <p className="text-muted-foreground">{selectedStage.level}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedStage(null)}
                  className="hover:bg-destructive/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Focus Area */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-foreground">{selectedStage.focus}</h3>
                </div>
                <p className="text-foreground">{selectedStage.description}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Skills to Master
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStage.skills.map((skill, idx) => (
                    <Badge key={idx} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Training */}
              <div className="mb-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  Required Training
                </h3>
                <div className="space-y-2">
                  {selectedStage.training.map((train, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <CheckCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-foreground font-medium">{train}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-green-500" />
                  Learning Resources
                </h3>
                <div className="space-y-3">
                  {selectedStage.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs border-2">
                              {resource.type}
                            </Badge>
                            <span className="font-semibold text-foreground">{resource.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{resource.url}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
