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
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-500 rounded-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Posisi Saat Ini</h2>
            <p className="text-sm text-muted-foreground">Status talent & jabatan Anda</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Jabatan</p>
            <p className="text-lg font-bold text-foreground">{careerPath.currentPosition}</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Grade</p>
            <p className="text-lg font-bold text-foreground">{careerPath.currentLevel}</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Talent Box</p>
            <Badge className="bg-blue-500 hover:bg-blue-600">
              {careerPath.talentBox}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Interactive Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 hidden md:block"></div>

        {/* Career Stages */}
        <div className="space-y-6">
          {careerPath.stages.map((stage, index) => (
            <Card
              key={stage.id}
              className={`relative p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedStage?.id === stage.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedStage(stage)}
            >
              {/* Timeline Dot */}
              <div className="absolute left-[-42px] top-8 w-8 h-8 bg-blue-500 rounded-full border-4 border-background hidden md:flex items-center justify-center">
                <span className="text-white text-xs font-bold">{stage.id}</span>
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="md:hidden flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                    <span className="text-white text-xs font-bold">{stage.id}</span>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {stage.year}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground">{stage.position}</h3>
                    <p className="text-sm text-muted-foreground">{stage.level}</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                  selectedStage?.id === stage.id ? 'rotate-90' : ''
                }`} />
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold text-foreground">{stage.focus}</span>
                </div>
                <p className="text-muted-foreground text-sm">{stage.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Skills to Develop:</p>
                  <div className="flex flex-wrap gap-2">
                    {stage.skills.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {stage.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{stage.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Training Needed:</p>
                  <div className="flex flex-wrap gap-2">
                    {stage.training.slice(0, 2).map((train, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {train}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Click to expand indicator */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Click to view detailed resources & recommendations
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Milestones */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold text-foreground">Key Milestones</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {careerPath.keyMilestones.map((milestone, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{milestone}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Success Metrics */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-bold text-foreground">Success Metrics</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {careerPath.successMetrics.map((metric, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-white/50 dark:bg-slate-900/50 rounded-lg">
              <Target className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{metric}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedStage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge variant="outline" className="mb-2">
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
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Focus Area */}
              <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-foreground">{selectedStage.focus}</h3>
                </div>
                <p className="text-foreground">{selectedStage.description}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="font-bold text-foreground mb-3">Skills to Master</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStage.skills.map((skill, idx) => (
                    <Badge key={idx} className="bg-blue-500 hover:bg-blue-600">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Training */}
              <div className="mb-6">
                <h3 className="font-bold text-foreground mb-3">Required Training</h3>
                <div className="space-y-2">
                  {selectedStage.training.map((train, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <BookOpen className="w-4 h-4 text-orange-500" />
                      <span className="text-foreground">{train}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-bold text-foreground mb-3">Learning Resources</h3>
                <div className="space-y-3">
                  {selectedStage.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {resource.type}
                            </Badge>
                            <span className="font-semibold text-foreground">{resource.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{resource.url}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
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
