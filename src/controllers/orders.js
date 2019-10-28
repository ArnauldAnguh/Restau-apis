import Order from "../models/Orders";
export default {
  async fetchAllOrders(req, res) {
    const orders = await Order.find({});
    if (orders.length < 1) {
      return res
        .status(200)
        .json({ data: [], message: "No orders placed yet" });
    }
    return res
      .status(200)
      .json({ orders: orders, message: "successfully fetched orders" });
  },
  async fetchOrderById(req, res) {
    const order_id = parseInt(req.params.order_id);
    if (!order_id || isNaN(order_id)) {
      return res.status(400).json({ order_id: "A valid order Id is required" });
    }
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(200).json({ message: "Order not found" });
    }
    res.status(200).json({ order: order, message: "Order Found" });
  },
  async placeOrder(req, res) {
    let totalPrice = 0;
    try {
      totalPrice = req.body.quantity * req.body.unit_price;
      const order = new Order({
        customer_id: req.user.id,
        total_price: totalPrice,
        fooditem: req.body.fooditem
      });
      const newOrder = await order.save();
      // order.order_id = newOrder.id;
      // order.quantity = req.body.quantity;
      // order.unit_price = req.body.unit_price;
      // let hist = await order.saveOrderItems();
      return res
        .status(201)
        .json({ data: newOrder, message: "Order placed successfully" });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  },
  async updateOrder(req, res) {
    const order_id = parseInt(req.params.order_id, 10);
    const { status } = req.body;
    try {
      if (!order_id || Number.isNaN(order_id)) {
        return res.status(400).json({ error: "A valid order Id is required" });
      }
      const order = await Order.findById(order_id);
      if (!order) {
        return res.status(200).json({ msg: "Order not found" });
      }
      const quantity = req.body.quantity;
      const price = req.body.unit_price;
      if (quantity && price) {
        order.total_price = quantity * price;
      }
      order.fooditem = req.body.fooditem;
      order.status = status;
      const placedOrder = new Order(order);
      const newOrder = await placedOrder.update();
      res.status(200).json({ data: newOrder, success: "Order status updated" });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  async deleteOrder(req, res) {
    const order_id = parseInt(req.params.order_id, 10);
    const foodItem = await Order.findById(order_id);
    if (!foodItem) {
      return res.status(400).json({ message: "Order not Found" });
    } else {
      await Order.delete(order_id);
      return res.status(200).json({ message: "Order successfully deleted" });
    }
  }
};
