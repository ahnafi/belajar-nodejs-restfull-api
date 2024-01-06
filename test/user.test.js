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
    expect(result.body.error).toBeDefined();
    logger.info(result.body.error);
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

    expect(result.status).toBe(200)
    expect(result.body.data.token).toBeDefined();
    // logger.error(result)
  });
});
