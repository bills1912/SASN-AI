import OpenAI from 'openai';

// For demo/development: Use mock responses if API key fails
// In production with valid Emergent key, this would use the actual API
const USE_MOCK_MODE = process.env.USE_MOCK_MODE === 'true' || !process.env.EMERGENT_LLM_KEY;

const openai = USE_MOCK_MODE ? null : new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY,
  baseURL: 'https://api.emergent.sh/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    'X-Title': 'ASTA-CITA AI'
  }
});

export default openai;
export { USE_MOCK_MODE };