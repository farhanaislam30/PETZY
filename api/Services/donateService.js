import Donate from "../models/donators.js";

async function createDonate_DB(userData) {
  console.log("donateService - received from controller:", userData);
  const { name, age, location, type, image, email, phone, reason } = userData;

  const nDonate = new Donate({
    name: name,
    age: age,
    image: image,
    location: location,
    type: type,
    email: email,
    phone: phone,
    reason: reason,
  });

  console.log("donateService - about to save to DB:", nDonate);
  return await nDonate.save();
}

export default createDonate_DB;
