import supertest from "supertest";
import {
  createManyTestContacts,
  createTestContact,
  createTestUser,
  getTestContact,
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

  it("should reject if request is not valid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "test",
        email: "test",
        phone: "0809000000043534534543534534543535345435435",
      });

    logger.error(result.error);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  //
});

describe("get contact api /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("get contact success", async () => {
    const testContact = await getTestContact();
    //
    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id)
      .set("Authorization", "test");
    //

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.firstName).toBe(testContact.firstName);
    expect(result.body.data.lastName).toBe(testContact.lastName);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it("should return 404 if contact id is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
  //
});

describe("PUT /api/contacts/:contactId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can update existing contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        firstName: "Eko",
        lastName: "Khannedy",
        email: "eko@pzn.com",
        phone: "09999999",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.firstName).toBe("Eko");
    expect(result.body.data.lastName).toBe("Khannedy");
    expect(result.body.data.email).toBe("eko@pzn.com");
    expect(result.body.data.phone).toBe("09999999");
  });

  it("should reject if request is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        firstName: "",
        lastName: "",
        email: "eko",
        phone: "",
      });

    expect(result.status).toBe(400);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test")
      .send({
        firstName: "Eko",
        lastName: "Khannedy",
        email: "eko@pzn.com",
        phone: "09999999",
      });

    expect(result.status).toBe(404);
  });
});

describe("remove contact", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can remove existing contact", async () => {
    let testContact = await getTestContact();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    testContact = await getTestContact();

    expect(result.status).toBe(200);
    console.log(result.body);
  });

  it("id error", async () => {
    let testContact = await getTestContact();

    const result = await supertest(web)
      .delete("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test");

    testContact = await getTestContact();

    expect(result.status).toBe(404);
    logger.error(result.errors);
  });
  it("un authorized", async () => {
    let testContact = await getTestContact();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id)
      .set("Authorization", "konsol");

    testContact = await getTestContact();

    expect(result.status).toBe(401);
  });
});

describe('GET /api/contacts', function () {
  beforeEach(async () => {
      await createTestUser();
      await createManyTestContacts();
  })

  afterEach(async () => {
      await removeAllTestContacts();
      await removeTestUser();
  })

  it('should can search without parameter', async () => {
      const result = await supertest(web)
          .get('/api/contacts')
          .set('Authorization', 'test');

      expect(result.status).toBe(200);
      expect(result.body.data.length).toBe(10);
      expect(result.body.paging.page).toBe(1);
      expect(result.body.paging.total_page).toBe(2);
      expect(result.body.paging.total_item).toBe(15);
  });

  it('should can search to page 2', async () => {
      const result = await supertest(web)
          .get('/api/contacts')
          .query({
              page: 2
          })
          .set('Authorization', 'test');

      logger.info(result.body);

      expect(result.status).toBe(200);
      expect(result.body.data.length).toBe(5);
      expect(result.body.paging.page).toBe(2);
      expect(result.body.paging.total_page).toBe(2);
      expect(result.body.paging.total_item).toBe(15);
  });

  it('should can search using name', async () => {
      const result = await supertest(web)
          .get('/api/contacts')
          .query({
              name: "test 1"
          })
          .set('Authorization', 'test');

      logger.info(result.body);

      expect(result.status).toBe(200);
      expect(result.body.data.length).toBe(6);
      expect(result.body.paging.page).toBe(1);
      expect(result.body.paging.total_page).toBe(1);
      expect(result.body.paging.total_item).toBe(6);
  });

  it('should can search using email', async () => {
      const result = await supertest(web)
          .get('/api/contacts')
          .query({
              email: "test1"
          })
          .set('Authorization', 'test');

      logger.info(result.body);

      expect(result.status).toBe(200);
      expect(result.body.data.length).toBe(6);
      expect(result.body.paging.page).toBe(1);
      expect(result.body.paging.total_page).toBe(1);
      expect(result.body.paging.total_item).toBe(6);
  });

  it('should can search using phone', async () => {
      const result = await supertest(web)
          .get('/api/contacts')
          .query({
              phone: "0809000001"
          })
          .set('Authorization', 'test');

      logger.info(result.body);

      expect(result.status).toBe(200);
      expect(result.body.data.length).toBe(6);
      expect(result.body.paging.page).toBe(1);
      expect(result.body.paging.total_page).toBe(1);
      expect(result.body.paging.total_item).toBe(6);
  });
});