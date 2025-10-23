/**
 * Mock data untuk Merit System Index
 * Berdasarkan Permenpan RB No. 3/2020
 */

export const mockInstitutions = [
  {
    id: '1',
    name: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    short_name: 'Kemenpan RB',
    type: 'Kementerian',
    url: 'https://www.menpan.go.id',
    employee_count: 1250,
    avg_tenure: 12.5,
    avg_performance: 4.2,
    training_programs_count: 85,
    certification_rate: 78,
    avg_education_level: 'S2',
    succession_plan_coverage: 85,
    merit_assessment_frequency: 12, // per tahun
    talent_pipeline_ratio: 0.25,
    development_budget_per_capita: 15000000,
    // Calculated scores
    merit_index: 87.5,
    compliance_score: 92,
    talent_pipeline_strength: 85,
    training_adequacy: 86,
    confidence: 0.95,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Badan Kepegawaian Negara',
    short_name: 'BKN',
    type: 'Lembaga',
    url: 'https://www.bkn.go.id',
    employee_count: 2100,
    avg_tenure: 14.2,
    avg_performance: 4.3,
    training_programs_count: 120,
    certification_rate: 82,
    avg_education_level: 'S2',
    succession_plan_coverage: 90,
    merit_assessment_frequency: 12,
    talent_pipeline_ratio: 0.30,
    development_budget_per_capita: 18000000,
    merit_index: 89.2,
    compliance_score: 94,
    talent_pipeline_strength: 88,
    training_adequacy: 90,
    confidence: 0.98,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Lembaga Administrasi Negara',
    short_name: 'LAN',
    type: 'Lembaga',
    url: 'https://www.lan.go.id',
    employee_count: 890,
    avg_tenure: 13.8,
    avg_performance: 4.4,
    training_programs_count: 150,
    certification_rate: 88,
    avg_education_level: 'S3',
    succession_plan_coverage: 88,
    merit_assessment_frequency: 12,
    talent_pipeline_ratio: 0.32,
    development_budget_per_capita: 22000000,
    merit_index: 91.8,
    compliance_score: 95,
    talent_pipeline_strength: 91,
    training_adequacy: 93,
    confidence: 0.96,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Kementerian Dalam Negeri',
    short_name: 'Kemendagri',
    type: 'Kementerian',
    url: 'https://www.kemendagri.go.id',
    employee_count: 3500,
    avg_tenure: 11.5,
    avg_performance: 3.9,
    training_programs_count: 95,
    certification_rate: 65,
    avg_education_level: 'S1',
    succession_plan_coverage: 70,
    merit_assessment_frequency: 8,
    talent_pipeline_ratio: 0.18,
    development_budget_per_capita: 12000000,
    merit_index: 75.3,
    compliance_score: 78,
    talent_pipeline_strength: 72,
    training_adequacy: 76,
    confidence: 0.88,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Kementerian Keuangan',
    short_name: 'Kemenkeu',
    type: 'Kementerian',
    url: 'https://www.kemenkeu.go.id',
    employee_count: 4200,
    avg_tenure: 13.2,
    avg_performance: 4.5,
    training_programs_count: 180,
    certification_rate: 85,
    avg_education_level: 'S2',
    succession_plan_coverage: 92,
    merit_assessment_frequency: 12,
    talent_pipeline_ratio: 0.35,
    development_budget_per_capita: 25000000,
    merit_index: 92.5,
    compliance_score: 96,
    talent_pipeline_strength: 92,
    training_adequacy: 94,
    confidence: 0.97,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Badan Pusat Statistik',
    short_name: 'BPS',
    type: 'Lembaga',
    url: 'https://www.bps.go.id',
    employee_count: 2800,
    avg_tenure: 12.8,
    avg_performance: 4.1,
    training_programs_count: 110,
    certification_rate: 75,
    avg_education_level: 'S2',
    succession_plan_coverage: 80,
    merit_assessment_frequency: 10,
    talent_pipeline_ratio: 0.22,
    development_budget_per_capita: 16000000,
    merit_index: 82.7,
    compliance_score: 85,
    talent_pipeline_strength: 80,
    training_adequacy: 83,
    confidence: 0.91,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
    short_name: 'Kemendikbudristek',
    type: 'Kementerian',
    url: 'https://www.kemdikbud.go.id',
    employee_count: 5600,
    avg_tenure: 10.5,
    avg_performance: 3.8,
    training_programs_count: 140,
    certification_rate: 68,
    avg_education_level: 'S2',
    succession_plan_coverage: 75,
    merit_assessment_frequency: 8,
    talent_pipeline_ratio: 0.20,
    development_budget_per_capita: 14000000,
    merit_index: 77.8,
    compliance_score: 80,
    talent_pipeline_strength: 75,
    training_adequacy: 78,
    confidence: 0.89,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Kementerian Kesehatan',
    short_name: 'Kemenkes',
    type: 'Kementerian',
    url: 'https://www.kemkes.go.id',
    employee_count: 6200,
    avg_tenure: 11.8,
    avg_performance: 4.0,
    training_programs_count: 125,
    certification_rate: 70,
    avg_education_level: 'S1',
    succession_plan_coverage: 72,
    merit_assessment_frequency: 9,
    talent_pipeline_ratio: 0.19,
    development_budget_per_capita: 13000000,
    merit_index: 76.5,
    compliance_score: 79,
    talent_pipeline_strength: 74,
    training_adequacy: 77,
    confidence: 0.87,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Sekretariat Negara',
    short_name: 'Setneg',
    type: 'Lembaga',
    url: 'https://www.setneg.go.id',
    employee_count: 1450,
    avg_tenure: 15.2,
    avg_performance: 4.6,
    training_programs_count: 95,
    certification_rate: 90,
    avg_education_level: 'S2',
    succession_plan_coverage: 95,
    merit_assessment_frequency: 12,
    talent_pipeline_ratio: 0.38,
    development_budget_per_capita: 28000000,
    merit_index: 93.8,
    compliance_score: 97,
    talent_pipeline_strength: 94,
    training_adequacy: 95,
    confidence: 0.99,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Kementerian Komunikasi dan Informatika',
    short_name: 'Kominfo',
    type: 'Kementerian',
    url: 'https://www.kominfo.go.id',
    employee_count: 1800,
    avg_tenure: 9.5,
    avg_performance: 4.2,
    training_programs_count: 130,
    certification_rate: 80,
    avg_education_level: 'S2',
    succession_plan_coverage: 82,
    merit_assessment_frequency: 11,
    talent_pipeline_ratio: 0.28,
    development_budget_per_capita: 20000000,
    merit_index: 85.3,
    compliance_score: 88,
    talent_pipeline_strength: 84,
    training_adequacy: 87,
    confidence: 0.93,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Badan Pengawasan Keuangan dan Pembangunan',
    short_name: 'BPKP',
    type: 'Lembaga',
    url: 'https://www.bpkp.go.id',
    employee_count: 2300,
    avg_tenure: 14.5,
    avg_performance: 4.3,
    training_programs_count: 115,
    certification_rate: 84,
    avg_education_level: 'S2',
    succession_plan_coverage: 87,
    merit_assessment_frequency: 12,
    talent_pipeline_ratio: 0.29,
    development_budget_per_capita: 19000000,
    merit_index: 88.1,
    compliance_score: 91,
    talent_pipeline_strength: 87,
    training_adequacy: 89,
    confidence: 0.94,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '12',
    name: 'Kementerian Perencanaan Pembangunan Nasional/Bappenas',
    short_name: 'Bappenas',
    type: 'Kementerian',
    url: 'https://www.bappenas.go.id',
    employee_count: 980,
    avg_tenure: 13.5,
    avg_performance: 4.4,
    training_programs_count: 105,
    certification_rate: 86,
    avg_education_level: 'S2',
    succession_plan_coverage: 89,
    merit_assessment_frequency: 12,
    talent_pipeline_ratio: 0.31,
    development_budget_per_capita: 21000000,
    merit_index: 89.9,
    compliance_score: 93,
    talent_pipeline_strength: 89,
    training_adequacy: 91,
    confidence: 0.95,
    scraped_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  }
];

/**
 * Generate detailed analysis for an institution
 */
export function generateInstitutionAnalysis(institution) {
  const analysis = {
    institution_id: institution.id,
    institution_name: institution.name,
    merit_index: institution.merit_index,
    
    // Breakdown scores
    scores: {
      compliance_score: institution.compliance_score,
      talent_pipeline_strength: institution.talent_pipeline_strength,
      training_adequacy: institution.training_adequacy
    },
    
    // Performance categories
    category: getPerformanceCategory(institution.merit_index),
    rank: 0, // Will be calculated
    
    // Detailed factors
    factors: {
      strong_points: getStrongPoints(institution),
      improvement_areas: getImprovementAreas(institution),
      recommendations: getRecommendations(institution)
    },
    
    // Compliance with Permenpan RB No. 3/2020
    compliance_details: {
      merit_system_principles: analyzeComplianceWithMeritPrinciples(institution),
      talent_acquisition: analyzeTalentAcquisition(institution),
      talent_development: analyzeTalentDevelopment(institution),
      succession_planning: analyzeSuccessionPlanning(institution),
      performance_management: analyzePerformanceManagement(institution)
    },
    
    confidence: institution.confidence,
    analyzed_at: new Date().toISOString()
  };
  
  return analysis;
}

function getPerformanceCategory(meritIndex) {
  if (meritIndex >= 90) return 'Sangat Baik';
  if (meritIndex >= 80) return 'Baik';
  if (meritIndex >= 70) return 'Cukup';
  if (meritIndex >= 60) return 'Kurang';
  return 'Perlu Perbaikan Mendesak';
}

function getStrongPoints(inst) {
  const points = [];
  
  if (inst.compliance_score >= 90) {
    points.push('Kepatuhan tinggi terhadap sistem merit (Permenpan RB No. 3/2020)');
  }
  
  if (inst.avg_performance >= 4.0) {
    points.push(`Rata-rata kinerja pegawai ${inst.avg_performance}/5.0 - di atas ekspektasi`);
  }
  
  if (inst.succession_plan_coverage >= 85) {
    points.push(`Coverage succession planning ${inst.succession_plan_coverage}% - sangat baik`);
  }
  
  if (inst.certification_rate >= 80) {
    points.push(`Tingkat sertifikasi pegawai ${inst.certification_rate}% - tinggi`);
  }
  
  if (inst.talent_pipeline_ratio >= 0.25) {
    points.push('Rasio talent pipeline yang kuat untuk posisi strategis');
  }
  
  if (inst.avg_tenure >= 12) {
    points.push(`Retensi pegawai baik dengan rata-rata masa kerja ${inst.avg_tenure} tahun`);
  }
  
  return points;
}

function getImprovementAreas(inst) {
  const areas = [];
  
  if (inst.compliance_score < 80) {
    areas.push('Kepatuhan terhadap sistem merit perlu ditingkatkan');
  }
  
  if (inst.avg_performance < 3.5) {
    areas.push('Rata-rata kinerja pegawai di bawah standar optimal');
  }
  
  if (inst.succession_plan_coverage < 75) {
    areas.push('Coverage succession planning masih rendah');
  }
  
  if (inst.certification_rate < 70) {
    areas.push('Tingkat sertifikasi pegawai perlu ditingkatkan');
  }
  
  if (inst.talent_pipeline_ratio < 0.20) {
    areas.push('Talent pipeline untuk posisi strategis kurang memadai');
  }
  
  if (inst.merit_assessment_frequency < 10) {
    areas.push('Frekuensi assessment merit perlu ditingkatkan (minimal 10x/tahun)');
  }
  
  if (inst.development_budget_per_capita < 15000000) {
    areas.push('Anggaran pengembangan SDM per kapita masih di bawah ideal');
  }
  
  return areas;
}

function getRecommendations(inst) {
  const recs = [];
  
  // Compliance recommendations
  if (inst.compliance_score < 85) {
    recs.push('Implementasikan prinsip-prinsip merit system secara konsisten (objektif, terencana, terbuka, tepat waktu, akuntabel)');
  }
  
  // Talent pipeline recommendations
  if (inst.talent_pipeline_ratio < 0.25) {
    recs.push('Perluas program identifikasi dan pengembangan talent untuk posisi kritis');
    recs.push('Implementasikan Assessment Center untuk mapping potensi pegawai');
  }
  
  // Training recommendations
  if (inst.certification_rate < 75) {
    recs.push('Tingkatkan program sertifikasi kompetensi sesuai standar jabatan');
    recs.push('Alokasikan budget lebih untuk program pengembangan kompetensi');
  }
  
  // Succession planning recommendations
  if (inst.succession_plan_coverage < 80) {
    recs.push('Perluas coverage succession planning untuk semua posisi strategis');
    recs.push('Buat talent pool untuk setiap posisi kritis dengan minimal 2-3 successor');
  }
  
  // Performance management recommendations
  if (inst.avg_performance < 4.0) {
    recs.push('Implementasikan performance coaching untuk pegawai dengan kinerja di bawah ekspektasi');
    recs.push('Tingkatkan frekuensi feedback dan monitoring kinerja');
  }
  
  // General recommendations based on Permenpan RB
  recs.push('Lakukan monitoring dan evaluasi implementasi manajemen talenta secara berkala');
  recs.push('Integrasikan sistem informasi manajemen talenta dengan sistem kepegawaian nasional');
  
  return recs;
}

function analyzeComplianceWithMeritPrinciples(inst) {
  const score = inst.compliance_score;
  
  return {
    score: score,
    status: score >= 85 ? 'Compliant' : score >= 70 ? 'Partially Compliant' : 'Non-Compliant',
    principles: {
      objektif: score >= 80 ? 'Terpenuhi' : 'Perlu Perbaikan',
      terencana: inst.succession_plan_coverage >= 75 ? 'Terpenuhi' : 'Perlu Perbaikan',
      terbuka: inst.merit_assessment_frequency >= 10 ? 'Terpenuhi' : 'Perlu Perbaikan',
      tepat_waktu: inst.merit_assessment_frequency >= 12 ? 'Terpenuhi' : 'Perlu Perbaikan',
      akuntabel: score >= 85 ? 'Terpenuhi' : 'Perlu Perbaikan',
      bebas_intervensi_politik: 'Diasumsikan Terpenuhi',
      bebas_kkn: 'Diasumsikan Terpenuhi'
    }
  };
}

function analyzeTalentAcquisition(inst) {
  return {
    critical_position_identified: inst.succession_plan_coverage >= 70 ? 'Ya' : 'Perlu Ditingkatkan',
    talent_needs_analysis: inst.training_programs_count >= 100 ? 'Memadai' : 'Perlu Diperbaiki',
    assessment_methods: {
      performance_ranking: inst.avg_performance >= 3.5 ? 'Diterapkan' : 'Perlu Perbaikan',
      potential_assessment: inst.talent_pipeline_ratio >= 0.20 ? 'Diterapkan' : 'Perlu Diperluas',
      assessment_center: inst.certification_rate >= 75 ? 'Diterapkan' : 'Perlu Diperluas'
    }
  };
}

function analyzeTalentDevelopment(inst) {
  return {
    career_acceleration: inst.talent_pipeline_ratio >= 0.25 ? 'Berjalan Baik' : 'Perlu Diperkuat',
    competency_development: {
      training_programs: inst.training_programs_count,
      certification_rate: inst.certification_rate,
      status: inst.certification_rate >= 75 ? 'Memadai' : 'Perlu Ditingkatkan'
    },
    budget_allocation: {
      per_capita: inst.development_budget_per_capita,
      adequacy: inst.development_budget_per_capita >= 15000000 ? 'Memadai' : 'Perlu Ditingkatkan'
    }
  };
}

function analyzeSuccessionPlanning(inst) {
  return {
    coverage: inst.succession_plan_coverage,
    status: inst.succession_plan_coverage >= 80 ? 'Baik' : inst.succession_plan_coverage >= 60 ? 'Cukup' : 'Kurang',
    talent_pool_ratio: inst.talent_pipeline_ratio,
    recommendation: inst.succession_plan_coverage < 80 ? 
      'Perluas coverage ke semua posisi strategis dengan minimal 2-3 successor per posisi' : 
      'Pertahankan dan tingkatkan kualitas succession plan'
  };
}

function analyzePerformanceManagement(inst) {
  return {
    avg_performance: inst.avg_performance,
    assessment_frequency: inst.merit_assessment_frequency,
    status: inst.avg_performance >= 4.0 && inst.merit_assessment_frequency >= 10 ? 
      'Efektif' : 'Perlu Perbaikan',
    recommendation: inst.avg_performance < 4.0 ? 
      'Implementasikan program performance improvement dan coaching' : 
      'Pertahankan standar kinerja tinggi'
  };
}

export default mockInstitutions;
