import PetInterest from "../models/PetInterest.js";

export async function showInterest(req, res) {
  console.log("Received request:", req.body);

  try {
    const { petId, email, phone, livingSituation, experience, otherPets } = req.body;
    if (!petId || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new interest entry
    const newInterest = new PetInterest({
      petId,
      email,
      phone,
      livingSituation,
      experience,
      otherPets,
    });

    // Save to database
    await newInterest.save();

    res.status(201).json({ message: "Interest recorded successfully." });
  } catch (error) {
    console.error("Error saving interest:", error);
    res.status(500).json({ message: "Error saving interest." });
  }
}
