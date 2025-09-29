import { GoogleGenerativeAI } from "@google/generative-ai";
const GEMINI_API_KEY = "AIzaSyDannA2YcUAqZ0Qc98iSFqjoTU0juwv0l4";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// // client banaya hai yaha humne jisse hum baat kar sakte hai

// Tools-->

function getweather(city) {
    if (city === "delhi") return "30 degree celsius";
    if (city === "mumbai") return "35 degree celsius";
    if (city === "kolkata") return "32 degree celsius";
}

const user = "what is the weather of delhi";
const city = "delhi";
const weather = getweather(city);

const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });


model.generateContent(`User asked: ${user}. Real data: ${weather}.`)
.then((result) => {
    console.log(result.response.text());
});
