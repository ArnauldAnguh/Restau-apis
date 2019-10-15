import db from "../db";

export default class FoodItem {
  constructor(foodItem) {
    if (foodItem.id) {
      this.id = foodItem.id;
    }
    this.name = foodItem.name ? foodItem.name.toString() : null;
    this.description = foodItem.description
      ? foodItem.description.toString()
      : 0;
    this.quantity = foodItem.quantity ? foodItem.quantity : 0;
    this.price = foodItem.price ? foodItem.price : 0;
    this.image = foodItem.image
      ? foodItem.image.toString()
      : "https://via.placeholder.com/150/000000/FFFFFF/?text=Food Item";
    if (foodItem.created_at) {
      this.created_at = foodItem.created_at;
    }
    if (foodItem.updated_at || foodItem.updated_at == null) {
      this.updated_at = foodItem.updated_at;
    }
  }

  async save() {
    const params = [
      this.name,
      this.description,
      this.quantity,
      this.price,
      this.image
    ];
    try {
      const { rows } = await db.query(
        `INSERT INTO food_items (name, description, quantity, unit_price, image)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        params
      );
      console.log(rows);
      return rows;
    } catch (e) {
      return e;
    }
  }

  async update() {
    const params = [
      this.name,
      this.description,
      this.quantity,
      this.price,
      this.id
    ];
    try {
      await db.query(
        `UPDATE food_items SET 
                        name=$1,
                        description=$2,
                        quantity=$3,
                        unit_price=$4,
                        updated_at=NOW() 
                    WHERE id=$5`,
        params
      );
      const foodItem = await FoodItem.findById(this.id);
      return foodItem;
    } catch (e) {
      return e;
    }
  }

  static async find(query = {}) {
    let paramsString = "";
    let queryString = "";
    const params = [];
    const objArr = Object.keys(query);
    if (objArr.length > 0) {
      objArr.map((key, index) => {
        index += 1;
        const extendQuery = index === 1 ? "" : " AND";
        paramsString += `${extendQuery} ${key}=$${index}`;
        params.push(query[key]);
        return key;
      });
      queryString = `SELECT * FROM food_items WHERE ${paramsString}`;
    } else {
      queryString = "SELECT * FROM food_items";
    }

    try {
      const { rows } = await db.query(queryString, params);
      return rows;
    } catch (e) {
      return e;
    }
  }

  static async findById(foodItemId) {
    try {
      const { rows } = await db.query(
        "SELECT * FROM food_items WHERE id=$1 LIMIT 1",
        [foodItemId]
      );
      return rows.length ? new FoodItem(rows[0]) : false;
    } catch (e) {
      return e;
    }
  }

  static async search(searchKey) {
    try {
      const { rows } = await db.query(
        `SELECT * FROM food_items WHERE name LIKE '%${searchKey}%' OR description LIKE '%${searchKey}%'`
      );
      return rows;
    } catch (e) {
      return e;
    }
  }

  static async delete(foodItemId) {
    try {
      const result = await db.query("DELETE FROM food_items WHERE id=$1", [
        foodItemId
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }
}
