import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
import {
  firstOrder,
  firstOrderId,
  secondOrder,
  secondOrderId,
  modifiedStatus,
  invalidStatus,
  invalidOrderId,
  cart
} from "../data/orders";
import { initOrders, initUsers, createToken } from "../../db/seeders/seed.test";
import { secondUser, firstUser } from "../data/users";

chai.use(chaiHttp);

let userToken = "";
let adminToken = "";

before(async () => {
  await initOrders();
  userToken = await createToken(secondUser);
  adminToken = await createToken(firstUser);
});

after(done => {
  done();
});

describe("Orders", () => {
  describe("GET /orders - Get all orders", () => {
    it("should return a json object", done => {
      chai
        .request(app)
        .get("/api/v1/orders")
        .set("authorization", `token ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.a.json;
          done();
        });
    });
    it("should return all available orders", done => {
      chai
        .request(app)
        .get("/api/v1/orders")
        .set("authorization", `token ${adminToken}`)
        .end((err, res) => {
          console.log("ALL ORDERS", res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GET /:orderId - Get order by ID", () => {
    it("should return a json Object", done => {
      chai
        .request(app)
        .get(`/api/v1/orders/${firstOrderId}`)
        .set("authorization", `token ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.a.json;
          done();
        });
    });
    it("should return an error if order ID is invalid", done => {
      chai
        .request(app)
        .get(`/api/v1/orders/${invalidOrderId}`)
        .set("authorization", `token ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.a.json;
          done();
        });
    });
  });

  describe("POST /orders - Place order", () => {
    it("should place a new order", done => {
      chai
        .request(app)
        .post("/api/v1/orders")
        .set("authorization", `token ${userToken}`)
        .send(firstOrder)
        .end((err, res) => {
          console.log("ERROR HERE", res.body);
          if (err) return done(err);
          expect(res).to.have.status(201);
          done();
        });
    });
  });

  describe("PUT /:orderId - Update Order Status", () => {
    it("should update an order status", done => {
      chai
        .request(app)
        .put(`/api/v1/orders/${firstOrderId}`)
        .set("authorization", `token ${userToken}`)
        .send({ status: modifiedStatus })
        .end((err, res) => {
          if (err) return done(err);
          console.log("UPDATING STATUS ", res.body);
          expect(res).to.have.status(200);
          expect(res.body.status).equal(modifiedStatus);
          done();
        });
    });

    it("should return an error if status is invalid", done => {
      chai
        .request(app)
        .put(`/api/v1/orders/${invalidOrderId}`)
        .set("authorization", `token ${userToken}`)
        .send({ status: invalidStatus })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("errors");
          done();
        });
    });
  });
});
