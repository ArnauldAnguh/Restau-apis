import chai, { expect } from "chai";
import FoodItem from "../../models/foodItems";
import { created_at } from "../data/foodItems";

describe("FoodItem model", () => {
  it("should instantiate a new FoodItem object", () => {
    const tempFoodItem = new FoodItem({ created_at });
    expect(tempFoodItem.created_at).equal(created_at);
    expect(tempFoodItem).to.be.an.instanceOf(FoodItem);
  });
});
