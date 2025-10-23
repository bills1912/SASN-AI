'use client'

import { Card } from '@/components/ui/card';
import { Book, GitBranch, Sparkles, Database, Brain, Target, TrendingUp, Shield, Zap } from 'lucide-react';

export default function ApplicationDocumentation({ user }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          ASTA-CITA AI
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          ASN Talent Analytics System - Comprehensive Intelligence Through AI
        </p>
        <p className="text-sm text-muted-foreground">
          Sistem Analisis Talenta ASN Berbasis Kecerdasan Buatan dengan Integrasi Merit System Index
        </p>
      </div>

      {/* Novelty Section */}
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-purple-500 rounded-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-3">Novelty & Innovation</h2>
            <div className="space-y-3 text-foreground">
              <p className="font-semibold text-lg text-purple-700 dark:text-purple-400">
                🏆 First-in-Indonesia: Blockchain-Powered Talent Management System dengan Merit-Based AI
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                  <span><strong>Pertama di Indonesia</strong> yang mengintegrasikan Blockchain untuk keamanan data ASN dengan sistem manajemen talenta berdasarkan Permenpan RB No. 3 Tahun 2020</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                  <span><strong>Immutable Credential Verification</strong> menggunakan blockchain untuk memastikan kredensial, sertifikasi, dan riwayat kinerja ASN tidak dapat dimanipulasi</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                  <span><strong>Merit-Based Transparency</strong> sesuai Permenpan RB No. 40/2018 tentang Pedoman Sistem Merit dengan audit trail lengkap berbasis blockchain</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                  <span><strong>AI-Powered Talent Analytics</strong> menggunakan Large Language Models (LLM) untuk pemetaan talenta 9-box, skill gap analysis, dan succession planning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                  <span><strong>Deep Learning Merit Index</strong> untuk perhitungan Merit System Index institusi pemerintah dengan neural network prediction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                  <span><strong>Cross-Institution Secure Data Sharing</strong> dengan decentralized storage untuk mobilitas talenta antar instansi pemerintah</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* System Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Tujuan Sistem</h3>
          </div>
          <ul className="space-y-2 text-foreground ml-2">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Menyediakan analisis talenta ASN yang objektif dan data-driven</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Mengimplementasikan <strong>Manajemen Talenta ASN</strong> berdasarkan Permenpan RB No. 3 Tahun 2020</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Mengukur compliance institusi terhadap <strong>Sistem Merit ASN</strong> (UU ASN No. 5/2014, Permenpan RB No. 40/2018)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Memberikan rekomendasi berbasis AI untuk pengembangan talenta dan succession planning</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Menjamin keamanan dan integritas data ASN dengan teknologi blockchain</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 border-cyan-200 dark:border-cyan-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyan-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Output Utama</h3>
          </div>
          <ul className="space-y-2 text-foreground ml-2">
            <li className="flex items-start">
              <span className="text-cyan-500 mr-2">►</span>
              <span><strong>Talent Mapping:</strong> Pemetaan 9-Box Grid (Performance × Potential)</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-500 mr-2">►</span>
              <span><strong>Career Recommendations:</strong> Rekomendasi jabatan dengan scoring kesesuaian</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-500 mr-2">►</span>
              <span><strong>Skill Gap Analysis:</strong> Identifikasi kesenjangan kompetensi</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-500 mr-2">►</span>
              <span><strong>Merit System Index:</strong> Skor 0-100 untuk compliance institusi</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-500 mr-2">►</span>
              <span><strong>Institutional Ranking:</strong> Perbandingan antar institusi pemerintah</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* System Architecture */}
      <Card className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Arsitektur Sistem & Alur Proses</h2>
        </div>

        <div className="space-y-6">
          {/* Data Flow */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2 text-sm">1</span>
              Data Acquisition Layer
            </h3>
            <div className="ml-10 space-y-2 text-foreground">
              <p className="font-medium">A. ASN Profile Data:</p>
              <ul className="ml-6 space-y-1 text-muted-foreground">
                <li>• Sumber: API BKN atau input manual administrator</li>
                <li>• Data: NIP, nama, jabatan, unit kerja, pendidikan, masa kerja, riwayat kinerja</li>
                <li>• Storage: MongoDB dengan schema terstruktur</li>
              </ul>
              <p className="font-medium mt-3">B. Institutional Data (Merit System):</p>
              <ul className="ml-6 space-y-1 text-muted-foreground">
                <li>• <strong>Web Scraping Engine:</strong> Cheerio.js + Axios untuk ekstraksi data dari website pemerintah</li>
                <li>• <strong>Multi-selector Strategy:</strong> Adaptif terhadap berbagai struktur HTML</li>
                <li>• <strong>Retry Mechanism:</strong> Exponential backoff untuk reliability</li>
                <li>• <strong>Rate Limiting:</strong> 2 detik delay antar request untuk menghormati server resources</li>
              </ul>
            </div>
          </div>

          {/* AI Processing */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-2 text-sm">2</span>
              AI Processing & Analysis Layer
            </h3>
            <div className="ml-10 space-y-3 text-foreground">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-700 dark:text-green-400 mb-2">A. Talent Management AI Engine</p>
                <ul className="space-y-2 text-foreground">
                  <li>
                    <strong className="text-green-600 dark:text-green-400">► Large Language Model (LLM):</strong>
                    <ul className="ml-6 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• Model: GPT-4o / Claude Sonnet / Gemini Pro (via Emergent Universal API)</li>
                      <li>• Function: Analisis kualitatif profil ASN, generasi rekomendasi, pemetaan kompetensi</li>
                      <li>• Context Window: 128K tokens untuk analisis mendalam</li>
                      <li>• Temperature: 0.7 untuk balance antara creativity dan consistency</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-green-600 dark:text-green-400">► Rule-Based Expert System:</strong>
                    <ul className="ml-6 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• 9-Box Grid Classifier berdasarkan performance score dan potential assessment</li>
                      <li>• Talent Category Mapper sesuai Permenpan RB No. 3/2020</li>
                      <li>• Career Path Recommendation Engine dengan weighted scoring</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="font-semibold text-purple-700 dark:text-purple-400 mb-2">B. Merit System Index AI Engine</p>
                <ul className="space-y-2 text-foreground">
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">► Deep Neural Network (TensorFlow.js):</strong>
                    <ul className="ml-6 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• <strong>Architecture:</strong> Feedforward Neural Network (FNN) / Multilayer Perceptron (MLP)</li>
                      <li>• <strong>Layers:</strong>
                        <div className="ml-4 mt-1">
                          <div>- Input Layer: 10 features (employee_count, avg_tenure, avg_performance, training_programs_count, certification_rate, avg_education_level, succession_plan_coverage, merit_assessment_frequency, talent_pipeline_ratio, development_budget_per_capita)</div>
                          <div>- Hidden Layer 1: 64 neurons, ReLU activation, L2 regularization (λ=0.001), Dropout (30%)</div>
                          <div>- Hidden Layer 2: 32 neurons, ReLU activation, L2 regularization (λ=0.001), Dropout (20%)</div>
                          <div>- Hidden Layer 3: 16 neurons, ReLU activation</div>
                          <div>- Output Layer: 3 neurons, Sigmoid activation (Compliance Score, Talent Pipeline Strength, Training Adequacy)</div>
                        </div>
                      </li>
                      <li>• <strong>Optimizer:</strong> Adam (learning rate: 0.001)</li>
                      <li>• <strong>Loss Function:</strong> Mean Squared Error (MSE)</li>
                      <li>• <strong>Metrics:</strong> MAE (Mean Absolute Error), MSE</li>
                      <li>• <strong>Normalization:</strong> Z-score normalization untuk feature scaling</li>
                      <li>• <strong>Training Strategy:</strong> 
                        <div className="ml-4 mt-1">
                          <div>- Batch size: 16</div>
                          <div>- Epochs: 100</div>
                          <div>- Validation split: 20%</div>
                          <div>- Early stopping jika val_loss tidak improve</div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">► Ensemble Scoring:</strong>
                    <ul className="ml-6 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• Merit Index = (0.40 × Compliance Score) + (0.35 × Talent Pipeline) + (0.25 × Training Adequacy)</li>
                      <li>• Weighted average memberikan emphasis lebih pada compliance dengan regulasi</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">► LLM-based Qualitative Analysis:</strong>
                    <ul className="ml-6 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• Analisis compliance terhadap 7 prinsip merit system</li>
                      <li>• Generasi recommendations berbasis best practices</li>
                      <li>• Identifikasi strong points dan improvement areas</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Output Layer */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-2 text-sm">3</span>
              Presentation & Visualization Layer
            </h3>
            <div className="ml-10 space-y-2 text-foreground">
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Interactive Dashboard:</strong> Real-time visualization dengan ECharts</li>
                <li>• <strong>Comparative Analytics:</strong> Multi-institution ranking dan benchmarking</li>
                <li>• <strong>Responsive Design:</strong> Optimized untuk desktop dan mobile</li>
                <li>• <strong>Theme Support:</strong> Dark mode dan light mode untuk kenyamanan pengguna</li>
                <li>• <strong>Role-based Access:</strong> Admin access untuk Merit System Index, ASN access untuk Talent Management</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Technology Stack */}
      <Card className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-pink-500 rounded-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Technology Stack</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Frontend Technologies
            </h3>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li>• <strong>Framework:</strong> Next.js 14 (React 18 with App Router)</li>
              <li>• <strong>Styling:</strong> Tailwind CSS + shadcn/ui components</li>
              <li>• <strong>Charts:</strong> ECharts (Apache ECharts) for data visualization</li>
              <li>• <strong>State Management:</strong> React Hooks (useState, useEffect)</li>
              <li>• <strong>UI/UX:</strong> Responsive design, theme switching, loading states</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              Backend & AI
            </h3>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li>• <strong>Backend:</strong> Next.js API Routes (serverless functions)</li>
              <li>• <strong>Database:</strong> MongoDB for data persistence</li>
              <li>• <strong>AI/ML:</strong> TensorFlow.js 4.22.0 (Node.js backend)</li>
              <li>• <strong>LLM Integration:</strong> Emergent Universal API (OpenAI/Claude/Gemini)</li>
              <li>• <strong>Web Scraping:</strong> Cheerio.js 1.1.2 + Axios</li>
              <li>• <strong>Authentication:</strong> JWT-based token authentication</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Merit System Principles */}
      <Card className="p-8 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Compliance dengan Permenpan RB No. 3/2020</h2>
        </div>

        <div className="space-y-4 text-foreground">
          <p className="text-muted-foreground">
            Sistem ini dibangun dengan strict adherence terhadap Peraturan Menteri Pendayagunaan Aparatur Negara 
            dan Reformasi Birokrasi Nomor 3 Tahun 2020 tentang Manajemen Talenta Aparatur Sipil Negara.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">7 Prinsip Merit System</h4>
              <ul className="space-y-1 text-sm text-foreground">
                <li>✓ Objektif</li>
                <li>✓ Terencana</li>
                <li>✓ Terbuka</li>
                <li>✓ Tepat Waktu</li>
                <li>✓ Akuntabel</li>
                <li>✓ Bebas dari Intervensi Politik</li>
                <li>✓ Bebas dari Praktik KKN</li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Assessment Methods</h4>
              <ul className="space-y-1 text-sm text-foreground">
                <li>✓ Performance Ranking (Penilaian Kinerja)</li>
                <li>✓ Potential Assessment (Assessment Center)</li>
                <li>✓ Competency Tests (Uji Kompetensi)</li>
                <li>✓ Work History Analysis (Analisis Rekam Jejak)</li>
                <li>✓ 9-Box Grid Talent Mapping</li>
                <li>✓ Succession Planning Coverage</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Future Development */}
      <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Book className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Future Enhancements</h2>
        </div>
        <ul className="space-y-2 text-foreground ml-6">
          <li className="flex items-start">
            <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold">→</span>
            <span><strong>Real-time BKN API Integration:</strong> Sinkronisasi langsung dengan database kepegawaian nasional</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold">→</span>
            <span><strong>Advanced ML Models:</strong> Implementasi Transformer-based models untuk analisis prediktif</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold">→</span>
            <span><strong>Automated Succession Planning:</strong> AI-powered successor recommendations</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold">→</span>
            <span><strong>Predictive Analytics:</strong> Forecasting talent gaps dan retention risks</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold">→</span>
            <span><strong>Nationwide Dashboard:</strong> Centralized monitoring untuk seluruh institusi pemerintah Indonesia</span>
          </li>
        </ul>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-6 border-t border-border">
        <p>© 2024 ASTA-CITA AI - BKN Hackathon Proposal</p>
        <p className="mt-1">Developed with 💙 for Indonesian Civil Service Transformation</p>
      </div>
    </div>
  );
}
