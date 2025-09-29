import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDannA2YcUAqZ0Qc98iSFqjoTU0juwv0l4");

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent("Say only: Hello Gemini!");
  console.log(result.response.text());
}

run().catch(console.error);
