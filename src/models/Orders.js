import db from "../db";

export default class Orders {
  constructor(order) {
    if (order && order.id) {
      this.id = order.id;
    }
    this.customer_id = order.customer_id ? order.customer_id : null;
    this.itemName = order.fooditem ? order.fooditem : null;
    this.status = order.status ? order.status : null;
    this.total_price = order.total_price ? order.total_price : 0;
    this.order_id = order.id ? order.id : 0;
    this.quantity = order.quantity ? order.quantity : 0;
    if (order.created_at) {
      this.created_at = order.created_at;
    }
    if (order.updated_at || order.updated_at == null) {
      this.updated_at = order.updated_at;
    }
  }

  async save() {
    const params = [this.customer_id, this.total_price, this.itemName];
    try {
      const { rows } = await db.query(
        `INSERT INTO orders(customer_id, total_price, item) VALUES ($1, $2, $3) RETURNING *`,
        params
      );
      return rows;
    } catch (e) {
      return e;
    }
  }

  async saveOrderItems() {
    const params = [
      this.order_id,
      this.itemName,
      this.total_price,
      this.quantity
    ];
    const text = `INSERT INTO order_items(order_id,item,total_price,quantity) VALUES($1,$2,$3,$4) RETURNING *`;
    try {
      const { rows } = await db.query(text, params);
      return new Orders(rows[0]);
    } catch (e) {
      return e;
    }
  }

  async update() {
    const params = [
      this.customer_id,
      this.itemName,
      this.total_price,
      this.status,
      this.id
    ];
    try {
      const { rows } = await db.query(
        `UPDATE orders SET 
                          customer_id=$1,
                          item=$2,
                          total_price=$3,
                          status=$4,
                          updated_at=NOW() 
                      WHERE id=$5 RETURNING *`,
        params
      );
      const order = rows[0];
      console.log(order);
      return order;
    } catch (error) {
      return error;
    }
  }

  static async getOrderHistory(userId) {
    const text = `SELECT o.*, o_i.*, i.name, i.item_image
                      FROM orders o LEFT JOIN order_items o_i ON o.id=o_i.order_id
                      LEFT JOIN food_items i ON i.name=o_i.item WHERE o.customer_id=$1`;
    try {
      const { rows } = await db.query(text, [userId]);

      return rows.length ? rows : [];
    } catch (error) {
      return new Error(error);
    }
  }

  static async find(query) {
    let paramsString = "";
    let queryString = "";
    const params = [];

    if (Object.keys(query).length > 0) {
      Object.keys(query).map((key, index) => {
        index += 1;
        const extendQuery = index === 1 ? "" : " AND";
        paramsString += `${extendQuery} ${key}=$${index}`;
        params.push(query[key]);
        return key;
      });

      queryString = `SELECT o.*, o_i.*, i.name, i.image, u.username, u.email
                      FROM orders o 
                    LEFT JOIN order_items o_i ON o.id=o_i.order_id
                    LEFT JOIN food_items i ON i.id=o_i.item_id 
                    LEFT JOIN users u ON u.id=o.customer_id WHERE ${paramsString}`;
    } else {
      queryString = `SELECT * FROM orders`;
    }
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
