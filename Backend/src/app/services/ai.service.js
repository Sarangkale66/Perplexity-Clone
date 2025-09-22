const { ChatGoogleGenerativeAI } = require("@langchain/google-genai")
const { ChatGroq } = require("@langchain/groq");
const { ChatMistralAI } = require("@langchain/mistralai");

const model1 = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const model2 = new ChatGroq({
  model: "openai/gpt-oss-20b",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY
});

const model3 = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
  apiKey: process.env.MISTRAL_API_KEY
});


async function generateContentStream(messages, onData) {
  let responseTxt = "";

  const stream = await model1.stream(messages);

  for await (const chunk of stream) {
    if (chunk.content) {
      responseTxt += chunk.content;
      onData(chunk.content);
    }
  }

  return responseTxt;
}

module.exports = { generateContentStream };