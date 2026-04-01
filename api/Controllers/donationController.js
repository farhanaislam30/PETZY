import Donation from "../models/donationModel.js";

// Create a new donation
export async function createDonation(req, res) {
  try {
    const data = req.body;
    console.log("[donationController] Received donation data:", JSON.stringify(data, null, 2));

    const newDonation = new Donation({
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      amount: data.amount,
      message: data.message || "",
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId || "",
      status: "Completed",
    });

    const savedDonation = await newDonation.save();
    console.log("[donationController] Donation saved successfully:", savedDonation._id);

    res.status(201).json({
      success: true,
      donation: savedDonation,
      message: "Thank you for your donation!",
    });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Get all donations (for admin)
export async function getAllDonations(req, res) {
  try {
    const donations = await Donation.find().sort({ timestamp: -1 });
    res.json({
      success: true,
      donations: donations,
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get donations by email
export async function getDonationsByEmail(req, res) {
  try {
    const { email } = req.params;
    const donations = await Donation.find({ donorEmail: email }).sort({ timestamp: -1 });
    res.json({
      success: true,
      donations: donations,
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}