/**
 * Seed sample blockchain data for demonstration
 * This should be run once to populate blockchain with sample ASN records
 */

import { getBlockchainInstance } from './blockchain';
import { getAllASNProfiles } from './mockBKNData';

export function seedBlockchainData() {
  const blockchain = getBlockchainInstance();
  const profiles = getAllASNProfiles();

  console.log('🔗 Starting blockchain data seeding...');

  // Seed sample credentials for each profile
  profiles.forEach((profile, index) => {
    // Add education credential
    blockchain.addCredential({
      nip: profile.nip,
      credentialType: 'education',
      title: profile.education,
      institution: 'Universitas Indonesia',
      dateIssued: new Date(2010 + index, 6, 15).toISOString(),
      expiryDate: null,
      issuer: 'Kementerian Pendidikan dan Kebudayaan',
    });

    // Add certification
    blockchain.addCredential({
      nip: profile.nip,
      credentialType: 'certification',
      title: 'Sertifikat Manajemen Pemerintahan',
      institution: 'Lembaga Administrasi Negara (LAN)',
      dateIssued: new Date(2015 + index, 3, 20).toISOString(),
      expiryDate: new Date(2025 + index, 3, 20).toISOString(),
      issuer: 'LAN RI',
    });

    // Add performance records
    const currentYear = new Date().getFullYear();
    for (let year = 0; year < 3; year++) {
      blockchain.addPerformanceRecord({
        nip: profile.nip,
        period: `${currentYear - year}`,
        score: 85 + Math.floor(Math.random() * 15),
        category: 'SKP',
        assessor: 'Kepala Unit Kerja',
        assessmentDate: new Date(currentYear - year, 11, 15).toISOString(),
        meritScore: 80 + Math.floor(Math.random() * 20),
      });
    }

    // Add career movement if applicable
    if (index % 2 === 0) {
      blockchain.addCareerMovement({
        nip: profile.nip,
        movementType: 'PROMOTION',
        fromPosition: 'Analis Data',
        toPosition: profile.position,
        fromInstitution: profile.agency,
        toInstitution: profile.agency,
        effectiveDate: new Date(2022, 0, 1).toISOString(),
        approvedBy: 'Kepala Badan',
        meritBased: true,
        meritScore: 88 + Math.floor(Math.random() * 12),
        competencyMatch: 85 + Math.floor(Math.random() * 15),
      });
    }

    // Add talent assessment
    const performanceLevels = ['Low', 'Medium', 'High'];
    const potentialLevels = ['Low', 'Medium', 'High'];
    const perfLevel = performanceLevels[Math.floor(Math.random() * 3)];
    const potLevel = potentialLevels[Math.floor(Math.random() * 3)];
    
    blockchain.addTalentAssessment({
      nip: profile.nip,
      assessmentType: '9-BOX',
      performanceLevel: perfLevel,
      potentialLevel: potLevel,
      quadrant: `${perfLevel} Performance - ${potLevel} Potential`,
      skillGaps: ['Leadership', 'Project Management'],
      developmentPlan: ['Training Kepemimpinan', 'Sertifikasi PMI'],
      assessedBy: 'Tim Assessment',
      assessmentDate: new Date(2024, 5, 15).toISOString(),
    });
  });

  const stats = blockchain.getStatistics();
  console.log('✅ Blockchain seeding completed!');
  console.log(`📊 Total blocks: ${stats.totalBlocks}`);
  console.log(`📄 Credentials: ${stats.credentialRecords}`);
  console.log(`📈 Performance records: ${stats.performanceRecords}`);
  console.log(`🎯 Career movements: ${stats.careerMovementRecords}`);
  console.log(`🌟 Talent assessments: ${stats.talentAssessmentRecords}`);

  return stats;
}
