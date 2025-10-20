// Mock AI responses for demonstration when USE_MOCK_MODE is true

export function getMockTalentMapping(profile) {
  const performanceScore = profile.performanceScore || 85;
  const yearsOfService = profile.yearsOfService || 5;
  
  // Calculate scores based on profile data
  const performanceLevel = performanceScore >= 85 ? 3 : performanceScore >= 70 ? 2 : 1;
  const potentialLevel = yearsOfService < 5 && performanceScore >= 80 ? 3 : 
                        yearsOfService >= 5 && performanceScore >= 85 ? 3 : 
                        performanceScore >= 70 ? 2 : 1;
  
  return {
    performance: {
      score: performanceLevel,
      level: performanceLevel === 3 ? 'High' : performanceLevel === 2 ? 'Medium' : 'Low',
      justification: `Dengan skor kinerja ${performanceScore}/100 dan ${yearsOfService} tahun pengalaman, menunjukkan kinerja yang ${performanceLevel === 3 ? 'sangat baik' : performanceLevel === 2 ? 'baik' : 'perlu peningkatan'} dalam menjalankan tugas.`
    },
    potential: {
      score: potentialLevel,
      level: potentialLevel === 3 ? 'High' : potentialLevel === 2 ? 'Medium' : 'Low',
      justification: `Berdasarkan analisis kompetensi, pendidikan, dan pengalaman kerja, memiliki potensi ${potentialLevel === 3 ? 'tinggi' : potentialLevel === 2 ? 'moderat' : 'perlu pengembangan'} untuk posisi yang lebih strategis.`
    },
    quadrant: {
      x: performanceLevel,
      y: potentialLevel,
      category: performanceLevel === 3 && potentialLevel === 3 ? 'Star/High Performer' :
                performanceLevel === 3 && potentialLevel === 2 ? 'Solid Professional' :
                performanceLevel === 2 && potentialLevel === 3 ? 'High Potential' :
                'Core Performer',
      description: 'Pegawai dengan kombinasi kinerja dan potensi yang menentukan jalur pengembangan karirnya.'
    },
    talentBox: performanceLevel === 3 && potentialLevel === 3 ? 'High Performer - High Potential (Star)' :
               performanceLevel === 3 ? 'High Performer' :
               potentialLevel === 3 ? 'High Potential' :
               'Solid Professional',
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
