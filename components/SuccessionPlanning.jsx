'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Briefcase,
  Calendar
} from 'lucide-react';

export default function SuccessionPlanning({ selectedProfile }) {
  const [successionData, setSuccessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedProfile) {
      loadSuccessionPlan();
    }
  }, [selectedProfile]);

  const loadSuccessionPlan = async () => {
    if (!selectedProfile) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/talent/succession-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nip: selectedProfile.nip })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessionData(data.succession);
      }
    } catch (error) {
      console.error('Error loading succession plan:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat rencana suksesi',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Users className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Pilih pegawai untuk melihat rencana suksesi</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat rencana suksesi...</p>
        </div>
      </div>
    );
  }

  if (!successionData) {
    return null;
  }

  const readinessColor = {
    'Ready Now': 'bg-green-500',
    'Ready in 1-2 Years': 'bg-blue-500',
    'Ready in 3-5 Years': 'bg-orange-500',
    'Not Ready': 'bg-red-500'
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Succession Planning
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Rencana suksesi dan pengembangan karier berbasis Permenpan RB No. 3/2020
        </p>
      </div>

      {/* Profile Summary */}
      <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">{selectedProfile.name}</h2>
            <p className="text-sm text-muted-foreground">{selectedProfile.position}</p>
            <p className="text-xs text-muted-foreground">{selectedProfile.agency}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs md:text-sm">NIP: {selectedProfile.nip}</Badge>
            <Badge className={`${readinessColor[successionData?.readinessLevel] || 'bg-gray-500'} text-white text-xs md:text-sm`}>
              {successionData?.readinessLevel || 'N/A'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Key Positions for Succession */}
      <Card className="p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Posisi Strategis untuk Suksesi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {successionData?.targetPositions?.map((position, idx) => (
            <Card key={idx} className="p-4 hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm md:text-base text-foreground">{position.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">{position.department}</p>
                </div>
                <Badge variant={position.priority === 'High' ? 'destructive' : position.priority === 'Medium' ? 'default' : 'secondary'} className="text-xs">
                  {position.priority}
                </Badge>
              </div>
              
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-muted-foreground">Target: {position.targetDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Kesesuaian: {position.fitScore}%</span>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold text-foreground mb-2">Gap Kompetensi:</p>
                <div className="flex flex-wrap gap-1">
                  {position.competencyGaps?.map((gap, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {gap}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Development Roadmap */}
      <Card className="p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Roadmap Pengembangan
        </h3>

        <div className="space-y-4">
          {successionData?.developmentPlan?.map((phase, idx) => (
            <div key={idx} className="relative pl-8 pb-6 border-l-2 border-blue-300 dark:border-blue-700 last:border-l-0 last:pb-0">
              <div className="absolute left-0 top-0 -ml-2 w-4 h-4 rounded-full bg-blue-500"></div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                  <h4 className="font-semibold text-sm md:text-base text-foreground">{phase.phase}</h4>
                  <Badge variant="outline" className="text-xs w-fit">{phase.timeline}</Badge>
                </div>

                <div className="space-y-2 text-xs md:text-sm">
                  {phase.activities?.map((activity, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{activity}</span>
                    </div>
                  ))}
                </div>

                {phase.expectedOutcome && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Expected Outcome:</p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">{phase.expectedOutcome}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Succession Pool */}
      <Card className="p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-500" />
          Kelompok Suksesi (Succession Pool)
        </h3>

        <p className="text-xs md:text-sm text-muted-foreground mb-4">
          Pegawai dalam kelompok suksesi yang sama untuk posisi strategis di {selectedProfile.agency}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {successionData?.successionPool?.map((candidate, idx) => (
            <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm md:text-base">
                  {candidate.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-foreground truncate">{candidate.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{candidate.currentPosition}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Performance:</span>
                  <Badge variant="outline" className="text-xs">{candidate.performanceScore}/100</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Potential:</span>
                  <Badge variant="outline" className="text-xs">{candidate.potentialLevel}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Readiness:</span>
                  <Badge className={`${readinessColor[candidate.readiness]} text-white text-xs`}>
                    {candidate.readiness}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Action Required */}
      {successionData?.actionRequired && successionData.actionRequired.length > 0 && (
        <Card className="p-4 md:p-6 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
          <h3 className="text-base md:text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Tindakan yang Diperlukan
          </h3>

          <ul className="space-y-2 text-xs md:text-sm">
            {successionData.actionRequired.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-yellow-800 dark:text-yellow-300">{action}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Compliance Info */}
      <Card className="p-4 md:p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm md:text-base text-green-800 dark:text-green-400 mb-2">
              Kepatuhan Permenpan RB No. 3 Tahun 2020
            </h4>
            <p className="text-xs md:text-sm text-green-700 dark:text-green-300">
              Succession planning ini mengikuti prinsip <strong>Akuisisi</strong> dan <strong>Pengembangan Talenta</strong> 
              sesuai dengan Permenpan RB No. 3 Tahun 2020 tentang Manajemen Talenta ASN. Fokus pada merit system, 
              objektif, terencana, dan bebas dari intervensi politik.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
