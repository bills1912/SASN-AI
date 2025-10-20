// Mock BKN data and API responses

export const mockASNProfiles = [
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