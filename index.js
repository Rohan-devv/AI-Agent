import { GoogleGenerativeAI } from "@google/generative-ai";
import readlineSync from "readline-sync";

// --- API Key (direct variable) ---
const GEMINI_API_KEY = "AIzaSyB7Uco4d8evmh302DouJHC9OW0p4OG5TVI";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// --- Tool function ---
function getweather(city) {
  if (city.toLowerCase() === "delhi") return 30;
  if (city.toLowerCase() === "mumbai") return 35;
  if (city.toLowerCase() === "kolkata") return 32;
  return null;
}

/// --- FIXED SYSTEM PROMPT ---
const SYSTEM_PROMPT = `
You are a weather assistant. 
You have access to this function: getweather(city: string) -> number (temperature in °C).
You must think in steps and strictly reply in JSON lines like this:

{ "type": "plan", "plan": "I will call getweather for Delhi" }
{ "type": "action", "function": "getweather", "input": "Delhi" }
{ "type": "observation", "observation": "30" }
{ "type": "plan", "plan": "I will call getweather for Mumbai" }
{ "type": "action", "function": "getweather", "input": "Mumbai" }
{ "type": "observation", "observation": "35" }
{ "type": "output", "output": "The sum of weather of Delhi and Mumbai is 65°C" }

Always use this structure. Do not add extra text.
`;

// --- Model init ---
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });


// --- MEMORY (conversation history) ---
let history = [
  { role: "user", parts: [{ text: SYSTEM_PROMPT }] }
];


// --- Conversation loop ---
async function runConversation() {
  console.log("Type 'exit' to quit.\n");

  while (true) {
    const userQuery = readlineSync.question(">> ");
    if (userQuery.toLowerCase() === "exit") break;

    // Add user input to history
    history.push({
      role: "user",
      parts: [{ text: userQuery }]
    });


    
    while (true) {
      const result = await model.generateContent({ contents: history });
      const response = result.response.text().trim();
      console.log("Model:\n", response);

      // Save model response in history
      history.push({
        role: "model",
        parts: [{ text: response }]
      });

      // Find last JSON line
      // Clean model response and keep only valid JSON lines
      const lines = response
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.startsWith("{") && l.endsWith("}"));

      // extra safety: remove ```json or ```
      const cleanLines = lines.map(l => l.replace(/```json|```/g, "").trim());

      if (cleanLines.length === 0) break;

      const lastJson = JSON.parse(cleanLines[cleanLines.length - 1]);


      if (lastJson.type === "action" && lastJson.function === "getweather") {
        const obs = getweather(lastJson.input);

        // add observation back
        history.push({
          role: "user",
          parts: [{ text: `{ "type": "observation", "observation": "${obs}" }` }]
        });
      } else if (lastJson.type === "output") {
        console.log("✅ Final Answer:", lastJson.output);
        break;
      } else {
        break;
      }
    }
  }
}

runConversation();






