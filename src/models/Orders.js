import db from "../db";

export default class Orders {
  constructor(order) {
    if (order && order.id) {
      this.id = order.id;
    }
    this.customer_id = order.customer_id ? order.customer_id : null;
    this.total_price = order.total_price ? order.total_price : 0;
    this.status = order.status ? order.status : null;
    if (order.created_at) {
      this.created_at = order.created_at;
    }
    if (order.updated_at || order.updated_at == null) {
      this.updated_at = order.updated_at;
    }
  }

  async save() {
    const params = [this.customer_id, this.total_price];
    try {
      const { rows } = await db.query(
        `INSERT INTO orders(customer_id, total_price) VALUES($1, $2) RETURNING *`,
        params
      );
      const newOrder = new Orders(rows[0]);
      return newOrder;
    } catch (e) {
      return e;
    }
  }

  async saveOrderItems(items) {
    let data = "";
    items.forEach((item, index) => {
      console.log("Items:", item);
      if (index === 0) {
        data = `(${this.id}, ${item.item_id}, ${item.quantity}, ${item.unit_price})`;
      } else {
        data = `${data}, (${this.id}, ${item.item_id}, ${item.quantity}, ${item.unit_price})`;
      }
    });
    const text = `INSERT INTO order_items(order_id, item_id, quantity, total_price) VALUES ${data}`;
    try {
      const { rows } = await db.query(text);
    } catch (e) {
      return e;
    }
  }

  async update() {
    const params = [this.customer_id, this.total_price, this.status, this.id];
    try {
      const { rows } = await db.query(
        `UPDATE orders SET 
                          customer_id=$1,
                          total_price=$2,
                          status=$3,
                          updated_at=NOW() 
                      WHERE id=$4 RETURNING *`,
        params
      );
      const order = rows[0];
      console.log(order);
      return order;
    } catch (error) {
      return error;
    }
  }

  static async find(query) {
    let paramsString = "";
    let queryString = "";
    const params = [];
    queryString = `SELECT * FROM orders`;

    try {
      const { rows } = await db.query(queryString, params);
      return rows;
    } catch (error) {
      return error;
    }
  }

  static async findById(orderId) {
    try {
      const { rows } = await db.query(
        "SELECT * FROM orders WHERE id=$1 LIMIT 1",
        [orderId]
      );
      return rows[0];
    } catch (error) {
      return error;
    }
  }

  static async delete(orderId) {
    try {
      const result = await db.query("DELETE FROM orders WHERE id=$1", [
        orderId
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }
}
