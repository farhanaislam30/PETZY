import PetInterest from "../models/PetInterest.js";

export async function showInterest(req, res) {
  console.log("=== SHOW INTEREST DEBUG ===");
  console.log("Received request body:", JSON.stringify(req.body, null, 2));
  console.log("Content-Type:", req.headers["content-type"]);
  
  try {
    const { petId, petName, email, phone, livingSituation, experience, otherPets } = req.body;
    
    // Detailed field validation
    console.log("=== Field Validation ===");
    console.log("petId:", petId, "- Type:", typeof petId);
    console.log("petName:", petName, "- Type:", typeof petName);
    console.log("email:", email, "- Type:", typeof email);
    console.log("phone:", phone, "- Type:", typeof phone);
    console.log("livingSituation:", livingSituation, "- Type:", typeof livingSituation);
    console.log("experience:", experience, "- Type:", typeof experience);
    console.log("otherPets:", otherPets, "- Type:", typeof otherPets);
    
    if (!petId) {
      console.log("ERROR: petId is missing or undefined");
      return res.status(400).json({ message: "Missing required field: petId" });
    }
    if (!email) {
      console.log("ERROR: email is missing or undefined");
      return res.status(400).json({ message: "Missing required field: email" });
    }
    if (!phone) {
      console.log("ERROR: phone is missing or undefined");
      return res.status(400).json({ message: "Missing required field: phone" });
    }

    // Create a new interest entry
    const newInterest = new PetInterest({
      petId,
      petName: petName || "",
      email,
      phone,
      livingSituation,
      experience,
      otherPets,
      status: "Pending",
    });

    // Save to database
    await newInterest.save();

    res.status(201).json({ message: "Interest recorded successfully." });
  } catch (error) {
    console.error("Error saving interest:", error);
    res.status(500).json({ message: "Error saving interest." });
  }
}

// Get pet interests by email
export async function getPetInterestsByEmail(req, res) {
  try {
    const { email } = req.params;
    const interests = await PetInterest.find({ email }).sort({ timestamp: -1 });
    res.json({
      success: true,
      interests: interests
    });
  } catch (error) {
    console.error("Error fetching pet interests:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update pet interest status (admin action)
export async function updatePetInterestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log("[updatePetInterestStatus] ID:", id, "Status:", status);
    
    // Validate status value
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }
    
    const updatedInterest = await PetInterest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedInterest) {
      return res.status(404).json({ success: false, message: "Pet interest not found" });
    }
    
    console.log("[updatePetInterestStatus] Updated:", updatedInterest);
    res.json({ success: true, interest: updatedInterest, message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating pet interest status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
