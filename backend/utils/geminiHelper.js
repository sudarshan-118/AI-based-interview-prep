const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MODELS_TO_TRY = [
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-flash-lite-latest'
];

/**
 * Generates content using Google Gemini with automatic model fallback list.
 */
async function generateWithGemini(contentInput, config = {}) {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const modelOptions = { model: modelName };
      if (config.generationConfig) {
        modelOptions.generationConfig = config.generationConfig;
      }
      if (config.systemInstruction) {
        modelOptions.systemInstruction = config.systemInstruction;
      }

      const model = genAI.getGenerativeModel(modelOptions);
      
      let result;
      if (typeof contentInput === 'object' && contentInput.contents) {
        result = await model.generateContent({ contents: contentInput.contents });
      } else {
        result = await model.generateContent(contentInput);
      }
      
      console.log(`Successfully generated content using Gemini model: ${modelName}`);
      return result;
    } catch (err) {
      console.warn(`Gemini model fallback: Failed using model ${modelName}. Error: ${err.message}`);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed to generate content');
}

/**
 * Generates content using Groq if GROQ_API_KEY is present, with automatic fallback to Gemini.
 * 
 * @param {string|object} contentInput - Either a prompt string or a { contents } payload for chat.
 * @param {object} config - Generation configuration options.
 * @param {object} [config.generationConfig] - Configuration like responseMimeType.
 * @param {string} [config.systemInstruction] - System instructions for the model.
 * @returns {Promise<any>} A result object conforming to the `{ response: { text: () => string } }` schema.
 */
async function generateWithFallback(contentInput, config = {}) {
  const groqKey = process.env.GROQ_API_KEY || '';
  
  if (groqKey) {
    try {
      console.log("Attempting generation using Groq...");
      const Groq = require('groq-sdk');
      const groq = new Groq({ apiKey: groqKey });
      
      const isChat = typeof contentInput === 'object' && contentInput.contents;
      let messages = [];
      
      if (isChat) {
        if (config.systemInstruction) {
          messages.push({ role: 'system', content: config.systemInstruction });
        }
        // Map Gemini contents format (model/user) to Groq messages format (assistant/user)
        const chatMsgs = contentInput.contents.map(c => ({
          role: c.role === 'model' ? 'assistant' : 'user',
          content: c.parts[0].text
        }));
        messages.push(...chatMsgs);
      } else {
        messages = [{ role: 'user', content: contentInput }];
      }
      
      const groqParams = {
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: config.generationConfig?.temperature || 0.4
      };
      
      // If JSON format requested
      if (config.generationConfig?.responseMimeType === 'application/json') {
        groqParams.response_format = { type: "json_object" };
      }
      
      const completion = await groq.chat.completions.create(groqParams);
      const text = completion.choices[0].message.content;
      
      console.log("Successfully generated content using Groq (llama-3.3-70b-versatile).");
      return {
        response: {
          text: () => text
        }
      };
    } catch (groqErr) {
      console.warn("Groq attempt failed, falling back to Gemini. Error:", groqErr.message);
    }
  } else {
    console.log("No GROQ_API_KEY found in environment. Proceeding directly to Gemini.");
  }
  
  // Call Gemini as the ultimate fallback
  return await generateWithGemini(contentInput, config);
}

module.exports = {
  genAI,
  generateWithFallback
};
