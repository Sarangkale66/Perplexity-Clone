const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

async function generateContentStream(txt, onData) {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: txt,
  });

  let responseTxt = "";

  for await (const chunk of response) {
    responseTxt += chunk.text;
    onData(chunk.text);
  }

  return responseTxt;

}

module.exports = { generateContentStream };