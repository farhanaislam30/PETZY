import Donate from "../models/donators.js";

async function getAllDonates_DB(req, res) {
  const donates = await Donate.find({});
  return donates;
}

export default getAllDonates_DB;
