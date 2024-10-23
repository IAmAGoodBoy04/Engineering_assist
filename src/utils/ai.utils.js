const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.getAIResponse = async (message) => {
  const result = await model.generateContent(message);
  return result.response.text();
};