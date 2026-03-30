import createDonate_DB from "../Services/donateService.js";
import getAllDonates_DB from "../Services/donateGetservice.js";

export async function createDonate(req, res) {
  try {
    const data = req.body;
    const event = await createDonate_DB(data);

    res.status(201).json({
      event: event,
      message: "Donation is Successful.",
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function getAllDonates(req, res) {
  try {
    const events = await getAllDonates_DB();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
