
import { GoogleGenAI } from "@google/genai";

export const GenAi = async (req, res) => {
    try {
        // Debug: Log the API key being used
        console.log("=== AI Controller Debug ===");
        console.log("Request body:", req.body);
        console.log("AI_KEY env value:", process.env.AI_KEY);
        console.log("AI_key env value:", process.env.AI_key);
        
        // Fix: Case sensitivity - .env uses AI_KEY (uppercase K)
        const apiKey = process.env.AI_KEY || process.env.AI_key;
        console.log("Using API key:", apiKey ? "[SET]" : "[UNDEFINED]");
        
        if (!apiKey) {
            return res.status(500).json({ error: "AI_KEY environment variable is not defined. Please check your .env file." });
        }
        
        const ai = new GoogleGenAI({ apiKey });
        
        async function main(contents) {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",  // Updated to use valid model
                contents: contents,
            });
            return response.text;
        }
        
        const { contents } = req.body;
        
        if (!contents) {
            return res.status(400).json({ error: "Please provide a message to chat with AI" });
        }
        
        const data = await main(contents + " - give me a short answer");
        console.log("AI response:", data);
        res.status(200).json(data.toString());
    } catch (e) {
        console.error("AI Controller Error:", e);
        // Return more informative error message
        const errorMessage = e.message || "Unknown error occurred";
        const statusCode = e.status || 500;
        res.status(statusCode).json({ error: errorMessage });
    }
}