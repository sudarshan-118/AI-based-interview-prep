const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MODELS_TO_TRY = [
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemini-2.5-pro'
];

/**
 * Generates content with automatic fallback to alternative models if the primary model fails.
 * 
 * @param {string|object} contentInput - Either a prompt string or a { contents } payload for chat.
 * @param {object} config - Generation configuration options.
 * @param {object} [config.generationConfig] - Configuration like responseMimeType.
 * @param {string} [config.systemInstruction] - System instructions for the model.
 * @returns {Promise<any>} The result from model.generateContent
 */
async function generateWithFallback(contentInput, config = {}) {
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
      
      // If we got here, it succeeded!
      console.log(`Successfully generated content using model: ${modelName}`);
      return result;
    } catch (err) {
      console.warn(`Gemini model fallback: Failed using model ${modelName}. Error: ${err.message}`);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed to generate content');
}

module.exports = {
  genAI,
  generateWithFallback
};
