'use client'

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * 9-Box Matrix Component - Sesuai dengan tampilan asik.menpan.go.id
 * Grid 3x3 dengan box bernomor 1-9
 */
export default function NineBoxMatrix({ position, showLabels = true, className = "" }) {
  // Box configuration (sesuai dengan Menpan RB)
  // Numbering dari kiri ke kanan, bawah ke atas
  const boxes = [
    // Row 1 (Bottom) - Low Potential
    { num: 1, x: 0, y: 2, potential: 'Low', performance: 'Low', label: 'Risk', color: '#ef4444' },
    { num: 2, x: 1, y: 2, potential: 'Low', performance: 'Medium', label: 'Average', color: '#f97316' },
    { num: 3, x: 2, y: 2, potential: 'Low', performance: 'High', label: 'Solid Performer', color: '#f59e0b' },
    
    // Row 2 (Middle) - Medium Potential
    { num: 4, x: 0, y: 1, potential: 'Medium', performance: 'Low', label: 'Inconsistent', color: '#eab308' },
    { num: 5, x: 1, y: 1, potential: 'Medium', performance: 'Medium', label: 'Core Employee', color: '#3b82f6' },
    { num: 6, x: 2, y: 1, potential: 'Medium', performance: 'High', label: 'Key Player', color: '#10b981' },
    
    // Row 3 (Top) - High Potential
    { num: 7, x: 0, y: 0, potential: 'High', performance: 'Low', label: 'Rough Diamond', color: '#eab308' },
    { num: 8, x: 1, y: 0, potential: 'High', performance: 'Medium', label: 'High Potential', color: '#3b82f6' },
    { num: 9, x: 2, y: 0, potential: 'High', performance: 'High', label: 'Star Performer', color: '#22c55e' }
  ];

  const currentBox = position?.box || 5;
  const boxSize = 100; // Size of each box in pixels (for mobile we'll use responsive units)

  return (
    <div className={`${className}`}>
      {showLabels && (
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4 text-center">
          9-Box Talent Matrix
        </h3>
      )}
      
      <div className="relative w-full max-w-md mx-auto">
        {/* Y-Axis Label (Potential) */}
        {showLabels && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 hidden md:block">
            <div className="transform -rotate-90 origin-center">
              <p className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                Potential
              </p>
            </div>
          </div>
        )}

        {/* Matrix Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 p-2 md:p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700">
          {boxes.sort((a, b) => {
            // Sort by row (y) first, then by column (x)
            if (a.y !== b.y) return a.y - b.y;
            return a.x - b.x;
          }).map((box) => {
            const isActive = box.num === currentBox;
            
            return (
              <div
                key={box.num}
                className={`
                  relative aspect-square flex flex-col items-center justify-center
                  rounded-lg border-2 transition-all duration-300
                  ${isActive 
                    ? 'border-4 shadow-lg scale-105' 
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                  }
                `}
                style={{
                  backgroundColor: isActive ? box.color : 'transparent',
                  borderColor: isActive ? box.color : undefined
                }}
              >
                {/* Box Number */}
                <div className={`
                  text-2xl md:text-3xl font-bold mb-1
                  ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}
                `}>
                  {box.num}
                </div>
                
                {/* Box Label (only show on active box or in larger screens) */}
                {isActive && (
                  <div className="text-xs md:text-sm font-semibold text-white text-center px-1">
                    {box.label}
                  </div>
                )}
                
                {/* Indicator badge for active box */}
                {isActive && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full border-2 flex items-center justify-center"
                         style={{ borderColor: box.color }}>
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
                           style={{ backgroundColor: box.color }}></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* X-Axis Label (Performance) */}
        {showLabels && (
          <div className="text-center mt-2 md:mt-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Performance
            </p>
          </div>
        )}

        {/* Axis Level Labels */}
        {showLabels && (
          <>
            {/* Y-Axis Levels (Potential) */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around -translate-x-12 hidden md:flex">
              <span className="text-xs text-muted-foreground">High</span>
              <span className="text-xs text-muted-foreground">Medium</span>
              <span className="text-xs text-muted-foreground">Low</span>
            </div>

            {/* X-Axis Levels (Performance) */}
            <div className="flex justify-around mt-1 text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </>
        )}
      </div>

      {/* Position Info Card */}
      {position && (
        <Card className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Posisi Anda di Box:</p>
              <p className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                Box {position.box}
                <Badge 
                  className="text-xs" 
                  style={{ 
                    backgroundColor: boxes.find(b => b.num === position.box)?.color,
                    color: 'white'
                  }}
                >
                  {position.label}
                </Badge>
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs text-muted-foreground">Kategori:</p>
              <p className="text-sm md:text-base font-semibold text-foreground">{position.quadrant}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                Priority: {position.priority}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Legend */}
      <div className="mt-4 p-3 md:p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
        <p className="text-xs md:text-sm font-semibold text-foreground mb-2">Kategori Box:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {boxes.map((box) => (
            <div key={box.num} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 md:w-4 md:h-4 rounded flex-shrink-0"
                style={{ backgroundColor: box.color }}
              ></div>
              <span className="text-muted-foreground truncate">
                {box.num}. {box.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info about system */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>ℹ️ Sistem Penilaian:</strong> Berdasarkan metode Kemenpan RB dengan 2 sumbu - 
          Sumbu X (Potensi: Job Fit, Gap, Diklat, Pendidikan, Pengalaman) dan 
          Sumbu Y (Kinerja: SKP). Percentile benchmarking P1(50%)=2.2, P2(80%)=2.4.
        </p>
      </div>
    </div>
  );
}
