/**
 * Ollama Client for LLM Integration
 * Connects to self-hosted Ollama instance
 */

const OLLAMA_CONFIG = {
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://72.61.143.3:8080',
  apiKey: process.env.OLLAMA_API_KEY || 'sk-0ad82b0be3454fda88b698243495f8d5',
  model: process.env.OLLAMA_MODEL || 'llama3.2:1b',
  timeout: 60000 // 60 seconds
};

/**
 * Call Ollama API for text generation
 * @param {string} prompt - The prompt to send to the model
 * @param {object} options - Additional options
 * @returns {Promise<string>} Generated text
 */
export async function callOllama(prompt, options = {}) {
  try {
    const {
      model = OLLAMA_CONFIG.model,
      temperature = 0.7,
      maxTokens = 2000,
      systemPrompt = null
    } = options;

    console.log('🤖 Calling Ollama API...');
    console.log('   Base URL:', OLLAMA_CONFIG.baseUrl);
    console.log('   Model:', model);

    // Ollama API format
    const requestBody = {
      model: model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: temperature,
        num_predict: maxTokens
      }
    };

    // Add system prompt if provided
    if (systemPrompt) {
      requestBody.system = systemPrompt;
    }

    const response = await fetch(`${OLLAMA_CONFIG.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OLLAMA_CONFIG.apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(OLLAMA_CONFIG.timeout)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    console.log('✅ Ollama response received');
    
    return data.response || '';
  } catch (error) {
    console.error('❌ Ollama API error:', error.message);
    throw new Error(`Failed to call Ollama: ${error.message}`);
  }
}

/**
 * Test Ollama connection
 * @returns {Promise<object>} Test result
 */
export async function testOllamaConnection() {
  try {
    console.log('🔍 Testing Ollama connection...');
    
    const testPrompt = 'Hello, please respond with "OK" if you can read this.';
    const response = await callOllama(testPrompt, {
      temperature: 0.1,
      maxTokens: 50
    });

    console.log('✅ Ollama connection test successful');
    
    return {
      success: true,
      message: 'Connection successful',
      response: response,
      config: {
        baseUrl: OLLAMA_CONFIG.baseUrl,
        model: OLLAMA_CONFIG.model
      }
    };
  } catch (error) {
    console.error('❌ Ollama connection test failed:', error.message);
    
    return {
      success: false,
      message: error.message,
      config: {
        baseUrl: OLLAMA_CONFIG.baseUrl,
        model: OLLAMA_CONFIG.model
      }
    };
  }
}

/**
 * Analyze talent using Ollama
 * @param {object} employeeData - Employee data for analysis
 * @returns {Promise<object>} Analysis result
 */
export async function analyzeTalentWithOllama(employeeData) {
  const systemPrompt = `You are an expert HR analyst specializing in talent management and the 9-Box Grid methodology. 
Analyze employee data and provide structured insights on performance, potential, and career recommendations.`;

  const prompt = `Analyze this employee for talent management:

Name: ${employeeData.name}
Position: ${employeeData.position}
Education: ${employeeData.education || 'Not specified'}
Work Experience: ${employeeData.workExperience || 0} years
Grade: ${employeeData.grade || 'Not specified'}
Skills: ${employeeData.skills?.join(', ') || 'Not specified'}
Achievements: ${employeeData.achievements?.join(', ') || 'Not specified'}

Please provide a structured analysis in JSON format with the following fields:
1. performance: {level: "High/Medium/Low", score: 1-3, justification: "explanation"}
2. potential: {level: "High/Medium/Low", score: 1-3, justification: "explanation"}
3. recommendedPositions: ["position1", "position2", "position3"] - list of 3 recommended positions
4. developmentAreas: ["area1", "area2", "area3"] - list of 3 areas for development
5. recommendations: ["rec1", "rec2", "rec3"] - list of 3 career recommendations

Return ONLY valid JSON, no additional text.`;

  try {
    const response = await callOllama(prompt, {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 1500
    });

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing talent with Ollama:', error);
    throw error;
  }
}

export default {
  callOllama,
  testOllamaConnection,
  analyzeTalentWithOllama,
  config: OLLAMA_CONFIG
};
