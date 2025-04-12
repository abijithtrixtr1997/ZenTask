import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Get Gemini API Key from .env
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Define the type for the request body
interface GeminiRequestBody {
  question?: string;
}

// Update the route to ensure a proper response is sent
app.post(
  "/api/gemini",
  async (
    req: Request<{}, {}, GeminiRequestBody>,
    res: Response
  ): Promise<void> => {
    const { question } = req.body;

    if (!question) {
      res.status(400).json({ error: "No question provided" });
      return; // Ensure no further code runs after sending the response
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(question);
      const text = await result.response.text();
      res.status(200).json({ answer: text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to get response from Gemini" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
