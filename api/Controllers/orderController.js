import Order from "../models/orderModel.js";

// Create a new order
export async function createOrder(req, res) {
  try {
    const data = req.body;
    console.log("[orderController] Received order data:", JSON.stringify(data, null, 2));
    console.log("[orderController] totalAmount field:", data.totalAmount);
    
    const newOrder = new Order({
      userId: data.userId || null,
      items: data.items || [],
      totalAmount: data.totalAmount || 0,
      status: "Pending",
      shippingAddress: data.address || data.shippingAddress || "",
      paymentMethod: data.payment || data.paymentMethod || "",
      customerName: data.name || data.customerName || "",
      customerPhone: data.phone || data.customerPhone || "",
      customerEmail: data.email || data.customerEmail || "",
      notes: data.notes || "",
    });

    const savedOrder = await newOrder.save();
    console.log("[orderController] Order saved successfully:", savedOrder._id);

    res.status(201).json({
      success: true,
      order: savedOrder,
      message: "Order placed successfully.",
    });
  } catch (error) {
    console.log("Error creating order: ", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Get all orders
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.log("Error fetching orders: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get orders by user ID
export async function getOrdersByUser(req, res) {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.log("Error fetching user orders: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get single order by ID
export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.log("Error fetching order: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update order status
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.json({
      success: true,
      order: order,
      message: "Order status updated"
    });
  } catch (error) {
    console.log("Error updating order status: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete order
export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.log("Error deleting order: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
