import { removeTestUser, createTestUser } from "./utils.test.js";
import supertest from "supertest";
import { web } from "../src/app/web.js";
import { prisma } from "../src/app/database.js";
import { logger } from "../src/app/logging.js";

describe("register user", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register new user", async () => {
    const result = await supertest(web)
      .post("/api/users")
      .set("Accept", "application/json")
      .send({
        username: "test",
        password: "rahasia",
        name: "test",
      });

    logger.info(result);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should gabisa register jika tidak lengkap", async () => {
    const result = await supertest(web)
      .post("/api/users")
      .set("Accept", "application/json")
      .send({
        username: "test",
        password: "rahasia",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    logger.info(result.body.errors);
  });
});

describe("login user", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });
  it("should login", async () => {
    let result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    // logger.error(result)
  });
});

describe("user get api", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });

  it("get api user", async () => {
    const user = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test");

    expect(user.status).toBe(200);
    expect(user.body.data.username).toBe("test");
  });

  it("jika ga ada token", async () => {
    const user = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "");

    expect(user.status).toBe(401);
    expect(user.body.errors).toBeDefined();
  });
  it("jika ga ada authorization", async () => {
    const user = await supertest(web).get("/api/users/current");

    expect(user.status).toBe(401);
    expect(user.body.errors).toBeDefined();
  });
});

describe("update user api patch /api/users/current", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });
  it("update success", async () => {
    const newUser = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        password: "slebew",
        name: "kuntuludin",
      });

    expect(newUser.status).toBe(200);
    expect(newUser.body.data.name).toBe("kuntuludin");
    expect(newUser.body.data.username).toBe("test");
  });
});
it("update vailed no data", async () => {
  const newUser = await supertest(web)
    .patch("/api/users/current")
    .set("Authorization", "test")
    .send({
      password: "",
      name: "",
    });

  expect(newUser.status).toBe(400);
  expect(newUser.body.errors).toBeDefined();
  console.log(newUser.body.errors);
  // expect(newUser.body.data.name).toBe("kuntuludin");
  // expect(newUser.body.data.username).toBe("test");
});

it("update vailed no authorixation", async () => {
  const newUser = await supertest(web)
    .patch("/api/users/current")
    .set("Authorization", "salah")
    .send({
      password: "",
      name: "",
    });

  expect(newUser.status).toBe(401);
  expect(newUser.body.errors).toBeDefined();
  console.log(newUser.body.errors);
  // expect(newUser.body.data.name).toBe("kuntuludin");
  // expect(newUser.body.data.username).toBe("test");
});
