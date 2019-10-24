import chai, { expect } from "chai";
import Order from "../../models/Orders";
import { created_at } from "../data/orders";

describe("Order model", () => {
  it("should instantiate a new order object", () => {
    const tempOrder = new Order({ created_at });
    expect(tempOrder.created_at).equal(created_at);
    expect(tempOrder).to.be.an.instanceOf(Order);
  });
});
