import { removeTestUser } from "./utils.test.js";
import supertest from "supertest";
import { web } from "../src/app/web.js";
import { prisma } from "../src/app/database.js";

afterEach(async () => {
  await removeTestUser();
});

test("should can register new user", async () => {
  const result = await supertest(web)
    .post("/api/users")
    .set("Accept", "application/json")
    .send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

  // expect(result.status).toBe(200);
  // expect(result.body.data.username).toBe("test");
  // expect(result.body.data.name).toBe("test");
  // expect(result.body.data.password).toBeUndefined();
});
