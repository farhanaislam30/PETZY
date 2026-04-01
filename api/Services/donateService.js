import Donate from "../models/donators.js";

async function createDonate_DB(userData) {
  const { name, age, location, type, image, email, phone } = userData;

  const nDonate = new Donate({
    name: name,
    age: age,
    image: image,
    location: location,
    type: type,
    email: email,
    phone: phone,
  });

  return await nDonate.save();
}

export default createDonate_DB;
