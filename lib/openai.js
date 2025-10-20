import OpenAI from 'openai';

// Emergent LLM keys need to use Emergent's proxy endpoint
const isEmergentKey = process.env.EMERGENT_LLM_KEY?.startsWith('sk-emergent');

const openai = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY,
  ...(isEmergentKey && {
    baseURL: 'https://api.emergent.sh/v1',
  })
});

export default openai;