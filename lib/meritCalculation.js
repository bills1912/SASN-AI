/**
 * Merit Calculation System - Linear dengan Metode Kemenpan RB
 * Berdasarkan asik.menpan.go.id
 * 
 * Sistem Penilaian:
 * - Sumbu X (Potensi): Job Fit, Gap Potensi, Diklat Teknis, Pendidikan, Pengalaman
 * - Sumbu Y (Kinerja): SKP (Sasaran Kinerja Pegawai)
 */

// Konversi Skala 3 untuk berbagai metrik
export const conversionScales = {
  jobFit: {
    excellent: { min: 85, max: 100, score: 3 },
    good: { min: 72, max: 84, score: 2 },
    average: { min: 60, max: 71, score: 1 },
    poor: { min: 0, max: 59, score: 0 }
  },
  
  gapPotensi: {
    // Nilai negatif berarti potensi melebihi jabatan (siap promosi)
    // Nilai positif berarti ada gap yang perlu dikembangkan
    excellent: { min: -5, max: -2, score: 3 }, // Overqualified
    good: { min: -1, max: 0, score: 2 }, // Ready
    average: { min: 1, max: 2, score: 1 }, // Development needed
    poor: { min: 3, max: 5, score: 0 } // Significant gap
  },
  
  diklatTeknis: {
    // JP = Jam Pelajaran
    excellent: { min: 80, max: 999, score: 3 },
    good: { min: 50, max: 79, score: 2 },
    average: { min: 20, max: 49, score: 1 },
    poor: { min: 0, max: 19, score: 0 }
  },
  
  pendidikan: {
    'S3': 4,
    'S2': 3,
    'S1': 2,
    'D-IV': 2,
    'D-III': 1,
    'D-I': 1,
    'SMA': 0
  },
  
  pengalaman: {
    // Dalam tahun
    excellent: { min: 10, max: 999, score: 3 },
    good: { min: 5, max: 9, score: 2 },
    average: { min: 2, max: 4, score: 1 },
    poor: { min: 0, max: 1, score: 0 }
  },
  
  skp: {
    'Sangat Baik': 3,
    'Baik': 2,
    'Cukup': 1,
    'Kurang': 0
  }
};

// Bobot untuk Sumbu X (Potensi)
export const sumbuXWeights = {
  jobFit: 0.20,        // 20%
  gapPotensi: 0.20,    // 20%
  diklatTeknis: 0.40,  // 40% - tertinggi
  pendidikan: 0.15,    // 15%
  pengalaman: 0.05     // 5%
};

// Bobot untuk Sumbu Y (Kinerja)
export const sumbuYWeights = {
  skp: 1.00  // 100% - satu-satunya komponen
};

/**
 * Konversi nilai mentah ke Skala 3
 */
export function convertToScale3(value, type) {
  const scales = conversionScales[type];
  
  if (type === 'pendidikan') {
    return scales[value] || 0;
  }
  
  if (typeof value !== 'number') {
    return 0;
  }
  
  for (const [level, range] of Object.entries(scales)) {
    if (value >= range.min && value <= range.max) {
      return range.score;
    }
  }
  
  return 0;
}

/**
 * Hitung Sumbu X (Potensi)
 * @param {Object} data - Data pegawai
 * @returns {Object} Breakdown dan total score Sumbu X
 */
export function calculateSumbuX(data) {
  const breakdown = {
    jobFit: {
      raw: data.jobFit || 0,
      converted: convertToScale3(data.jobFit, 'jobFit'),
      weight: sumbuXWeights.jobFit,
      score: 0
    },
    gapPotensi: {
      raw: data.gapPotensi || 0,
      converted: convertToScale3(data.gapPotensi, 'gapPotensi'),
      weight: sumbuXWeights.gapPotensi,
      score: 0
    },
    diklatTeknis: {
      raw: data.diklatTeknis || 0,
      converted: convertToScale3(data.diklatTeknis, 'diklatTeknis'),
      weight: sumbuXWeights.diklatTeknis,
      score: 0
    },
    pendidikan: {
      raw: data.pendidikan || 'SMA',
      converted: convertToScale3(data.pendidikan, 'pendidikan'),
      weight: sumbuXWeights.pendidikan,
      score: 0
    },
    pengalaman: {
      raw: data.pengalaman || 0,
      converted: convertToScale3(data.pengalaman, 'pengalaman'),
      weight: sumbuXWeights.pengalaman,
      score: 0
    }
  };
  
  // Hitung score untuk setiap komponen
  let totalScore = 0;
  for (const [key, component] of Object.entries(breakdown)) {
    component.score = component.converted * component.weight;
    totalScore += component.score;
  }
  
  return {
    breakdown,
    totalScore: parseFloat(totalScore.toFixed(2)),
    maxScore: 3.0
  };
}

/**
 * Hitung Sumbu Y (Kinerja)
 * @param {Object} data - Data pegawai
 * @returns {Object} Breakdown dan total score Sumbu Y
 */
export function calculateSumbuY(data) {
  const skpRating = data.skpRating || 'Cukup';
  const converted = conversionScales.skp[skpRating] || 1;
  
  const breakdown = {
    skp: {
      raw: skpRating,
      converted: converted,
      weight: sumbuYWeights.skp,
      score: converted * sumbuYWeights.skp
    }
  };
  
  return {
    breakdown,
    totalScore: breakdown.skp.score,
    maxScore: 3.0
  };
}

/**
 * Tentukan posisi 9-Box berdasarkan Sumbu X dan Y
 * @param {number} sumbuX - Score Sumbu X (0-3)
 * @param {number} sumbuY - Score Sumbu Y (0-3)
 * @returns {Object} Posisi box dan kategori
 */
export function determine9BoxPosition(sumbuX, sumbuY) {
  // Percentile untuk Sumbu X (dari data Kemenpan: P1=2.2, P2=2.4)
  const percentileX = {
    low: 2.2,    // 50th percentile
    high: 2.4    // 80th percentile
  };
  
  // Percentile untuk Sumbu Y (diasumsikan sama)
  const percentileY = {
    low: 2.2,
    high: 2.4
  };
  
  // Tentukan level X (Potensi)
  let levelX = 'Low';
  if (sumbuX >= percentileX.high) {
    levelX = 'High';
  } else if (sumbuX >= percentileX.low) {
    levelX = 'Medium';
  }
  
  // Tentukan level Y (Kinerja)
  let levelY = 'Low';
  if (sumbuY >= percentileY.high) {
    levelY = 'High';
  } else if (sumbuY >= percentileY.low) {
    levelY = 'Medium';
  }
  
  // Mapping 9-Box
  const boxMapping = {
    'High-High': { box: 9, label: 'Star Performer', color: 'green', priority: 'High' },
    'High-Medium': { box: 8, label: 'High Potential', color: 'blue', priority: 'High' },
    'High-Low': { box: 7, label: 'Rough Diamond', color: 'yellow', priority: 'Medium' },
    'Medium-High': { box: 6, label: 'Key Player', color: 'green', priority: 'Medium' },
    'Medium-Medium': { box: 5, label: 'Core Employee', color: 'blue', priority: 'Medium' },
    'Medium-Low': { box: 4, label: 'Inconsistent', color: 'yellow', priority: 'Medium' },
    'Low-High': { box: 3, label: 'Solid Performer', color: 'orange', priority: 'Low' },
    'Low-Medium': { box: 2, label: 'Average', color: 'orange', priority: 'Low' },
    'Low-Low': { box: 1, label: 'Risk', color: 'red', priority: 'Low' }
  };
  
  const key = `${levelX}-${levelY}`;
  const position = boxMapping[key];
  
  return {
    box: position.box,
    label: position.label,
    color: position.color,
    priority: position.priority,
    levelX: levelX,
    levelY: levelY,
    quadrant: `Potensi: ${levelX}, Kinerja: ${levelY}`
  };
}

/**
 * Hitung assessment lengkap (Sumbu X + Y + 9-Box)
 * @param {Object} employeeData - Data lengkap pegawai
 * @returns {Object} Hasil assessment lengkap
 */
export function calculateFullAssessment(employeeData) {
  const sumbuX = calculateSumbuX({
    jobFit: employeeData.jobFit,
    gapPotensi: employeeData.gapPotensi,
    diklatTeknis: employeeData.diklatTeknis,
    pendidikan: employeeData.pendidikan,
    pengalaman: employeeData.pengalaman
  });
  
  const sumbuY = calculateSumbuY({
    skpRating: employeeData.skpRating
  });
  
  const position = determine9BoxPosition(sumbuX.totalScore, sumbuY.totalScore);
  
  return {
    sumbuX,
    sumbuY,
    position,
    assessmentDate: new Date().toISOString(),
    nip: employeeData.nip,
    name: employeeData.name,
    compliance: 'Sesuai Permenpan RB No. 3/2020'
  };
}

/**
 * Generate mock data untuk testing (sesuai contoh Kemenpan)
 */
export function generateSampleData() {
  return {
    nip: '199002152015031002',
    name: 'Budi Santoso',
    jabatan: 'Pranata Komputer Pertama',
    golongan: 'III/a',
    unitKerja: 'Deputi Bidang SDM Aparatur',
    
    // Data Sumbu X
    jobFit: 72,              // 72%
    gapPotensi: -3,          // Negatif = overqualified
    diklatTeknis: 57,        // 57 JP
    pendidikan: 'D-IV',      // Diploma IV
    pengalaman: 2.2,         // 2.2 tahun
    
    // Data Sumbu Y
    skpRating: 'Sangat Baik' // Sangat Baik = 3
  };
}

export default {
  calculateSumbuX,
  calculateSumbuY,
  determine9BoxPosition,
  calculateFullAssessment,
  generateSampleData,
  conversionScales,
  sumbuXWeights,
  sumbuYWeights
};
