import Customers from "../models/customers.js";

async function customers_DB(userData) {
  const { name,phone, email, address, payment } = userData;

  const nCustomers = new Customers({
    name: name,
    phone: phone,
    email: email,
    address: address,
    payment: payment,

  });

  return await nCustomers.save();
}

export default customers_DB;
