/**
 * Merit System Index Model using Google Gemini AI
 * Replaces TensorFlow.js implementation for deployment compatibility
 * Based on Permenpan RB No. 3/2020 regulations
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiMeritModel {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    
    this.featureNames = [
      'employee_count',
      'avg_tenure',
      'avg_performance',
      'training_programs_count',
      'certification_rate',
      'avg_education_level',
      'succession_plan_coverage',
      'merit_assessment_frequency',
      'talent_pipeline_ratio',
      'development_budget_per_capita'
    ];
  }

  /**
   * Prepare features from institutional data
   */
  prepareFeatures(institutionData) {
    const features = {
      employee_count: institutionData.employee_count || 0,
      avg_tenure: institutionData.avg_tenure || 0,
      avg_performance: institutionData.avg_performance || 0,
      training_programs_count: institutionData.training_programs_count || 0,
      certification_rate: institutionData.certification_rate || 0,
      avg_education_level: this.encodeEducationLevel(institutionData.avg_education_level),
      succession_plan_coverage: institutionData.succession_plan_coverage || 0,
      merit_assessment_frequency: institutionData.merit_assessment_frequency || 0,
      talent_pipeline_ratio: institutionData.talent_pipeline_ratio || 0,
      development_budget_per_capita: institutionData.development_budget_per_capita || 0
    };

    return features;
  }

  /**
   * Encode education level to numerical value
   */
  encodeEducationLevel(educationLevel) {
    const mapping = {
      'High School': 1,
      'SMA': 1,
      'Diploma': 2,
      'Associate': 2,
      'Bachelor': 3,
      'S1': 3,
      'Master': 4,
      'S2': 4,
      'PhD': 5,
      'S3': 5
    };

    return mapping[educationLevel] || 3; // Default to Bachelor equivalent
  }

  /**
   * Create prompt for Gemini to analyze institutional merit
   */
  createAnalysisPrompt(features, institutionName) {
    return `You are an expert AI system analyzing Indonesian government institution merit systems based on Permenpan RB No. 3/2020 regulations.

INSTITUTION: ${institutionName}

INSTITUTIONAL DATA:
- Total Employees: ${features.employee_count}
- Average Tenure (years): ${features.avg_tenure}
- Average Performance Rating (1-5): ${features.avg_performance}
- Training Programs Count: ${features.training_programs_count}
- Certification Rate (%): ${features.certification_rate}
- Average Education Level (1-5 scale): ${features.avg_education_level}
- Succession Plan Coverage (%): ${features.succession_plan_coverage}
- Merit Assessment Frequency (per year): ${features.merit_assessment_frequency}
- Talent Pipeline Ratio: ${features.talent_pipeline_ratio}
- Development Budget Per Capita: ${features.development_budget_per_capita}

TASK: Analyze this institution and provide merit system scores based on these three dimensions:

1. **COMPLIANCE SCORE (0-100)**: How well does the institution comply with Permenpan RB regulations regarding merit-based systems, performance management, and talent development?

2. **TALENT PIPELINE STRENGTH (0-100)**: How strong is their talent development and succession planning? Consider certification rates, training programs, succession planning coverage, and education levels.

3. **TRAINING ADEQUACY (0-100)**: How adequate are their training and development programs? Consider training programs count, development budget, and merit assessment frequency.

CALCULATION GUIDELINES:
- Higher employee count with good metrics = better score
- Average performance > 4.0 = excellent (add bonus points)
- Average performance < 3.0 = poor (deduct points)
- Certification rate > 70% = strong
- Succession plan coverage > 80% = excellent
- Average tenure 5-10 years = optimal (too low or too high may indicate issues)
- More training programs and higher budget = better training adequacy

Please respond in the following JSON format ONLY (no additional text):
{
  "compliance_score": <number 0-100>,
  "talent_pipeline_strength": <number 0-100>,
  "training_adequacy": <number 0-100>,
  "confidence": <number 0-1>,
  "analysis_summary": "<brief summary in Indonesian>",
  "strong_points": ["<point1>", "<point2>"],
  "improvement_areas": ["<area1>", "<area2>"],
  "recommendations": ["<rec1>", "<rec2>", "<rec3>"]
}`;
  }

  /**
   * Predict merit index for an institution using Gemini AI
   */
  async predict(institutionData, institutionName = 'Unknown Institution') {
    try {
      const features = this.prepareFeatures(institutionData);
      const prompt = this.createAnalysisPrompt(features, institutionName);

      // Call Gemini API
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse Gemini response as JSON');
      }

      const analysis = JSON.parse(jsonMatch[0]);

      // Calculate overall merit index (weighted average)
      const meritIndex = (
        analysis.compliance_score * 0.40 +
        analysis.talent_pipeline_strength * 0.35 +
        analysis.training_adequacy * 0.25
      );

      return {
        merit_index: Math.round(meritIndex * 10) / 10,
        compliance_score: Math.round(analysis.compliance_score * 10) / 10,
        talent_pipeline_strength: Math.round(analysis.talent_pipeline_strength * 10) / 10,
        training_adequacy: Math.round(analysis.training_adequacy * 10) / 10,
        confidence: analysis.confidence || this.calculateConfidence(institutionData),
        analysis_summary: analysis.analysis_summary || '',
        factors: {
          strong_points: analysis.strong_points || [],
          improvement_areas: analysis.improvement_areas || [],
          recommendations: analysis.recommendations || []
        }
      };
    } catch (error) {
      console.error('Error in Gemini prediction:', error);
      
      // Fallback to rule-based calculation if Gemini fails
      return this.fallbackPrediction(institutionData);
    }
  }

  /**
   * Fallback prediction using rule-based approach
   */
  fallbackPrediction(institutionData) {
    const features = this.prepareFeatures(institutionData);
    
    // Rule-based scoring
    let complianceScore = 50;
    let talentPipelineStrength = 50;
    let trainingAdequacy = 50;

    // Compliance scoring
    if (features.avg_performance >= 4.0) complianceScore += 20;
    else if (features.avg_performance < 3.0) complianceScore -= 15;
    
    if (features.merit_assessment_frequency >= 2) complianceScore += 15;
    if (features.succession_plan_coverage >= 80) complianceScore += 15;

    // Talent pipeline scoring
    if (features.certification_rate >= 70) talentPipelineStrength += 20;
    else if (features.certification_rate < 30) talentPipelineStrength -= 15;
    
    if (features.succession_plan_coverage >= 80) talentPipelineStrength += 20;
    if (features.avg_education_level >= 4) talentPipelineStrength += 10;

    // Training adequacy scoring
    if (features.training_programs_count >= 10) trainingAdequacy += 20;
    else if (features.training_programs_count < 3) trainingAdequacy -= 15;
    
    if (features.development_budget_per_capita >= 5000000) trainingAdequacy += 15;
    if (features.certification_rate >= 70) trainingAdequacy += 15;

    // Normalize to 0-100 range
    complianceScore = Math.min(100, Math.max(0, complianceScore));
    talentPipelineStrength = Math.min(100, Math.max(0, talentPipelineStrength));
    trainingAdequacy = Math.min(100, Math.max(0, trainingAdequacy));

    const meritIndex = (
      complianceScore * 0.40 +
      talentPipelineStrength * 0.35 +
      trainingAdequacy * 0.25
    );

    return {
      merit_index: Math.round(meritIndex * 10) / 10,
      compliance_score: Math.round(complianceScore * 10) / 10,
      talent_pipeline_strength: Math.round(talentPipelineStrength * 10) / 10,
      training_adequacy: Math.round(trainingAdequacy * 10) / 10,
      confidence: this.calculateConfidence(institutionData),
      analysis_summary: 'Analisis menggunakan metode rule-based (fallback)',
      factors: this.analyzeFactors(institutionData)
    };
  }

  /**
   * Calculate confidence score based on data quality
   */
  calculateConfidence(institutionData) {
    let confidence = 0;
    let totalChecks = 0;

    const requiredFields = [
      'employee_count',
      'avg_tenure',
      'avg_performance',
      'training_programs_count',
      'certification_rate'
    ];

    for (const field of requiredFields) {
      totalChecks++;
      if (institutionData[field] != null && institutionData[field] > 0) {
        confidence++;
      }
    }

    return Math.round((confidence / totalChecks) * 100) / 100;
  }

  /**
   * Analyze factors contributing to the merit index
   */
  analyzeFactors(institutionData) {
    const factors = {
      strong_points: [],
      improvement_areas: [],
      recommendations: []
    };

    // Analyze performance indicators
    if (institutionData.avg_performance >= 4.0) {
      factors.strong_points.push('Rata-rata kinerja tinggi (≥4.0)');
    } else if (institutionData.avg_performance < 3.0) {
      factors.improvement_areas.push('Rata-rata kinerja rendah (<3.0)');
      factors.recommendations.push('Implementasikan program peningkatan kinerja');
    }

    // Analyze talent pipeline
    if (institutionData.succession_plan_coverage >= 80) {
      factors.strong_points.push('Cakupan perencanaan suksesi yang kuat (≥80%)');
    } else {
      factors.improvement_areas.push('Perencanaan suksesi belum memadai');
      factors.recommendations.push('Perluas perencanaan suksesi untuk posisi kritis');
    }

    // Analyze training and development
    if (institutionData.certification_rate >= 70) {
      factors.strong_points.push('Tingkat sertifikasi pegawai tinggi (≥70%)');
    } else {
      factors.improvement_areas.push('Tingkat sertifikasi pegawai rendah');
      factors.recommendations.push('Tingkatkan investasi dalam program sertifikasi pegawai');
    }

    // Analyze tenure and retention
    if (institutionData.avg_tenure >= 8) {
      factors.strong_points.push('Retensi pegawai yang baik');
    } else if (institutionData.avg_tenure < 3) {
      factors.improvement_areas.push('Masa kerja rata-rata rendah');
      factors.recommendations.push('Tinjau strategi retensi dan jalur pengembangan karir');
    }

    return factors;
  }

  /**
   * Batch prediction for multiple institutions
   */
  async predictBatch(institutionsData) {
    const results = [];
    
    for (const institution of institutionsData) {
      try {
        const result = await this.predict(
          institution.data,
          institution.name
        );
        results.push({
          institution_name: institution.name,
          ...result
        });
      } catch (error) {
        console.error(`Error predicting for ${institution.name}:`, error);
        results.push({
          institution_name: institution.name,
          error: error.message
        });
      }
    }
    
    return results;
  }
}

export default GeminiMeritModel;
