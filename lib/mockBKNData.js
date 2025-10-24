// Mock BKN data and API responses

export const mockASNProfiles = [
  // Kementerian Keuangan
  {
    id: 'ASN001',
    nip: '199002152015031002',
    name: 'Budi Santoso',
    position: 'Analis Data',
    agency: 'Kementerian Keuangan',
    grade: 'III/d',
    education: 'S2 Ilmu Komputer',
    yearsOfService: 9,
    performanceScore: 85,
    portfolioUrl: 'https://linkedin.com/in/budisantoso',
    achievements: [
      'Penghargaan ASN Berprestasi 2023',
      'Sertifikasi Data Analyst Professional',
      'Patent: Sistem Analisis Keuangan Berbasis AI'
    ],
    trainings: [
      { name: 'Machine Learning Fundamentals', year: 2023, institution: 'Coursera' },
      { name: 'Advanced Python Programming', year: 2022, institution: 'LAN' },
      { name: 'Big Data Analytics', year: 2023, institution: 'Google Cloud' }
    ],
    projects: [
      { name: 'Sistem Monitoring APBN Real-time', role: 'Lead Developer', type: 'technical' },
      { name: 'Dashboard Visualisasi Data Keuangan', role: 'Data Analyst', type: 'technical' },
      { name: 'Koordinasi Event G20', role: 'Event Organizer', type: 'non-technical' }
    ],
    skills: {
      technical: ['Python', 'SQL', 'Data Analysis', 'Machine Learning', 'Power BI'],
      soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Adaptability']
    }
  },
  {
    id: 'ASN004',
    nip: '199205102016031003',
    name: 'Dewi Lestari',
    position: 'Auditor Keuangan',
    agency: 'Kementerian Keuangan',
    grade: 'III/c',
    education: 'S1 Akuntansi',
    yearsOfService: 8,
    performanceScore: 88,
    portfolioUrl: null,
    achievements: [
      'Sertifikasi Auditor Profesional',
      'Best Auditor 2023'
    ],
    trainings: [
      { name: 'Internal Audit', year: 2023, institution: 'LAN' },
      { name: 'Financial Analysis', year: 2022, institution: 'IAI' }
    ],
    projects: [
      { name: 'Audit APBN 2023', role: 'Lead Auditor', type: 'technical' },
      { name: 'Risk Assessment Project', role: 'Auditor', type: 'technical' }
    ],
    skills: {
      technical: ['Auditing', 'Financial Analysis', 'Risk Management', 'Excel'],
      soft: ['Critical Thinking', 'Detail Oriented', 'Communication']
    }
  },
  {
    id: 'ASN005',
    nip: '198812202014011004',
    name: 'Eko Prasetyo',
    position: 'Staff Administrasi',
    agency: 'Kementerian Keuangan',
    grade: 'II/d',
    education: 'S1 Administrasi',
    yearsOfService: 10,
    performanceScore: 72,
    portfolioUrl: null,
    achievements: [
      'Penyelesaian Tugas Tepat Waktu 2023'
    ],
    trainings: [
      { name: 'Office Administration', year: 2021, institution: 'LAN' }
    ],
    projects: [
      { name: 'Digitalisasi Arsip', role: 'Staff', type: 'technical' }
    ],
    skills: {
      technical: ['Microsoft Office', 'Filing', 'Data Entry'],
      soft: ['Time Management', 'Cooperation', 'Discipline']
    }
  },
  {
    id: 'ASN006',
    nip: '199108152017032002',
    name: 'Ratna Sari',
    position: 'Perencana Anggaran',
    agency: 'Kementerian Keuangan',
    grade: 'III/d',
    education: 'S2 Ekonomi',
    yearsOfService: 7,
    performanceScore: 90,
    portfolioUrl: null,
    achievements: [
      'Inovasi Perencanaan Anggaran 2024',
      'Best Planner Award'
    ],
    trainings: [
      { name: 'Budget Planning', year: 2023, institution: 'LAN' },
      { name: 'Economic Analysis', year: 2022, institution: 'FEB UI' }
    ],
    projects: [
      { name: 'RAPBN 2024', role: 'Lead Planner', type: 'technical' },
      { name: 'Budget Optimization', role: 'Analyst', type: 'technical' }
    ],
    skills: {
      technical: ['Budget Planning', 'Economic Analysis', 'Forecasting'],
      soft: ['Strategic Thinking', 'Analytical', 'Communication']
    }
  },

  // Kementerian Pendidikan
  {
    id: 'ASN002',
    nip: '198705102012042001',
    name: 'Siti Nurhaliza',
    position: 'Kepala Seksi Pelayanan',
    agency: 'Kementerian Pendidikan',
    grade: 'IV/a',
    education: 'S2 Administrasi Publik',
    yearsOfService: 12,
    performanceScore: 92,
    portfolioUrl: 'https://linkedin.com/in/sitinurhaliza',
    achievements: [
      'Penghargaan Pelayanan Prima 2022',
      'Best Innovator Award 2023',
      'Sertifikasi ISO 9001 Lead Auditor'
    ],
    trainings: [
      { name: 'Strategic Leadership', year: 2023, institution: 'LAN' },
      { name: 'Service Excellence', year: 2022, institution: 'ASEAN Institute' },
      { name: 'Digital Transformation', year: 2023, institution: 'BKN' }
    ],
    projects: [
      { name: 'Digitalisasi Sistem Pelayanan Publik', role: 'Project Manager', type: 'technical' },
      { name: 'Program Reformasi Birokrasi', role: 'Team Leader', type: 'non-technical' },
      { name: 'Implementasi E-Government', role: 'Coordinator', type: 'technical' }
    ],
    skills: {
      technical: ['Project Management', 'Business Process', 'Quality Management'],
      soft: ['Strategic Thinking', 'Leadership', 'Change Management', 'Communication', 'Negotiation']
    }
  },
  {
    id: 'ASN007',
    nip: '199303152018011005',
    name: 'Rudi Hartono',
    position: 'Guru Pembina',
    agency: 'Kementerian Pendidikan',
    grade: 'IV/b',
    education: 'S2 Pendidikan',
    yearsOfService: 6,
    performanceScore: 87,
    portfolioUrl: null,
    achievements: [
      'Guru Berprestasi 2023',
      'Sertifikasi Pendidik'
    ],
    trainings: [
      { name: 'Pedagogical Innovation', year: 2023, institution: 'Kemdikbud' },
      { name: 'Classroom Management', year: 2022, institution: 'LAN' }
    ],
    projects: [
      { name: 'Kurikulum Merdeka', role: 'Trainer', type: 'non-technical' },
      { name: 'Digital Learning Platform', role: 'Content Creator', type: 'technical' }
    ],
    skills: {
      technical: ['Curriculum Development', 'E-Learning', 'Assessment'],
      soft: ['Teaching', 'Communication', 'Patience', 'Creativity']
    }
  },
  {
    id: 'ASN008',
    nip: '199010052015042003',
    name: 'Fitri Handayani',
    position: 'Analis Program',
    agency: 'Kementerian Pendidikan',
    grade: 'III/c',
    education: 'S1 Statistika',
    yearsOfService: 9,
    performanceScore: 80,
    portfolioUrl: null,
    achievements: [
      'Program Evaluasi Terbaik 2023'
    ],
    trainings: [
      { name: 'Program Evaluation', year: 2023, institution: 'LAN' },
      { name: 'Data Analysis', year: 2022, institution: 'BPS' }
    ],
    projects: [
      { name: 'Evaluasi Program Pendidikan', role: 'Analyst', type: 'technical' }
    ],
    skills: {
      technical: ['Statistical Analysis', 'SPSS', 'Research'],
      soft: ['Analytical Thinking', 'Report Writing', 'Presentation']
    }
  },
  {
    id: 'ASN009',
    nip: '198609202013031006',
    name: 'Yudi Prasetya',
    position: 'Staff IT',
    agency: 'Kementerian Pendidikan',
    grade: 'III/a',
    education: 'S1 Teknik Informatika',
    yearsOfService: 11,
    performanceScore: 75,
    portfolioUrl: null,
    achievements: [
      'Maintenance System Award 2022'
    ],
    trainings: [
      { name: 'Network Administration', year: 2021, institution: 'Cisco' }
    ],
    projects: [
      { name: 'Server Maintenance', role: 'IT Support', type: 'technical' }
    ],
    skills: {
      technical: ['Network', 'Server Administration', 'Troubleshooting'],
      soft: ['Problem Solving', 'Customer Service']
    }
  },

  // Kementerian Dalam Negeri
  {
    id: 'ASN003',
    nip: '199503202017011003',
    name: 'Ahmad Rizaldi',
    position: 'Analis Kebijakan',
    agency: 'Kementerian Dalam Negeri',
    grade: 'III/b',
    education: 'S1 Ilmu Pemerintahan',
    yearsOfService: 7,
    performanceScore: 78,
    portfolioUrl: null,
    achievements: [
      'Partisipasi Lomba Inovasi ASN 2023'
    ],
    trainings: [
      { name: 'Policy Analysis', year: 2022, institution: 'LAN' },
      { name: 'Good Governance', year: 2021, institution: 'BKN' }
    ],
    projects: [
      { name: 'Kajian Kebijakan Otonomi Daerah', role: 'Analyst', type: 'non-technical' },
      { name: 'Evaluasi Program Pemerintah Daerah', role: 'Researcher', type: 'non-technical' }
    ],
    skills: {
      technical: ['Policy Analysis', 'Research', 'Report Writing'],
      soft: ['Analytical Thinking', 'Communication', 'Attention to Detail']
    }
  },
  {
    id: 'ASN010',
    nip: '199201102016012004',
    name: 'Linda Wati',
    position: 'Kepala Sub Bagian',
    agency: 'Kementerian Dalam Negeri',
    grade: 'IV/a',
    education: 'S2 Manajemen Pemerintahan',
    yearsOfService: 8,
    performanceScore: 89,
    portfolioUrl: null,
    achievements: [
      'Leader of the Year 2023',
      'Inovasi Pelayanan Publik'
    ],
    trainings: [
      { name: 'Leadership Excellence', year: 2023, institution: 'LAN' },
      { name: 'Public Service Innovation', year: 2022, institution: 'Kemendagri' }
    ],
    projects: [
      { name: 'Reformasi Birokrasi Daerah', role: 'Project Leader', type: 'non-technical' },
      { name: 'Smart City Implementation', role: 'Coordinator', type: 'technical' }
    ],
    skills: {
      technical: ['Project Management', 'Strategic Planning'],
      soft: ['Leadership', 'Decision Making', 'Teamwork']
    }
  },
  {
    id: 'ASN011',
    nip: '199406152019021005',
    name: 'Fajar Nugroho',
    position: 'Analis Pemerintahan',
    agency: 'Kementerian Dalam Negeri',
    grade: 'III/a',
    education: 'S1 Administrasi Negara',
    yearsOfService: 5,
    performanceScore: 76,
    portfolioUrl: null,
    achievements: [
      'ASN Muda Berprestasi 2024'
    ],
    trainings: [
      { name: 'Government Analysis', year: 2023, institution: 'LAN' }
    ],
    projects: [
      { name: 'Survey Kepuasan Masyarakat', role: 'Surveyor', type: 'non-technical' }
    ],
    skills: {
      technical: ['Survey', 'Data Processing', 'Analysis'],
      soft: ['Communication', 'Field Work', 'Reporting']
    }
  },
  {
    id: 'ASN012',
    nip: '198805252011032007',
    name: 'Nur Azizah',
    position: 'Staff Sekretariat',
    agency: 'Kementerian Dalam Negeri',
    grade: 'II/c',
    education: 'D3 Sekretaris',
    yearsOfService: 13,
    performanceScore: 70,
    portfolioUrl: null,
    achievements: [
      'Penghargaan Kehadiran 100%'
    ],
    trainings: [
      { name: 'Office Management', year: 2020, institution: 'LAN' }
    ],
    projects: [
      { name: 'Arsip Digital', role: 'Staff', type: 'technical' }
    ],
    skills: {
      technical: ['Office Administration', 'Filing', 'Documentation'],
      soft: ['Discipline', 'Time Management', 'Cooperation']
    }
  }
];

export const mockPerformanceData = [
  {
    nip: '199002152015031002',
    year: 2024,
    agency: 'Kementerian Keuangan',
    assessmentMethod: 'Sistem Kinerja Individu (SKI)',
    scores: {
      targetAchievement: 90,
      behaviorCompetency: 85,
      technicalCompetency: 88,
      innovation: 85,
      collaboration: 82
    },
    totalScore: 86,
    predicate: 'Sangat Baik',
    period: 'Januari - Desember 2024'
  },
  {
    nip: '198705102012042001',
    year: 2024,
    agency: 'Kementerian Pendidikan',
    assessmentMethod: 'Penilaian Kinerja ASN (PKA)',
    scores: {
      outputRealization: 95,
      serviceQuality: 92,
      workEfficiency: 90,
      leadership: 93,
      integrity: 94
    },
    totalScore: 92.8,
    predicate: 'Istimewa',
    period: 'Januari - Desember 2024'
  },
  {
    nip: '199503202017011003',
    year: 2024,
    agency: 'Kementerian Dalam Negeri',
    assessmentMethod: 'Evaluasi Kinerja Berkala',
    scores: {
      workQuantity: 75,
      workQuality: 78,
      timeliness: 80,
      responsibility: 82,
      initiative: 75
    },
    totalScore: 78,
    predicate: 'Baik',
    period: 'Januari - Desember 2024'
  }
];

export const mockAgencyAPIs = [
  {
    agency: 'Kementerian Keuangan',
    endpoint: '/api/mock-bkn/kemenkeu/performance',
    method: 'SKI - Sistem Kinerja Individu'
  },
  {
    agency: 'Kementerian Pendidikan',
    endpoint: '/api/mock-bkn/kemendikbud/performance',
    method: 'PKA - Penilaian Kinerja ASN'
  },
  {
    agency: 'Kementerian Dalam Negeri',
    endpoint: '/api/mock-bkn/kemendagri/performance',
    method: 'EKB - Evaluasi Kinerja Berkala'
  }
];

export const mockASNNews = [
  {
    title: 'BKN Luncurkan Program Pelatihan Digital Transformation untuk ASN',
    source: 'Kompas.com',
    date: '2024-12-15',
    url: 'https://kompas.com/asn-digital-training',
    summary: 'BKN meluncurkan program pelatihan digital transformation untuk meningkatkan kompetensi ASN di era digital.'
  },
  {
    title: 'Peningkatan Kompetensi ASN Melalui Sertifikasi Profesional',
    source: 'Detik.com',
    date: '2024-12-10',
    url: 'https://detik.com/asn-certification',
    summary: 'Pemerintah mendorong ASN untuk mengikuti sertifikasi profesional guna meningkatkan kualitas pelayanan publik.'
  },
  {
    title: 'Implementasi AI dalam Manajemen ASN Mulai Diterapkan',
    source: 'Tempo.co',
    date: '2024-12-05',
    url: 'https://tempo.co/ai-asn-management',
    summary: 'BKN mulai menerapkan teknologi AI untuk optimalisasi manajemen talenta dan penilaian kinerja ASN.'
  }
];

export function getASNProfile(nip) {
  return mockASNProfiles.find(profile => profile.nip === nip);
}

export function getPerformanceData(nip) {
  return mockPerformanceData.find(data => data.nip === nip);
}

export function getAllASNProfiles() {
  return mockASNProfiles;
}

export function getAllPerformanceData() {
  return mockPerformanceData;
}