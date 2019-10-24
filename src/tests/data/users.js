import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const firstUser = {
  id: 1,
  role: "admin",
  username: "johnfirst",
  email: "john.first@example.com",
  password: "john123",
  passwordConf: "john123"
};

export const secondUser = {
  id: 2,
  role: "user",
  username: "smithsecond",
  email: "smith.second@example.com",
  password: "smith123",
  passwordConf: "smith123"
};

export const thirdUser = {
  id: 3,
  username: "janethird",
  email: "jane.third@example.com",
  password: "jane123",
  passwordConf: "jane123"
};

export const fourthUser = {
  id: 4,
  role: "admin",
  username: "bob",
  email: "Bob.user@example.com",
  password: "bob1234",
  passwordConf: "bob1234"
};

export const correctCredentials = {
  username: "janethird",
  email: "jane.third@example.com",
  password: "jane123"
};

export const wrongCredentials = {
  username: "janethird",
  email: "wrong.email@example.com",
  password: "john123"
};

export const modifiedSecondUser = {
  role: "user",
  username: "SmithSecondII",
  email: "smith.second@example.com",
  password: "smith123",
  passwordOld: "smith123",
  passwordConf: "smith123"
};

export const failPassOldUser = {
  ...modifiedSecondUser,
  passwordOld: `${modifiedSecondUser.passwordOld}mutilate`
};

export const failConfPassUser = {
  ...modifiedSecondUser,
  passwordConf: `${modifiedSecondUser.passwordConf}mutilate`
};

export const invalidUser = {
  username: "Snowball",
  email: "test",
  password: "mypax",
  passwordConf: "mypasd"
};

export const created_at = "10-09-2019";

export const firstUserId = 1;

export const secondUserId = 2;

export const invalidUserId = "a";

export const notFoundUserId = 8888;

function createUserToken(user) {
  const token = jwt.sign(
    {
      id: 1,
      role: "user",
      username: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
    },
    process.env.JWT_KEY
  );

  return token;
}

function createAdminToken(user) {
  const token = jwt.sign(
    {
      id: 2,
      role: "user",
      username: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
    },
    process.env.JWT_KEY
  );

  return token;
}

export const userToken = createUserToken(secondUser);
export const adminToken = createAdminToken(firstUser);
export const inValidToken =
  "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNTQxMjUxOTM1LCJpYXQiOjE1Mzg2NTk5MzV9.MVOHv_qFPuS9lbt4gxK4t5DU6j71vGdAloo85T";
