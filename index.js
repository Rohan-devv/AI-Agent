import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyB7Uco4d8evmh302DouJHC9OW0p4OG5TVI");

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent("Say only: Hello Gemini!");
  console.log(result.response.text());
}

run().catch(console.error);
