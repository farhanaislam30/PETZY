import customers_DB from "../Services/customerService.js";
//import getAllCustomers_DB from "../Services/customersService.js";
//import getAllDonates_DB from "../Services/donateGetservice.js";

export async function createCustomer(req, res) {
  try {
    const data = req.body;
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
