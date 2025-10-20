import OpenAI from 'openai';

// Emergent LLM keys work with OpenAI SDK using Emergent's API endpoint
const openai = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY,
  baseURL: 'https://api.emergent.sh/v1/openai',
  defaultHeaders: {
    'x-emergent-key': process.env.EMERGENT_LLM_KEY
  }
});

export default openai;