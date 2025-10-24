/**
 * Test script for Gemini Merit Model
 * Run: node lib/testGeminiModel.js
 */

import GeminiMeritModel from './geminiMeritModel.js';

async function testGeminiModel() {
  console.log('🧪 Testing Gemini Merit Model...\n');

  try {
    // Initialize model
    const model = new GeminiMeritModel();
    console.log('✅ Model initialized successfully');

    // Test data for a mock institution
    const testInstitution = {
      employee_count: 150,
      avg_tenure: 7.5,
      avg_performance: 4.2,
      training_programs_count: 12,
      certification_rate: 75,
      avg_education_level: 'S1',
      succession_plan_coverage: 85,
      merit_assessment_frequency: 2,
      talent_pipeline_ratio: 0.35,
      development_budget_per_capita: 6000000
    };

    console.log('\n📊 Test Institution Data:');
    console.log(JSON.stringify(testInstitution, null, 2));

    // Make prediction
    console.log('\n🔮 Making prediction with Gemini AI...');
    const result = await model.predict(testInstitution, 'Kementerian Test');

    console.log('\n✅ Prediction Results:');
    console.log('═══════════════════════════════════════════════');
    console.log(`Merit Index: ${result.merit_index}/100`);
    console.log(`Compliance Score: ${result.compliance_score}/100`);
    console.log(`Talent Pipeline Strength: ${result.talent_pipeline_strength}/100`);
    console.log(`Training Adequacy: ${result.training_adequacy}/100`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(0)}%`);
    
    if (result.analysis_summary) {
      console.log(`\n📝 Summary: ${result.analysis_summary}`);
    }

    if (result.factors) {
      if (result.factors.strong_points?.length > 0) {
        console.log('\n💪 Strong Points:');
        result.factors.strong_points.forEach(point => console.log(`  - ${point}`));
      }

      if (result.factors.improvement_areas?.length > 0) {
        console.log('\n⚠️  Areas for Improvement:');
        result.factors.improvement_areas.forEach(area => console.log(`  - ${area}`));
      }

      if (result.factors.recommendations?.length > 0) {
        console.log('\n💡 Recommendations:');
        result.factors.recommendations.forEach(rec => console.log(`  - ${rec}`));
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ Test completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run test
testGeminiModel();
