import supertest from "supertest";
import {
  createTestContact,
  createTestUser,
  removeAllTestContacts,
  removeTestUser,
} from "./utils.test.js";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";

describe("create contact post /api/contacts", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can create new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        firstName: "test",
        lastName: "test",
        email: "test@pzn.com",
        phone: "08090000000",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.firstName).toBe("test");
    expect(result.body.data.lastName).toBe("test");
    expect(result.body.data.email).toBe("test@pzn.com");
    expect(result.body.data.phone).toBe("08090000000");
  });

  it('should reject if request is not valid', async () => {
    const result = await supertest(web)
        .post("/api/contacts")
        .set('Authorization', 'test')
        .send({
            first_name: "",
            last_name: "test",
            email: "test",
            phone: "0809000000043534534543534534543535345435435"
        });

        logger.error(result.error)
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
});
  //
});
