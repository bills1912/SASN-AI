'use client'

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart3, TrendingUp, Target } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Sistem AI untuk <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Manajemen ASN
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Platform terintegrasi untuk analisis talenta dan penilaian kinerja ASN berbasis Artificial Intelligence
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
          >
            Mulai Sekarang
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <Card className="p-8 bg-slate-800/50 border-slate-700 backdrop-blur hover:bg-slate-800/70 transition-all">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex items-start mb-4">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
              <h3 className="text-xl font-semibold text-white">Analisis Talenta Komprehensif</h3>
            </div>
            <p className="text-slate-400">
              Pemetaan kompetensi dan potensi ASN menggunakan AI
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="p-8 bg-slate-800/50 border-slate-700 backdrop-blur hover:bg-slate-800/70 transition-all">
            <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="flex items-start mb-4">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
              <h3 className="text-xl font-semibold text-white">Penilaian Kinerja Real-time</h3>
            </div>
            <p className="text-slate-400">
              Evaluasi kinerja berbasis data dan rekomendasi AI
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="p-8 bg-slate-800/50 border-slate-700 backdrop-blur hover:bg-slate-800/70 transition-all">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex items-start mb-4">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
              <h3 className="text-xl font-semibold text-white">Dashboard Analytics</h3>
            </div>
            <p className="text-slate-400">
              Visualisasi data dan insights untuk pengambilan keputusan
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
