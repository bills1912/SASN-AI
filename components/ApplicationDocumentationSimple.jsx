'use client'

import { Card } from '@/components/ui/card';
import { FileText, Target, AlertCircle, Zap, Shield, Cpu, TrendingUp } from 'lucide-react';

export default function ApplicationDocumentationSimple() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">ASTA-CITA AI</h2>
          <p className="text-xl font-semibold text-blue-500">
            ASN Talent Management & Career Intelligence with Blockchain Technology and AI
          </p>
          <p className="text-sm text-muted-foreground italic">
            &quot;Transformasi Manajemen Talenta ASN: Transparan, Meritokratis, dan Terverifikasi Blockchain&quot;
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full border border-green-500/30">
              ✓ Fully Implemented
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full border border-blue-500/30">
              AI Hackathon 2025
            </span>
          </div>
        </div>
      </Card>

      {/* Identitas & Target */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Identitas & Target User
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Kategori</p>
            <p className="font-semibold text-foreground">ASN Position Meritocracy System</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Target User</p>
            <p className="font-semibold text-foreground">Seluruh Layanan Kepegawaian Skala Nasional</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Skala</p>
            <p className="font-semibold text-foreground">4.3 juta ASN • 528 K/L • 542 Pemda</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <p className="font-semibold text-green-500">Ready for National Deployment 🚀</p>
          </div>
        </div>
      </Card>

      {/* Masalah yang Diselesaikan */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Masalah yang Diselesaikan
        </h3>
        <div className="space-y-4">
          {/* Problem 1 */}
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
            <h4 className="font-bold text-foreground mb-2">1. Sistem Merit Belum Transparan & Terverifikasi</h4>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground"><strong>Kondisi:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Penilaian kinerja & promosi masih manual (Excel, dokumen fisik)</li>
                <li>Data kredensial rentan manipulasi</li>
                <li>Tidak ada audit trail untuk keputusan promosi/mutasi</li>
                <li>Sulit membuktikan keputusan berbasis merit, bukan KKN</li>
              </ul>
              <p className="text-blue-500 font-semibold mt-2">
                📊 Survei BKN 2023: Hanya 42% instansi menerapkan sistem merit konsisten
              </p>
            </div>
          </div>

          {/* Problem 2 */}
          <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
            <h4 className="font-bold text-foreground mb-2">2. Manajemen Talenta Tidak Terstandarisasi</h4>
            <div className="space-y-2 text-sm">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Setiap instansi punya metode berbeda (tidak standar nasional)</li>
                <li>9-Box Talent Matrix dilakukan manual, memakan waktu berhari-hari</li>
                <li>Perhitungan subjektif, tidak pakai formula terstandar</li>
                <li>Data talent tersebar, tidak terintegrasi</li>
              </ul>
              <p className="text-orange-500 font-semibold mt-2">
                ⚠️ Tidak compliance dengan Permenpan RB No. 3/2020
              </p>
            </div>
          </div>

          {/* Problem 3 */}
          <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
            <h4 className="font-bold text-foreground mb-2">3. Proses Manual Lambat & Error-Prone</h4>
            <div className="space-y-2 text-sm">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Input data manual sangat time-consuming</li>
                <li>Konversi nilai di Excel rawan human error (15%)</li>
                <li>Proses assessment 1 instansi: 2-3 bulan</li>
                <li>Verifikasi kredensial butuh koordinasi manual</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Solusi & Inovasi */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Solusi & Inovasi
        </h3>
        <div className="space-y-4">
          {/* Solution 1 */}
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-2">
                  🏆 Private Blockchain untuk Data Integrity
                  <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">FIRST IN INDONESIA</span>
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Blockchain untuk manajemen talenta ASN - pertama di Indonesia
                </p>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-foreground">Cara Kerja:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>SHA-256 hashing → Unique fingerprint per record</li>
                    <li>Proof of Work mining → Tamper-proof validation</li>
                    <li>Chain linking → Immutable audit trail</li>
                    <li>Verification Speed: Seconds (vs Days)</li>
                  </ul>
                  <div className="mt-3 p-3 bg-muted/50 rounded">
                    <p className="font-semibold text-foreground mb-2">Keunggulan vs Sistem Lama:</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Data Manipulation</p>
                        <p className="font-bold text-red-500">Lama: Bisa diubah</p>
                        <p className="font-bold text-green-500">Baru: Impossible</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Audit Trail</p>
                        <p className="font-bold text-red-500">Lama: Bisa dihapus</p>
                        <p className="font-bold text-green-500">Baru: Permanent</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">KKN Prevention</p>
                        <p className="font-bold text-red-500">Lama: Sulit</p>
                        <p className="font-bold text-green-500">Baru: Fully auditable</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solution 2 */}
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
            <h4 className="font-bold text-foreground mb-2">
              🏆 Real-time Merit Calculation Engine
              <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded">100% LINEAR</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              100% LINEAR dengan metode manual Kemenpan RB (asik.menpan.go.id)
            </p>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted/50 rounded">
                <p className="font-semibold text-foreground mb-1">Formula Sumbu X (Potensi):</p>
                <p className="text-xs text-muted-foreground font-mono">
                  Job Fit (20%) + Gap Potensi (20%) + Diklat (40%) + Pendidikan (15%) + Pengalaman (5%) = 0-3
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <p className="font-semibold text-foreground mb-1">Formula Sumbu Y (Kinerja):</p>
                <p className="text-xs text-muted-foreground font-mono">
                  SKP Rating (100%) = Score 0-3
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
                  <p className="text-xs font-semibold text-green-500">✓ Automated - No manual calculation</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                  <p className="text-xs font-semibold text-blue-500">✓ Results in seconds (vs days)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution 3 */}
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
            <h4 className="font-bold text-foreground mb-2">🏆 AI-Powered Talent Analytics</h4>
            <div className="space-y-2 text-sm">
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-muted/50 rounded">
                  <p className="font-semibold text-foreground mb-1">NLP</p>
                  <p className="text-xs text-muted-foreground">CV/Resume Parsing, Sentiment Analysis</p>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <p className="font-semibold text-foreground mb-1">Computer Vision</p>
                  <p className="text-xs text-muted-foreground">OCR Sertifikat, Fake Detection</p>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <p className="font-semibold text-foreground mb-1">Predictive Analytics</p>
                  <p className="text-xs text-muted-foreground">High-potential Forecast, Churn Prediction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tech Stack */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-500" />
          Technology Stack
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <p className="font-semibold text-foreground mb-2">Frontend</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 14 (React 18)</li>
                <li>• Tailwind CSS</li>
                <li>• shadcn/ui</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
              <p className="font-semibold text-foreground mb-2">Backend</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js API Routes</li>
                <li>• JWT Authentication</li>
                <li>• RESTful endpoints</li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
              <p className="font-semibold text-foreground mb-2">Database</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• MongoDB (NoSQL)</li>
                <li>• Aggregation Pipelines</li>
                <li>• Query Optimization</li>
              </ul>
            </div>
            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
              <p className="font-semibold text-foreground mb-2">Blockchain</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Custom Private Blockchain</li>
                <li>• SHA-256 Hashing</li>
                <li>• Proof of Work</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Architecture */}
        <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
          <p className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            Security Architecture (3 Layers)
          </p>
          <div className="grid md:grid-cols-3 gap-3 text-xs">
            <div>
              <p className="font-semibold text-foreground mb-1">Layer 1 - Application</p>
              <ul className="text-muted-foreground space-y-0.5">
                <li>✓ JWT with expiry</li>
                <li>✓ CORS protection</li>
                <li>✓ XSS prevention</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Layer 2 - Data</p>
              <ul className="text-muted-foreground space-y-0.5">
                <li>✓ Encryption at rest</li>
                <li>✓ HTTPS in transit</li>
                <li>✓ Password hashing</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Layer 3 - Blockchain</p>
              <ul className="text-muted-foreground space-y-0.5">
                <li>✓ SHA-256 tamper detection</li>
                <li>✓ Proof of Work</li>
                <li>✓ Immutable audit log</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Dampak & ROI */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Dampak & ROI
        </h3>
        
        {/* ROI Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left font-semibold text-foreground">Metrik</th>
                <th className="p-3 text-left font-semibold text-foreground">Before</th>
                <th className="p-3 text-left font-semibold text-foreground">After</th>
                <th className="p-3 text-left font-semibold text-green-500">Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              <tr>
                <td className="p-3 text-muted-foreground">Assessment Time</td>
                <td className="p-3">2-3 bulan</td>
                <td className="p-3">2-3 hari</td>
                <td className="p-3 font-bold text-green-500">30x faster</td>
              </tr>
              <tr>
                <td className="p-3 text-muted-foreground">Cost per Assessment</td>
                <td className="p-3">Rp 5 juta</td>
                <td className="p-3">Rp 500 ribu</td>
                <td className="p-3 font-bold text-green-500">90% reduction</td>
              </tr>
              <tr>
                <td className="p-3 text-muted-foreground">Human Error Rate</td>
                <td className="p-3">15%</td>
                <td className="p-3">&lt; 1%</td>
                <td className="p-3 font-bold text-green-500">15x better</td>
              </tr>
              <tr>
                <td className="p-3 text-muted-foreground">KKN Detection</td>
                <td className="p-3">0%</td>
                <td className="p-3">100%</td>
                <td className="p-3 font-bold text-green-500">Fully auditable</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Impact Timeline */}
        <div className="space-y-3">
          <div className="p-4 bg-blue-500/5 border-l-4 border-blue-500 rounded">
            <p className="font-semibold text-foreground mb-1">Jangka Pendek (0-1 tahun)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Saving waktu: 36 juta hari kerja</li>
              <li>✓ Saving biaya: Rp 2.4 triliun</li>
              <li>✓ Semua keputusan blockchain-verified</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-500/5 border-l-4 border-purple-500 rounded">
            <p className="font-semibold text-foreground mb-1">Jangka Menengah (1-3 tahun)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ High-potential ASN teridentifikasi</li>
              <li>✓ Skill gaps tertutup dengan targeted training</li>
              <li>✓ Standardisasi nasional tercapai</li>
            </ul>
          </div>
          <div className="p-4 bg-green-500/5 border-l-4 border-green-500 rounded">
            <p className="font-semibold text-foreground mb-1">Jangka Panjang (3-5 tahun)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ World-class bureaucracy</li>
              <li>✓ Evidence-based policy making</li>
              <li>✓ International recognition (ASEAN, World Bank, UN)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Budget */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Rencana Anggaran Biaya (RAB)</h3>
        <div className="mb-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
          <p className="text-2xl font-bold text-green-500">Total Budget: Rp 2 Miliar</p>
          <p className="text-sm text-muted-foreground">Year 1 - ROI &lt; 1 month</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-semibold text-foreground mb-2">Development (40%)</p>
            <p className="text-2xl font-bold text-blue-500 mb-1">Rp 800 jt</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Team development</li>
              <li>• AI/ML integration</li>
              <li>• Blockchain optimization</li>
            </ul>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-semibold text-foreground mb-2">Infrastructure (30%)</p>
            <p className="text-2xl font-bold text-purple-500 mb-1">Rp 600 jt</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Cloud hosting (AWS/GCP)</li>
              <li>• Database (MongoDB Atlas)</li>
              <li>• CDN & security</li>
            </ul>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-semibold text-foreground mb-2">Training & Support (20%)</p>
            <p className="text-2xl font-bold text-green-500 mb-1">Rp 400 jt</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Training material</li>
              <li>• Onboarding 528 K/L</li>
              <li>• Support team</li>
            </ul>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-semibold text-foreground mb-2">Marketing (10%)</p>
            <p className="text-2xl font-bold text-orange-500 mb-1">Rp 200 jt</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Compliance audit</li>
              <li>• Documentation</li>
              <li>• Launch event</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Unique Selling Points */}
      <Card className="p-6 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 border-blue-500/20">
        <h3 className="text-xl font-bold text-foreground mb-4 text-center">Unique Selling Points</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-background/80 rounded-lg backdrop-blur-sm border border-blue-500/30">
            <p className="font-bold text-blue-500 mb-1">🏆 Blockchain-verified</p>
            <p className="text-sm text-muted-foreground">Tamper-proof & fully auditable</p>
          </div>
          <div className="p-4 bg-background/80 rounded-lg backdrop-blur-sm border border-purple-500/30">
            <p className="font-bold text-purple-500 mb-1">🏆 100% Compliant</p>
            <p className="text-sm text-muted-foreground">Sesuai Permenpan RB</p>
          </div>
          <div className="p-4 bg-background/80 rounded-lg backdrop-blur-sm border border-green-500/30">
            <p className="font-bold text-green-500 mb-1">🏆 30x Faster</p>
            <p className="text-sm text-muted-foreground">Than manual process</p>
          </div>
          <div className="p-4 bg-background/80 rounded-lg backdrop-blur-sm border border-orange-500/30">
            <p className="font-bold text-orange-500 mb-1">🏆 90% Cost Reduction</p>
            <p className="text-sm text-muted-foreground">Saving Rp 2.4 T/tahun</p>
          </div>
          <div className="p-4 bg-background/80 rounded-lg backdrop-blur-sm border border-cyan-500/30 md:col-span-2">
            <p className="font-bold text-cyan-500 mb-1">🏆 Real-time AI Insights</p>
            <p className="text-sm text-muted-foreground">Predictive analytics & smart recommendations</p>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="text-center space-y-2">
          <p className="text-2xl font-bold">READY FOR NATIONAL DEPLOYMENT 🚀</p>
          <p className="text-sm text-slate-300">ASTA-CITA AI © 2025 • AI Hackathon 2025 - Kemenpan RB</p>
        </div>
      </Card>
    </div>
  );
}
