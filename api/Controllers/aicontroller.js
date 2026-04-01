import { GoogleGenAI } from "@google/genai";
import rateLimit from "express-rate-limit";

// Create rate limiter middleware: 10 requests per minute
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: "Too many requests. Please wait 60 seconds before trying again."
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(429).json({
      error: `Too many requests. Please wait 60 seconds before trying again.`
    });
  }
});

// Helper function to check if error is a rate limit (429) error
const isRateLimitError = (error) => {
  const errorStr = error.message?.toLowerCase() || "";
  return (
    error.status === 429 ||
    errorStr.includes("429") ||
    errorStr.includes("rate limit") ||
    errorStr.includes("too many requests") ||
    errorStr.includes("quota") ||
    errorStr.includes("quota exceeded")
  );
};

// Helper function to sleep for exponential backoff
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry logic with exponential backoff for transient errors
const retryWithBackoff = async (fn, maxRetries = 1, initialDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // If it's a rate limit error, don't retry immediately - wait longer
      if (isRateLimitError(error)) {
        console.log(`Rate limit detected, attempt ${attempt + 1}/${maxRetries + 1}`);
        if (attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt) * 2; // Longer delay for rate limits
          console.log(`Waiting ${delay}ms before retry...`);
          await sleep(delay);
        }
      } else {
        // For other transient errors, use shorter delay
        if (attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt);
          console.log(`Transient error, retrying in ${delay}ms...`);
          await sleep(delay);
        }
      }
    }
  }
  
  throw lastError;
};

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
      return res.status(500).json({ 
        error: "AI_KEY environment variable is not defined. Please check your .env file." 
      });
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
    
    // Use retry logic for the API call
    const data = await retryWithBackoff(
      () => main(contents + " - give me a short answer"),
      1, // 1 retry
      1000 // initial delay of 1 second
    );
    
    console.log("AI response:", data);
    res.status(200).json(data.toString());
  } catch (e) {
    console.error("AI Controller Error:", e);
    
    // Return more informative error message
    const errorMessage = e.message || "Unknown error occurred";
    
    // Check if it's a rate limit (429) or quota exceeded error
    if (isRateLimitError(e)) {
      return res.status(429).json({ 
        error: "Too many requests. Please wait 60 seconds before trying again." 
      });
    }
    
    // Check for quota exceeded specifically
    if (errorMessage.toLowerCase().includes("quota exceeded") || 
        errorMessage.toLowerCase().includes("insufficient quota")) {
      return res.status(429).json({
        error: "API quota exceeded. Please try again later."
      });
    }
    
    const statusCode = e.status || 500;
    res.status(statusCode).json({ error: errorMessage });
  }
}