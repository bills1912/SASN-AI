/**
 * Merit System Index Model using TensorFlow.js
 * Implements deep learning model for institutional merit analysis
 * Based on Permenpan RB No. 3/2020 regulations
 */

import * as tf from '@tensorflow/tfjs-node';

export class MeritSystemModel {
  constructor() {
    this.model = null;
    this.scalerParams = null;
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
   * Create the neural network model architecture
   */
  createModel() {
    const model = tf.sequential();

    // Input layer
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [this.featureNames.length],
      kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
    }));

    model.add(tf.layers.dropout({ rate: 0.3 }));

    // Hidden layers
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
    }));

    model.add(tf.layers.dropout({ rate: 0.2 }));

    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));

    // Output layer - 3 outputs: compliance_score, talent_pipeline_strength, training_adequacy
    model.add(tf.layers.dense({
      units: 3,
      activation: 'sigmoid' // Output 0-1, will scale to 0-100
    }));

    // Compile model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae', 'mse']
    });

    this.model = model;
    return model;
  }

  /**
   * Prepare features from institutional data
   */
  prepareFeatures(institutionData) {
    const features = [
      institutionData.employee_count || 0,
      institutionData.avg_tenure || 0,
      institutionData.avg_performance || 0,
      institutionData.training_programs_count || 0,
      institutionData.certification_rate || 0,
      this.encodeEducationLevel(institutionData.avg_education_level),
      institutionData.succession_plan_coverage || 0,
      institutionData.merit_assessment_frequency || 0,
      institutionData.talent_pipeline_ratio || 0,
      institutionData.development_budget_per_capita || 0
    ];

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
   * Normalize features using z-score normalization
   */
  normalizeFeatures(features) {
    if (!this.scalerParams) {
      // Calculate mean and std for training data
      const tensor = tf.tensor2d([features]);
      const mean = tensor.mean(0);
      const std = tensor.sub(mean).square().mean(0).sqrt();
      
      this.scalerParams = {
        mean: Array.from(mean.dataSync()),
        std: Array.from(std.dataSync()).map(s => s === 0 ? 1 : s)
      };

      tensor.dispose();
      mean.dispose();
      std.dispose();
    }

    const meanTensor = tf.tensor1d(this.scalerParams.mean);
    const stdTensor = tf.tensor1d(this.scalerParams.std);
    const featuresTensor = tf.tensor1d(features);

    const normalized = featuresTensor.sub(meanTensor).div(stdTensor);

    meanTensor.dispose();
    stdTensor.dispose();
    featuresTensor.dispose();

    return normalized;
  }

  /**
   * Train the model on institutional data
   */
  async train(trainingData, epochs = 100, batchSize = 16) {
    if (!this.model) {
      this.createModel();
    }

    // Prepare training data
    const X = [];
    const y = [];

    for (const institution of trainingData) {
      const features = this.prepareFeatures(institution);
      X.push(features);

      // Target values (compliance, talent_pipeline, training_adequacy)
      y.push([
        institution.compliance_score / 100 || 0.5,
        institution.talent_pipeline_strength / 100 || 0.5,
        institution.training_adequacy / 100 || 0.5
      ]);
    }

    // Convert to tensors
    const xsTrain = tf.tensor2d(X);
    const ysTrain = tf.tensor2d(y);

    // Normalize features
    const xsTrainNormalized = this.batchNormalize(xsTrain);

    // Train the model
    const history = await this.model.fit(xsTrainNormalized, ysTrain, {
      epochs,
      batchSize,
      validationSplit: 0.2,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, val_loss = ${logs.val_loss.toFixed(4)}`);
          }
        }
      }
    });

    // Cleanup
    xsTrain.dispose();
    ysTrain.dispose();
    xsTrainNormalized.dispose();

    return history;
  }

  /**
   * Batch normalize features
   */
  batchNormalize(tensor) {
    const mean = tensor.mean(0);
    const std = tensor.sub(mean).square().mean(0).sqrt().add(1e-7);
    
    if (!this.scalerParams) {
      this.scalerParams = {
        mean: Array.from(mean.dataSync()),
        std: Array.from(std.dataSync())
      };
    }

    const normalized = tensor.sub(mean).div(std);
    
    mean.dispose();
    std.dispose();

    return normalized;
  }

  /**
   * Predict merit index for an institution
   */
  async predict(institutionData) {
    if (!this.model) {
      throw new Error('Model not initialized. Please train or load the model first.');
    }

    const features = this.prepareFeatures(institutionData);
    const normalized = this.normalizeFeatures(features);
    const input = normalized.reshape([1, -1]);

    // Predict
    const prediction = this.model.predict(input);
    const predictionArray = await prediction.data();

    // Scale to 0-100
    const complianceScore = Math.min(100, Math.max(0, predictionArray[0] * 100));
    const talentPipelineStrength = Math.min(100, Math.max(0, predictionArray[1] * 100));
    const trainingAdequacy = Math.min(100, Math.max(0, predictionArray[2] * 100));

    // Calculate overall merit index (weighted average)
    const meritIndex = (
      complianceScore * 0.40 +
      talentPipelineStrength * 0.35 +
      trainingAdequacy * 0.25
    );

    // Cleanup
    normalized.dispose();
    input.dispose();
    prediction.dispose();

    return {
      merit_index: Math.round(meritIndex * 10) / 10,
      compliance_score: Math.round(complianceScore * 10) / 10,
      talent_pipeline_strength: Math.round(talentPipelineStrength * 10) / 10,
      training_adequacy: Math.round(trainingAdequacy * 10) / 10,
      confidence: this.calculateConfidence(institutionData),
      factors: this.analyzeFactors(institutionData)
    };
  }

  /**
   * Calculate confidence score based on data quality
   */
  calculateConfidence(institutionData) {
    let confidence = 0;
    let totalChecks = 0;

    // Check data completeness
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
      factors.strong_points.push('High average performance rating');
    } else if (institutionData.avg_performance < 3.0) {
      factors.improvement_areas.push('Low average performance rating');
      factors.recommendations.push('Implement performance improvement programs');
    }

    // Analyze talent pipeline
    if (institutionData.succession_plan_coverage >= 80) {
      factors.strong_points.push('Strong succession planning coverage');
    } else {
      factors.improvement_areas.push('Insufficient succession planning');
      factors.recommendations.push('Expand succession planning to cover critical positions');
    }

    // Analyze training and development
    if (institutionData.certification_rate >= 70) {
      factors.strong_points.push('High employee certification rate');
    } else {
      factors.improvement_areas.push('Low certification rate among employees');
      factors.recommendations.push('Increase investment in employee certification programs');
    }

    // Analyze tenure and retention
    if (institutionData.avg_tenure >= 8) {
      factors.strong_points.push('Good employee retention');
    } else if (institutionData.avg_tenure < 3) {
      factors.improvement_areas.push('Low average employee tenure');
      factors.recommendations.push('Review retention strategies and career development paths');
    }

    return factors;
  }

  /**
   * Save model to file system
   */
  async saveModel(savePath) {
    if (!this.model) {
      throw new Error('No model to save');
    }

    await this.model.save(`file://${savePath}`);
    
    // Save scaler parameters separately
    const fs = require('fs');
    const path = require('path');
    fs.writeFileSync(
      path.join(savePath, 'scaler_params.json'),
      JSON.stringify(this.scalerParams, null, 2)
    );

    console.log(`Model saved to ${savePath}`);
  }

  /**
   * Load model from file system
   */
  async loadModel(loadPath) {
    this.model = await tf.loadLayersModel(`file://${loadPath}/model.json`);
    
    // Load scaler parameters
    const fs = require('fs');
    const path = require('path');
    const scalerPath = path.join(loadPath, 'scaler_params.json');
    
    if (fs.existsSync(scalerPath)) {
      this.scalerParams = JSON.parse(fs.readFileSync(scalerPath, 'utf8'));
    }

    console.log(`Model loaded from ${loadPath}`);
  }

  /**
   * Get model summary
   */
  summary() {
    if (this.model) {
      this.model.summary();
    } else {
      console.log('Model not initialized');
    }
  }
}

export default MeritSystemModel;
