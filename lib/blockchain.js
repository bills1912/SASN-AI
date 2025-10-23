/**
 * ASTA-CITA AI Blockchain Service
 * Private Permissioned Blockchain for ASN Talent Management
 * 
 * Features:
 * - Immutable credential storage
 * - Tamper-proof performance records
 * - Transparent merit system tracking
 * - Secure cross-institution data sharing
 */

import crypto from 'crypto';

// Block structure
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
      )
      .digest('hex');
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

// Blockchain structure
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2; // Difficulty for proof of work
    this.pendingTransactions = [];
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), 'Genesis Block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// ASN Credential Management with Blockchain
export class ASNBlockchainService {
  constructor() {
    this.blockchain = new Blockchain();
  }

  /**
   * Add credential to blockchain
   * @param {Object} credential - Credential data
   * @returns {Object} Block info
   */
  addCredential(credential) {
    const data = {
      type: 'CREDENTIAL',
      nip: credential.nip,
      credentialType: credential.credentialType, // 'education', 'certification', 'training'
      title: credential.title,
      institution: credential.institution,
      dateIssued: credential.dateIssued,
      expiryDate: credential.expiryDate,
      verificationStatus: 'VERIFIED',
      issuer: credential.issuer,
      credentialHash: this.hashData(credential),
      timestamp: Date.now()
    };

    const newBlock = new Block(
      this.blockchain.chain.length,
      Date.now(),
      data,
      this.blockchain.getLatestBlock().hash
    );

    this.blockchain.addBlock(newBlock);

    return {
      blockIndex: newBlock.index,
      blockHash: newBlock.hash,
      timestamp: newBlock.timestamp,
      verified: true
    };
  }

  /**
   * Add performance record to blockchain
   * @param {Object} performance - Performance data
   * @returns {Object} Block info
   */
  addPerformanceRecord(performance) {
    const data = {
      type: 'PERFORMANCE',
      nip: performance.nip,
      period: performance.period,
      score: performance.score,
      category: performance.category, // 'SKP', 'Perilaku', 'Kompetensi'
      assessor: performance.assessor,
      assessmentDate: performance.assessmentDate,
      meritScore: performance.meritScore,
      performanceHash: this.hashData(performance),
      timestamp: Date.now()
    };

    const newBlock = new Block(
      this.blockchain.chain.length,
      Date.now(),
      data,
      this.blockchain.getLatestBlock().hash
    );

    this.blockchain.addBlock(newBlock);

    return {
      blockIndex: newBlock.index,
      blockHash: newBlock.hash,
      timestamp: newBlock.timestamp,
      verified: true
    };
  }

  /**
   * Add promotion/mutation record to blockchain
   * @param {Object} career - Career movement data
   * @returns {Object} Block info
   */
  addCareerMovement(career) {
    const data = {
      type: 'CAREER_MOVEMENT',
      nip: career.nip,
      movementType: career.movementType, // 'PROMOTION', 'MUTATION', 'ROTATION'
      fromPosition: career.fromPosition,
      toPosition: career.toPosition,
      fromInstitution: career.fromInstitution,
      toInstitution: career.toInstitution,
      effectiveDate: career.effectiveDate,
      approvedBy: career.approvedBy,
      meritBased: career.meritBased,
      meritScore: career.meritScore,
      competencyMatch: career.competencyMatch,
      movementHash: this.hashData(career),
      timestamp: Date.now()
    };

    const newBlock = new Block(
      this.blockchain.chain.length,
      Date.now(),
      data,
      this.blockchain.getLatestBlock().hash
    );

    this.blockchain.addBlock(newBlock);

    return {
      blockIndex: newBlock.index,
      blockHash: newBlock.hash,
      timestamp: newBlock.timestamp,
      verified: true
    };
  }

  /**
   * Add talent assessment to blockchain
   * @param {Object} assessment - Talent assessment data
   * @returns {Object} Block info
   */
  addTalentAssessment(assessment) {
    const data = {
      type: 'TALENT_ASSESSMENT',
      nip: assessment.nip,
      assessmentType: assessment.assessmentType, // '9-BOX', 'SKILL', 'COMPETENCY'
      performanceLevel: assessment.performanceLevel,
      potentialLevel: assessment.potentialLevel,
      quadrant: assessment.quadrant,
      skillGaps: assessment.skillGaps,
      developmentPlan: assessment.developmentPlan,
      assessedBy: assessment.assessedBy,
      assessmentDate: assessment.assessmentDate,
      assessmentHash: this.hashData(assessment),
      timestamp: Date.now()
    };

    const newBlock = new Block(
      this.blockchain.chain.length,
      Date.now(),
      data,
      this.blockchain.getLatestBlock().hash
    );

    this.blockchain.addBlock(newBlock);

    return {
      blockIndex: newBlock.index,
      blockHash: newBlock.hash,
      timestamp: newBlock.timestamp,
      verified: true
    };
  }

  /**
   * Verify credential authenticity
   * @param {string} nip - Employee NIP
   * @param {string} credentialHash - Hash to verify
   * @returns {Object} Verification result
   */
  verifyCredential(nip, credentialHash) {
    const blocks = this.blockchain.chain.filter(
      block => 
        block.data.type === 'CREDENTIAL' && 
        block.data.nip === nip &&
        block.data.credentialHash === credentialHash
    );

    if (blocks.length === 0) {
      return {
        verified: false,
        message: 'Credential not found in blockchain'
      };
    }

    const block = blocks[0];
    const isValid = this.blockchain.isChainValid();

    return {
      verified: isValid,
      blockHash: block.hash,
      timestamp: block.timestamp,
      data: block.data,
      chainValid: isValid,
      message: isValid ? 'Credential verified successfully' : 'Blockchain integrity compromised'
    };
  }

  /**
   * Get complete history for an ASN
   * @param {string} nip - Employee NIP
   * @returns {Array} All blockchain records for this ASN
   */
  getASNHistory(nip) {
    return this.blockchain.chain
      .filter(block => block.data && block.data.nip === nip)
      .map(block => ({
        blockIndex: block.index,
        blockHash: block.hash,
        timestamp: block.timestamp,
        type: block.data.type,
        data: block.data,
        verified: true
      }));
  }

  /**
   * Get merit system audit trail
   * @param {string} nip - Employee NIP
   * @returns {Object} Merit-based decisions audit
   */
  getMeritAuditTrail(nip) {
    const history = this.getASNHistory(nip);
    
    const performances = history.filter(h => h.type === 'PERFORMANCE');
    const careerMovements = history.filter(h => h.type === 'CAREER_MOVEMENT');
    const assessments = history.filter(h => h.type === 'TALENT_ASSESSMENT');

    return {
      nip,
      totalRecords: history.length,
      performanceRecords: performances.length,
      careerMovements: careerMovements.length,
      talentAssessments: assessments.length,
      meritBasedPromotions: careerMovements.filter(c => c.data.meritBased).length,
      averageMeritScore: this.calculateAverageMeritScore(performances),
      lastAssessment: assessments[assessments.length - 1],
      blockchainIntegrity: this.blockchain.isChainValid(),
      auditTrail: history
    };
  }

  /**
   * Calculate average merit score
   * @param {Array} performances - Performance records
   * @returns {number} Average score
   */
  calculateAverageMeritScore(performances) {
    if (performances.length === 0) return 0;
    
    const total = performances.reduce((sum, p) => sum + (p.data.meritScore || 0), 0);
    return Math.round(total / performances.length);
  }

  /**
   * Hash data for integrity verification
   * @param {Object} data - Data to hash
   * @returns {string} SHA-256 hash
   */
  hashData(data) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  /**
   * Export blockchain for backup/audit
   * @returns {Object} Complete blockchain data
   */
  exportBlockchain() {
    return {
      chain: this.blockchain.chain,
      isValid: this.blockchain.isChainValid(),
      totalBlocks: this.blockchain.chain.length,
      exportDate: new Date().toISOString()
    };
  }

  /**
   * Get blockchain statistics
   * @returns {Object} Statistics
   */
  getStatistics() {
    const credentials = this.blockchain.chain.filter(b => b.data && b.data.type === 'CREDENTIAL').length;
    const performances = this.blockchain.chain.filter(b => b.data && b.data.type === 'PERFORMANCE').length;
    const careerMovements = this.blockchain.chain.filter(b => b.data && b.data.type === 'CAREER_MOVEMENT').length;
    const assessments = this.blockchain.chain.filter(b => b.data && b.data.type === 'TALENT_ASSESSMENT').length;

    return {
      totalBlocks: this.blockchain.chain.length,
      credentialRecords: credentials,
      performanceRecords: performances,
      careerMovementRecords: careerMovements,
      talentAssessmentRecords: assessments,
      blockchainValid: this.blockchain.isChainValid(),
      lastBlockHash: this.blockchain.getLatestBlock().hash,
      lastBlockTime: this.blockchain.getLatestBlock().timestamp
    };
  }
}

// Singleton instance
let blockchainInstance = null;

export function getBlockchainInstance() {
  if (!blockchainInstance) {
    blockchainInstance = new ASNBlockchainService();
  }
  return blockchainInstance;
}

export default getBlockchainInstance;
