import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
import {
  initFoodItems,
  createToken,
  deleteFoodItems
} from "../../db/seeders/seed.test";
import {
  invalidFoodItemId,
  notFoundItemId,
  firstItem,
  firstItemId,
  secondItem,
  secondItemId,
  modifiedSecondItem
} from "../data/foodItems";
import { inValidToken, firstUser, secondUser } from "../data/users";

chai.use(chaiHttp);

let adminToken = "";
let userToken = "";

before(async () => {
  try {
    await deleteFoodItems();
    await initFoodItems();
    userToken = await createToken(secondUser);
    adminToken = await createToken(firstUser);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

after(done => {
  done();
});

describe("Food Items", () => {
  describe("GET /menu - Get all food items", () => {
    it("should return a json object", done => {
      chai
        .request(app)
        .get("/api/v1/foodItems/menu")
        .set("authorization", `token ${userToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body.message).to.be.equal("success");
          expect(res).to.be.a.json;
          done();
        });
    });

    describe("GET /:foodItemId - Get foodItem by ID", () => {
      it("should return food item as a json object", done => {
        chai
          .request(app)
          .get(`/api/v1/foodItems/menu/${firstItemId}`)
          .end((err, res) => {
            if (err) return done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.a.json;
            done();
          });
      });
    });

    describe("POST /menu - Create food item", () => {
      it("should return an error if no token provided", done => {
        chai
          .request(app)
          .post("/api/v1/foodItems/menu")
          .set("authorization", `token ${inValidToken}`)
          .send(secondItem)
          .end((err, res) => {
            console.log("FOODITEM TOKEN", res.body);
            if (err) return done(err);
            expect(res).to.have.status(400);
            expect(res.body.error).equal("invalid token");
            done();
          });
      });
      it("should return an error if token is invalid", done => {
        chai
          .request(app)
          .post("/api/v1/foodItems/menu")
          .set("authorization", `token ${inValidToken}`)
          .send(secondItem)
          .end((err, res) => {
            if (err) return done(err);
            console.log("INVALID TOKEN", res.body);
            expect(res).to.have.status(400);
            expect(res.body.error).equal("invalid token");
            done();
          });
      });
      it("should return error if user is not admin", done => {
        chai
          .request(app)
          .post("/api/v1/foodItems/menu")
          .set("authorization", `token ${userToken}`)
          .send({ ...secondItem })
          .end((err, res) => {
            console.log("UNAUTH USER", res.body);
            if (err) return done(err);
            expect(res).to.have.status(401);
            expect(res.body).to.have.property("error");
            done();
          });
      });
      it("should return an error if food item already exists", done => {
        chai
          .request(app)
          .post("/api/v1/foodItems/menu")
          .set("authorization", `token ${adminToken}`)
          .send(firstItem)
          .end((err, res) => {
            console.log("FOODITEM ALREADY EXISTS  ", res.body);
            if (err) return done(err);
            expect(res).to.be.status(400);
            expect(res.body.error).equal("Food item already exists");
            expect(res).to.be.json;
            done();
          });
      });

      it("should create a new food item", done => {
        chai
          .request(app)
          .post("/api/v1/foodItems/menu")
          .set("authorization", `token ${adminToken}`)
          .send(secondItem)
          .end((err, res) => {
            if (err) return done(err);
            console.log("THIS IS NEW FOOD ", res.body);
            expect(res).to.have.status(201);
            expect(res.body.name).equal(secondItem.name);
            done();
          });
      });
      it("should not create food item with invalid data", done => {
        chai
          .request(app)
          .post("/api/v1/foodItems/menu")
          .send({ a: 1 })
          .end((err, res) => {
            if (err) return done(err);
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("error");
            done();
          });
      });
    });

    describe("PUT /:foodItemId - Update Food Item", () => {
      it("should update a food item", done => {
        chai
          .request(app)
          .put(`/api/v1/foodItems/menu/${secondItemId}`)
          .set("authorization", `token ${adminToken}`)
          .send(modifiedSecondItem)
          .end((err, res) => {
            if (err) return done(err);
            console.log("REQ BODY NAME", res.body);
            expect(res).to.have.status(200);
            done();
          });
      });
      it("should return an error if item id is invalid", done => {
        chai
          .request(app)
          .put(`/api/v1/foodItems/menu/${invalidFoodItemId}`)
          .send(modifiedSecondItem)
          .set("authorization", `token ${adminToken}`)
          .end((err, res) => {
            console.log("ITEM ID", res.body);
            if (err) return done(err);
            expect(res).to.have.status(400);
            expect(res.body.errors.food_item_id).equal(
              "A valid food Item Id is required"
            );
            done();
          });
      });
      it("should return an error if item is not valid", done => {
        chai
          .request(app)
          .put(`/api/v1/foodItems/menu/${notFoundItemId}`)
          .set("authorization", `token ${adminToken}`)
          .send({ a: "test" })
          .end((err, res) => {
            if (err) return done(err);
            console.log("ITEMS ERROR", res.body);
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("errors");
            done();
          });
      });
    });

    describe("DELETE /:foodItemId - Delete food item", () => {
      it("should delete a food item given the item id", done => {
        chai
          .request(app)
          .delete(`/api/v1/foodItems/menu/${secondItemId}`)
          .set("authorization", `token ${adminToken}`)
          .end((err, res) => {
            console.log(res.body);
            expect(res).to.have.status(204);
            expect(res.body.message).equal("Item deleted successfully");
            done();
          });
      });
    });
  });
});
