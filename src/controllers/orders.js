import Order from "../models/Orders";

export default {
  async fetchAllOrders(req, res) {
    const orders = await Order.find({});
    if (!orders.length) {
      return res
        .status(200)
        .send({ data: [], message: "No orders placed yet" });
    }
    return res
      .status(200)
      .json({ data: orders, message: "successfully fetched orders " });
  },

  async fetchOrderById(req, res) {
    const order_id = parseInt(req.params.order_id);
    if (!order_id || isNaN(order_id)) {
      return res.status(400).send({ order_id: "A valid order Id is required" });
    }
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(200).send({ message: "Order not found" });
    }
    res.status(200).json({ data: order, message: "Order Found" });
  },

  async placeOrder(req, res) {
    let totalPrice = 0;
    const body = req.body;
    totalPrice = body.quantity * body.price;
    const orderObj = {
      customer_id: body.customer_id,
      total_price: totalPrice
    };
    const order = new Order(orderObj);
    const newOrder = await order.save();

    return res
      .status(201)
      .json({ data: newOrder, message: "Order placed successfully" });
  },

  // Update Order
  async updateOrder(req, res) {
    const order_id = parseInt(req.params.order_id, 10);
    const { status } = req.body;

    if (!order_id || Number.isNaN(order_id)) {
      return res.status(400).send({ error: "A valid order Id is required" });
    }
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(200).send({ msg: "Order not found" });
    }
    const quantity = req.body.quantity;
    const price = req.body.unit_price;
    const total_price = quantity * price;
    order.status = status;
    order.total_price = total_price;
    const placedOrder = new Order(order);
    const newOrder = await placedOrder.update();
    res.status(200).json({ data: newOrder, message: "Order status updated" });
  },
  // Delete An Order
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
