import customers_DB from "../Services/customerService.js";
import Customers from "../models/customers.js";
//import getAllCustomers_DB from "../Services/customersService.js";
//import getAllDonates_DB from "../Services/donateGetservice.js";

export async function createCustomer(req, res) {
  try {
    const data = req.body;
    console.log("[customerController] Received order data:", JSON.stringify(data, null, 2));
    console.log("[customerController] totalAmount field:", data.totalAmount);
    const event = await customers_DB(data);

    res.status(201).json({
      event: event,
      message: "Payment is Successful.",
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function getAllCustomers(req, res) {
  try {
    const customers = await Customers.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function updateCustomerStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const customer = await Customers.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    res.json(customer);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      message: error.message,
    });
  }
}

{
  /*export async function getAllCustomers_DB(req, res) {
  try {
    const events = await getAllDonates_DB();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}*/
}
