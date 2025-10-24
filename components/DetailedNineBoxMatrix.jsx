'use client'

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

/**
 * Detailed 9-Box Talent Matrix Visualization
 * Shows colored grid with position marker
 */
export default function DetailedNineBoxMatrix({ performance, potential, talentBox, boxNumber, priority, className = "" }) {
  
  const getBoxColor = (boxName) => {
    if (!boxName) return 'bg-gray-500';
    if (boxName.includes('High Performer') || boxName.includes('Star')) return 'bg-green-500';
    if (boxName.includes('High Potential')) return 'bg-blue-500';
    if (boxName.includes('Solid') || boxName.includes('Core')) return 'bg-yellow-500';
    if (boxName.includes('Underperformer') || boxName.includes('Risk')) return 'bg-red-500';
    return 'bg-purple-500';
  };

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-600" />
        Visualisasi 9-Box Talent Matrix
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
          {performance?.score && potential?.score && (
            <div 
              className="absolute w-6 h-6 bg-red-600 border-4 border-white dark:border-slate-900 rounded-full shadow-lg animate-pulse z-10"
              style={{
                left: `${((potential.score - 0.5) / 3) * 100}%`,
                bottom: `${((performance.score - 0.5) / 3) * 100}%`,
                transform: 'translate(-50%, 50%)'
              }}
              title={`Performance: ${performance.score}, Potential: ${potential.score}`}
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
            <span className="text-xs text-muted-foreground">Posisi Anda</span>
          </div>
        </div>
      </div>
      
      {/* Summary Info */}
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Kategori Talenta</p>
          <Badge className={`${getBoxColor(talentBox)} text-white text-sm`}>
            {talentBox}
          </Badge>
          {boxNumber && (
            <p className="text-xs text-muted-foreground mt-2">Box #{boxNumber}</p>
          )}
        </div>
        
        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Performance Level</p>
          <p className="text-lg font-bold text-foreground">{performance?.level}</p>
          <p className="text-xs text-muted-foreground">Score: {performance?.score}/3</p>
        </div>
        
        <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Potential Level</p>
          <p className="text-lg font-bold text-foreground">{potential?.level}</p>
          <p className="text-xs text-muted-foreground">Score: {potential?.score}/3</p>
        </div>
      </div>

      {priority && (
        <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-xs text-muted-foreground">Priority Level</p>
          <p className="text-lg font-bold text-foreground">{priority}</p>
        </div>
      )}

      {/* Info about your position */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>📊 Interpretasi:</strong> Posisi Anda pada matrix menunjukkan kombinasi antara kinerja (Performance) dan potensi (Potential). 
          Semakin ke kanan dan atas, semakin tinggi nilai Anda di kedua aspek tersebut.
        </p>
      </div>
    </Card>
  );
}
