import chai, { expect } from "chai";
import User from "../../models/User";
import { created_at } from "../data/users";

describe("User model", () => {
  it("should instantiate a new User object", () => {
    const tempUser = new User({ created_at });
    expect(tempUser.created_at).equal(created_at);
    expect(tempUser).to.be.an.instanceOf(User);
  });
});
