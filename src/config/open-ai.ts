import OpenAI from 'openai';
import config from '.';

const openAiClient = new OpenAI({
  apiKey: config.openai.api_key,
});

export default openAiClient;
