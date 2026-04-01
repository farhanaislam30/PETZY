import Customers from "../models/customers.js";

async function customers_DB(userData) {
  console.log("[customerService] Received order data:", JSON.stringify(userData, null, 2));
  const { name, phone, email, address, payment, items, total, totalAmount, notes } = userData;

  console.log("[customerService] Extracted total:", total, "| totalAmount:", totalAmount);
  console.log("[customerService] Using fallback: total || totalAmount || 0 =", total || totalAmount || 0);

  const nCustomers = new Customers({
    name: name,
    phone: phone,
    email: email,
    address: address,
    payment: payment,
    items: items || [],
    total: total || totalAmount || 0,
    notes: notes || "",
    status: "Pending",
  });

  return await nCustomers.save();
}

export default customers_DB;
