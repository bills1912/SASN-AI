// Mock AI responses for demonstration when USE_MOCK_MODE is true
import { calculateSumbuX, calculateSumbuY, determine9BoxPosition } from './meritCalculation.js';

export function getMockTalentMapping(profile) {
  const performanceScore = profile.performanceScore || 85;
  const yearsOfService = profile.yearsOfService || 5;
  
  // Generate realistic data based on profile
  // Budi (high performer) akan punya data berbeda dari Ahmad
  const isHighPerformer = profile.name === 'Budi Santoso';
  const isMediumPerformer = profile.name === 'Ahmad Rizaldi';
  
  // Data untuk perhitungan Sumbu X (Potensi)
  const sumbuXData = {
    jobFit: isHighPerformer ? 88 : isMediumPerformer ? 72 : 65,
    gapPotensi: isHighPerformer ? -2 : isMediumPerformer ? 0 : 2,
    diklatTeknis: isHighPerformer ? 85 : isMediumPerformer ? 57 : 35,
    pendidikan: isHighPerformer ? 'S2' : isMediumPerformer ? 'D-IV' : 'S1',
    pengalaman: isHighPerformer ? 8 : isMediumPerformer ? 2.2 : 1.5
  };
  
  // Data untuk perhitungan Sumbu Y (Kinerja)
  const sumbuYData = {
    skpRating: isHighPerformer ? 'Sangat Baik' : isMediumPerformer ? 'Baik' : 'Cukup'
  };
  
  // Hitung menggunakan merit calculation yang sebenarnya
  const sumbuX = calculateSumbuX(sumbuXData);
  const sumbuY = calculateSumbuY(sumbuYData);
  const position = determine9BoxPosition(sumbuX.totalScore, sumbuY.totalScore);
  
  // Map ke performance & potential levels
  const performanceLevel = position.levelY === 'High' ? 3 : position.levelY === 'Medium' ? 2 : 1;
  const potentialLevel = position.levelX === 'High' ? 3 : position.levelX === 'Medium' ? 2 : 1;
  
  return {
    performance: {
      score: performanceLevel,
      level: position.levelY,
      sumbuY: sumbuY.totalScore,
      justification: `Berdasarkan SKP ${sumbuYData.skpRating}, dengan skor Sumbu Y: ${sumbuY.totalScore.toFixed(2)}/3.0. Menunjukkan kinerja ${position.levelY.toLowerCase()} dalam menjalankan tugas.`
    },
    potential: {
      score: potentialLevel,
      level: position.levelX,
      sumbuX: sumbuX.totalScore,
      justification: `Berdasarkan analisis 5 aspek (Job Fit: ${sumbuXData.jobFit}%, Diklat: ${sumbuXData.diklatTeknis} JP, Pendidikan: ${sumbuXData.pendidikan}), dengan skor Sumbu X: ${sumbuX.totalScore.toFixed(2)}/3.0. Menunjukkan potensi ${position.levelX.toLowerCase()}.`,
      breakdown: sumbuX.breakdown
    },
    quadrant: {
      x: sumbuX.totalScore,
      y: sumbuY.totalScore,
      category: position.label,
      description: position.quadrant
    },
    talentBox: position.label,
    boxNumber: position.box,
    priority: position.priority,
    careerPath: [
      `${profile.position} Senior/Expert`,
      potentialLevel >= 2 ? 'Kepala Seksi/Sub Bagian' : 'Specialist',
      potentialLevel === 3 ? 'Kepala Bidang/Bagian' : 'Senior Specialist',
      potentialLevel === 3 ? 'Eselon III/II' : 'Principal Specialist'
    ],
    developmentAreas: [
      'Kepemimpinan strategis dan pengambilan keputusan',
      'Manajemen perubahan dan inovasi',
      'Networking dan kolaborasi lintas sektor',
      'Pengembangan kompetensi teknis advanced'
    ],
    suitablePositions: [
      {
        position: `Kepala Seksi ${profile.position}`,
        fit: 88,
        reason: 'Kompetensi teknis kuat dan pengalaman relevan mendukung peran leadership'
      },
      {
        position: 'Analis Senior',
        fit: 92,
        reason: 'Track record kinerja excellent dan keahlian teknis yang mendalam'
      },
      {
        position: 'Project Manager',
        fit: 85,
        reason: 'Pengalaman mengelola project dan kemampuan koordinasi yang baik'
      }
    ],
    riskLevel: performanceLevel <= 1 ? 'High' : performanceLevel === 2 ? 'Medium' : 'Low',
    recommendations: [
      'Mengikuti program Leadership Development untuk memperkuat kompetensi manajerial',
      'Partisipasi aktif dalam project strategis untuk meningkatkan visibility',
      'Mengambil sertifikasi profesional level advanced di bidang keahlian',
      'Menjadi mentor bagi pegawai junior untuk mengembangkan coaching skills',
      'Terlibat dalam task force lintas direktorat untuk memperluas network'
    ]
  };
}

export function getMockSkillAnalysis(profile) {
  const technicalSkills = profile.skills?.technical || [];
  const softSkills = profile.skills?.soft || [];
  
  return {
    technicalSkills: technicalSkills.map((skill, idx) => ({
      skill: skill,
      proficiency: 70 + (idx * 5),
      benchmark: 75 + (idx * 3),
      gap: (75 + (idx * 3)) - (70 + (idx * 5))
    })),
    softSkills: softSkills.map((skill, idx) => ({
      skill: skill,
      proficiency: 75 + (idx * 4),
      importance: 85
    })),
    skillGaps: [
      {
        skill: 'AI/Machine Learning',
        currentLevel: 65,
        requiredLevel: 85,
        priority: 'High'
      },
      {
        skill: 'Data Visualization',
        currentLevel: 75,
        requiredLevel: 90,
        priority: 'Medium'
      },
      {
        skill: 'Cloud Computing',
        currentLevel: 60,
        requiredLevel: 80,
        priority: 'High'
      }
    ],
    emergingSkills: [
      {
        skill: 'Generative AI',
        relevance: 'Critical untuk modernisasi layanan publik dan efisiensi operasional',
        learningPath: 'Online courses, hands-on projects, certification programs'
      },
      {
        skill: 'Data Governance',
        relevance: 'Penting untuk compliance dan keamanan data pemerintah',
        learningPath: 'Professional certification, workshop, best practices study'
      },
      {
        skill: 'Agile Project Management',
        relevance: 'Meningkatkan kecepatan delivery dan adaptabilitas tim',
        learningPath: 'Scrum Master certification, Agile coaching, sprint participation'
      }
    ],
    developmentRoadmap: [
      {
        phase: '1-3 bulan',
        skills: ['AI Fundamentals', 'Python Advanced', 'Data Analytics'],
        resources: ['Coursera AI Course', 'Internal Workshop', 'Mentoring Program']
      },
      {
        phase: '4-6 bulan',
        skills: ['Machine Learning', 'Cloud Architecture', 'Leadership'],
        resources: ['Google Cloud Certification', 'LAN Leadership Program', 'Project Leadership']
      },
      {
        phase: '7-12 bulan',
        skills: ['Strategic Planning', 'Change Management', 'Innovation Management'],
        resources: ['Executive Education', 'Strategic Project', 'Cross-functional Team Lead']
      }
    ],
    overallScore: profile.performanceScore || 82
  };
}

export function getMockPerformanceAnalysis(profile, performanceData) {
  const totalScore = performanceData?.totalScore || 85;
  const trend = totalScore >= 85 ? 'improving' : totalScore >= 70 ? 'stable' : 'declining';
  
  return {
    quadrant: {
      category: totalScore >= 85 ? 'High Performance - High Potential' : 
                totalScore >= 70 ? 'Solid Performer' : 
                'Needs Development',
      x: totalScore,
      y: Math.min(totalScore + 5, 95),
      description: 'Klasifikasi berdasarkan kinerja aktual dan potensi pengembangan pegawai'
    },
    classification: totalScore >= 90 ? 'Excellent' :
                    totalScore >= 85 ? 'Very Good' :
                    totalScore >= 70 ? 'Good' :
                    totalScore >= 60 ? 'Needs Improvement' :
                    'Poor',
    strengths: [
      {
        area: 'Technical Competency',
        score: 88,
        evidence: 'Menguasai tools dan teknologi terkini, mampu menyelesaikan complex problems dengan efisien'
      },
      {
        area: 'Work Quality',
        score: 90,
        evidence: 'Output kerja berkualitas tinggi, detail-oriented, dan konsisten memenuhi standar'
      },
      {
        area: 'Initiative & Innovation',
        score: 85,
        evidence: 'Proaktif mengusulkan improvement, berkontribusi pada inovasi layanan'
      }
    ],
    weaknesses: [
      {
        area: 'Delegation Skills',
        score: 65,
        impact: 'Cenderung mengerjakan sendiri, perlu meningkatkan kemampuan delegasi untuk efisiensi tim'
      },
      {
        area: 'Stakeholder Communication',
        score: 70,
        impact: 'Komunikasi dengan stakeholder eksternal masih perlu ditingkatkan untuk collaboration'
      }
    ],
    trends: {
      direction: trend,
      analysis: trend === 'improving' ? 
        'Menunjukkan tren peningkatan kinerja konsisten dalam 2 tahun terakhir. Target achievement meningkat 15% YoY.' :
        trend === 'stable' ? 
        'Kinerja stabil di level baik. Perlu breakthrough untuk mencapai level excellent.' :
        'Terjadi penurunan kinerja. Perlu intervensi dan support untuk improvement.'
    },
    riskFactors: [
      {
        factor: 'Workload Balance',
        severity: 'Medium',
        mitigation: 'Redistribute tasks, improve time management, consider delegation training'
      },
      {
        factor: 'Skill Obsolescence',
        severity: 'Low',
        mitigation: 'Continuous learning program, attend workshops and certifications'
      }
    ],
    recommendations: {
      technical: [
        {
          action: 'Mengikuti advanced training di bidang Data Science dan AI',
          priority: 'High',
          timeline: '3-6 bulan'
        },
        {
          action: 'Mendapatkan sertifikasi profesional level expert',
          priority: 'High',
          timeline: '6 bulan'
        },
        {
          action: 'Memimpin proyek implementasi teknologi baru',
          priority: 'Medium',
          timeline: '6-12 bulan'
        }
      ],
      nonTechnical: [
        {
          action: 'Program Leadership Development',
          type: 'training',
          benefit: 'Meningkatkan kemampuan memimpin tim dan mengelola stakeholder'
        },
        {
          action: 'Executive Coaching',
          type: 'mentoring',
          benefit: 'Mendapatkan guidance dari senior leader untuk career advancement'
        },
        {
          action: 'Seminar Nasional Transformasi Digital ASN',
          type: 'seminar',
          benefit: 'Networking dengan peers dan update best practices terkini'
        },
        {
          action: 'Riset Kolaboratif dengan Universitas',
          type: 'research',
          benefit: 'Mengembangkan thought leadership dan publikasi ilmiah'
        }
      ]
    },
    developmentPlan: [
      {
        quarter: 'Q1 2025',
        focus: 'Technical Excellence',
        activities: [
          'Complete AI/ML Certification',
          'Lead 1 strategic project',
          'Publish 1 technical paper'
        ]
      },
      {
        quarter: 'Q2 2025',
        focus: 'Leadership Development',
        activities: [
          'Leadership training program',
          'Mentor 2 junior staff',
          'Present at national forum'
        ]
      },
      {
        quarter: 'Q3 2025',
        focus: 'Strategic Collaboration',
        activities: [
          'Cross-agency project',
          'Stakeholder management',
          'Innovation initiative'
        ]
      },
      {
        quarter: 'Q4 2025',
        focus: 'Impact & Recognition',
        activities: [
          'Performance excellence award',
          'Best practice documentation',
          'Career advancement discussion'
        ]
      }
    ]
  };
}
