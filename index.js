import { GoogleGenerativeAI } from "@google/generative-ai";
const GEMINI_API_KEY = "AIzaSyB7Uco4d8evmh302DouJHC9OW0p4OG5TVI";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Tool function
function getweather(city) {
  if (city.toLowerCase() === "delhi") return 30;
  if (city.toLowerCase() === "mumbai") return 35;
  if (city.toLowerCase() === "kolkata") return 32;
  return null;
}

// --- SYSTEM PROMPT ---
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

const userQuery = "What is the sum of weather of Delhi and Mumbai?";

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

async function runConversation() {
  // Start with system + user messages
  let history = [
    {
      role: "user",
      parts: [
        { text: SYSTEM_PROMPT },
        { text: userQuery }
      ]
    }
  ];

  while (true) {
    const result = await model.generateContent({ contents: history });
    const response = result.response.text().trim();

    console.log("Model:", response);

    // Parse last JSON line
    const lines = response.split("\n").filter(l => l.trim().startsWith("{"));
    const lastJson = JSON.parse(lines[lines.length - 1]);

    if (lastJson.type === "action" && lastJson.function === "getweather") {
      // Run the JS tool
      const obs = getweather(lastJson.input);

      // Add observation back to history
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

runConversation();










