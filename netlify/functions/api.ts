import express from "express";
import serverless from "serverless-http";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini SDK lazily to ensure robust start even if env key is missing initially
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add your API key in Netlify Environment Variables and REDEPLOY the site.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// REST API endpoint to generate ASTROLOGY Gemini insights
// Provide the path mapping depending on how Netlify maps it
const router = express.Router();

router.post("/horoscope", async (req, res) => {
  try {
    const { name, gender, dob, tob, city, rashi, nakshatra, pada, ascendant, signDetails, language } = req.body;

    const prompt = `You are an expert royal Vedic Astrologer (Jyotish Acharya) with deep knowledge of Shastras.
Generate a clear, accurate, and well-structured personal horoscope reading in "${language || "English"}" language for:
- Name: ${name}
- Gender: ${gender}
- Birth Date: ${dob}
- Birth Time: ${tob}
- Birth Place: ${city}
- Moon Sign (Rashi): ${rashi}
- Nakshatra & Pada: ${nakshatra} (Pada ${pada})
- Ascendant (Lagna): ${ascendant}

Please structure your response into the following EXACT sections, using Markdown, and use rich traditional cosmological terminology. Address the user directly in a respectful, wise and advisory tone.

# SECTION 1: PERSONALITY & CORE STRENGTHS
Describe their psychological profile, element balance, and unique inherent strengths based on their Rashi (${rashi}) and Nakshatra (${nakshatra}).

# SECTION 2: CAREER, JOB & FINANCE
Deeply analyze career pathways, potential for business vs. employment, promotion prospects, and financial fortune/investments.

# SECTION 3: MARRIAGE, RELATIONSHIPS & SOCIAL LIFE
Analyze compatibility dynamics, marriage timing indicators, and recommendations for harmonious social and personal relationships.

# SECTION 4: HEALTH, LIFESTYLE & VITALITY
Provide health guidelines, food choices aligning with their Dosha, lifestyle warnings, and physical energy preservation.

# SECTION 5: SPIRITUAL GROWTH & DESTINY
Analyze spiritual inclinations, karmic paths, moksha potential, and deeper soul missions based on Atmakaraka, Ketu, and 9th/12th houses.

# SECTION 6: RECOMMENDED ASTROLOGICAL REMEDIES & DEITY
Suggest concrete gems, sacred mantras (such as specific beeja mantras), fasting days, charitable deeds, and deity worship tailored precisely to their planetary configurations.

Format the response with clean title sections and bullet points. Keep each section brief — 3 to 4 sentences maximum. Keep the ENTIRE response under 350 words total. Maintain fidelity to traditional Vedic knowledge. Do not use generic horoscopes.`;

    const ai = getAIClient();

    let textResult = "We are currently experiencing high demand. Please try again later.";
    let success = false;

    for (let i = 0; i < 3; i++) {
      try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { maxOutputTokens: 1200, thinkingConfig: { thinkingBudget: 0 } },
          });
        textResult = response.text || "";
        success = true;
        break;
      } catch (err: any) {
        if (err.message && err.message.includes("503")) {
          console.warn(`[Gemini API] 503 Service Unavailable encountered. Retrying... (${i + 1}/3)`);
          await new Promise(r => setTimeout(r, 1000));
        } else {
          throw err;
        }
      }
    }

    res.json({ text: textResult });
  } catch (error: any) {
    console.error("Gemini Horoscopes calculation error:", error);
    res.status(500).json({ error: error.message || "Celestial connection interrupted" });
  }
});

app.use("/api", router);

export const handler = serverless(app);
