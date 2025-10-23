'use client'

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  History, 
  Database, 
  FileCheck,
  Target,
  Lightbulb,
  Code2,
  TrendingUp,
  Users,
  Award,
  Rocket,
  DollarSign,
  Calendar
} from 'lucide-react';

export default function ComprehensiveDocumentation() {
  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          ASTA-CITA AI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          AI-Powered ASN Talent Management & Merit System Platform
        </p>
        <Badge className="mt-2 bg-blue-500">Blockchain-Secured | Real-time Analytics | Compliance-Ready</Badge>
      </div>

      {/* 1. JUDUL & TAGLINE */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Judul & Identitas</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Nama Aplikasi:</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
              ASTA-CITA AI - ASN Talent Management & Career Intelligence with Blockchain Technology and AI
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tagline:</p>
            <p className="text-lg italic text-foreground">
              "Transformasi Manajemen Talenta ASN: Transparan, Meritokratis, dan Terverifikasi Blockchain"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg">
              <p className="text-xs text-muted-foreground">Kategori</p>
              <p className="font-semibold text-foreground">ASN Position Meritocracy System (Talent Management)</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg">
              <p className="text-xs text-muted-foreground">Target User</p>
              <p className="font-semibold text-foreground">Seluruh Layanan Kepegawaian Skala Nasional</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-semibold text-green-600">✓ Fully Implemented & Running</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. MASALAH (PROBLEM) - RELEVANSI */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-red-500" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Masalah yang Diselesaikan</h2>
            <p className="text-sm text-muted-foreground">Relevansi dengan Kondisi Riil Manajemen ASN Indonesia</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Masalah 1 */}
          <div className="p-5 bg-red-50 dark:bg-red-950/20 rounded-lg border-l-4 border-red-500">
            <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
              <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Sistem Merit yang Belum Transparan dan Terverifikasi
            </h3>
            <div className="space-y-3 text-sm md:text-base text-foreground ml-8">
              <div>
                <strong>Kondisi Saat Ini:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Penilaian kinerja dan promosi ASN masih menggunakan sistem manual dengan spreadsheet dan dokumen fisik</li>
                  <li>Data kredensial (pendidikan, sertifikasi, diklat) rentan manipulasi dan pemalsuan</li>
                  <li>Tidak ada audit trail yang jelas untuk keputusan promosi atau mutasi</li>
                  <li>Sulit membuktikan bahwa keputusan karier benar-benar berbasis merit, bukan KKN</li>
                </ul>
              </div>
              <div>
                <strong>Dampak Masalah:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Potensi praktik KKN (Korupsi, Kolusi, Nepotisme) dalam promosi ASN</li>
                  <li>Hilangnya trust publik terhadap sistem kepegawaian pemerintah</li>
                  <li>ASN berkompeten tidak mendapat pengembangan karier yang layak</li>
                  <li>Tidak compliance dengan Permenpan RB No. 40/2018 tentang Pedoman Sistem Merit</li>
                </ul>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded">
                <strong className="text-red-700 dark:text-red-400">📊 Data Riil:</strong>
                <p className="text-muted-foreground mt-1">
                  Berdasarkan survei BKN 2023, hanya 42% instansi pemerintah yang menerapkan sistem merit secara konsisten. 
                  68% ASN merasa proses promosi tidak transparan.
                </p>
              </div>
            </div>
          </div>

          {/* Masalah 2 */}
          <div className="p-5 bg-orange-50 dark:bg-orange-950/20 rounded-lg border-l-4 border-orange-500">
            <h3 className="text-lg font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
              <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Manajemen Talenta ASN yang Tidak Terstandarisasi
            </h3>
            <div className="space-y-3 text-sm md:text-base text-foreground ml-8">
              <div>
                <strong>Kondisi Saat Ini:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Setiap instansi punya metode penilaian talenta yang berbeda-beda (tidak standar nasional)</li>
                  <li>9-Box Talent Matrix dilakukan manual, memakan waktu berhari-hari bahkan berminggu-minggu</li>
                  <li>Perhitungan Sumbu X (Potensi) dan Sumbu Y (Kinerja) sering subjektif, tidak menggunakan formula terstandar</li>
                  <li>Data talent tersebar di berbagai sistem, tidak terintegrasi</li>
                </ul>
              </div>
              <div>
                <strong>Dampak Masalah:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Inkonsistensi penilaian antar instansi membuat mobilitas talenta ASN antar kementerian sulit</li>
                  <li>High-potential employees tidak teridentifikasi untuk succession planning</li>
                  <li>Proses assessment memakan waktu lama, biaya tinggi</li>
                  <li>Tidak compliance dengan Permenpan RB No. 3/2020 tentang Manajemen Talenta ASN</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Masalah 3 */}
          <div className="p-5 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400 mb-3 flex items-center gap-2">
              <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Proses Manual yang Lambat dan Error-Prone
            </h3>
            <div className="space-y-3 text-sm md:text-base text-foreground ml-8">
              <div>
                <strong>Kondisi Saat Ini:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Input data manual untuk assessment (Job Fit, Gap Potensi, Diklat, dll) sangat time-consuming</li>
                  <li>Konversi nilai ke Skala 3 dilakukan manual di Excel, rawan human error</li>
                  <li>Tidak ada sistem real-time, data sering outdated saat digunakan untuk decision making</li>
                  <li>Verifikasi kredensial membutuhkan koordinasi manual antar institusi pendidikan</li>
                </ul>
              </div>
              <div>
                <strong>Dampak Masalah:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Proses talent assessment 1 instansi bisa memakan waktu 2-3 bulan</li>
                  <li>Keputusan strategis tertunda karena menunggu hasil assessment</li>
                  <li>Human error dalam perhitungan menyebabkan kesalahan penempatan talenta</li>
                  <li>Biaya operasional tinggi untuk proses manual</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Target User & Kebutuhan */}
          <div className="p-5 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-3">Target Pengguna & Kebutuhan Mereka</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-foreground">1. BKN (Badan Kepegawaian Negara):</strong>
                <ul className="list-disc ml-6 mt-1 text-muted-foreground">
                  <li>Butuh dashboard monitoring implementasi sistem merit nasional</li>
                  <li>Perlu standarisasi penilaian talenta antar K/L</li>
                  <li>Compliance tracking dengan regulasi</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">2. Kementerian/Lembaga (K/L):</strong>
                <ul className="list-disc ml-6 mt-1 text-muted-foreground">
                  <li>Sistem talent assessment yang cepat dan akurat</li>
                  <li>Succession planning untuk posisi strategis</li>
                  <li>Data-driven decision untuk promosi & mutasi</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">3. Unit Kepegawaian:</strong>
                <ul className="list-disc ml-6 mt-1 text-muted-foreground">
                  <li>Automated calculation untuk menghemat waktu</li>
                  <li>Verifikasi kredensial yang instant</li>
                  <li>Report generation yang mudah</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">4. ASN (Individual):</strong>
                <ul className="list-disc ml-6 mt-1 text-muted-foreground">
                  <li>Transparansi penilaian kinerja</li>
                  <li>Career path yang jelas</li>
                  <li>Development plan yang personalized</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Continued in next part... */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Dokumentasi lengkap akan dilanjutkan dengan:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline">✓ Solusi yang Ditawarkan</Badge>
            <Badge variant="outline">✓ Keunggulan & Inovasi</Badge>
            <Badge variant="outline">✓ Penerapan Teknologi</Badge>
            <Badge variant="outline">✓ Dampak & Skala Implementasi</Badge>
            <Badge variant="outline">✓ Timeline & Budget</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
