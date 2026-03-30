
import { GoogleGenAI } from "@google/genai";




export const GenAi = async (req, res) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.AI_key });
        async function main(contents) {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: contents + "give me answer in short",
            });
            return response.text;
        }
        const { contents } = req.body
        const data = await main(contents);
        console.log("AI response:", data);
        res.status(200).json(data.toString())
    } catch (e) {
        console.log(e)
        res.status(422).json(e)
    }
}