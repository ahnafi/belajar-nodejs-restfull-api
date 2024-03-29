import { prisma } from "../src/app/database.js";
import bcrypt from "bcrypt";

test('should test', () => {
  // console.log("test ready")
});

export const removeTestUser = async () => {
  console.log("============================");
  await prisma.user.deleteMany({
    where: {
      username: "test",
    },
  });
};

export const createTestUser = async () => {
  console.log("============================");

  await prisma.user.create({
    data: {
      username: "test",
      password: await bcrypt.hash("rahasia", 10),
      name: "test",
      token: "test",
    },
  });
};

export const getTestUser = async () => {
  console.log("============================");

  return prisma.user.findUnique({
    where: {
      username: "test",
    },
  });
};

export const removeAllTestContacts = async () => {
  await prisma.contact.deleteMany({
    where: {
      username: "test",
    },
  });
};

export const createTestContact = async () => {
  await prisma.contact.create({
    data: {
      username: "test",
      firstName: "test",
      lastName: "test",
      email: "test@pzn.com",
      phone: "080900000",
    },
  });
};

export const createManyTestContacts = async () => {
  for (let i = 0; i < 15; i++) {
    await prisma.contact.create({
      data: {
        username: `test`,
        firstName: `test ${i}`,
        lastName: `test ${i}`,
        email: `test${i}@pzn.com`,
        phone: `080900000${i}`,
      },
    });
  }
};

export const getTestContact = async () => {
  return prisma.contact.findFirst({
    where: {
      username: "test",
    },
  });
};

export const removeAllTestAddresses = async () => {
  await prisma.address.deleteMany({
    where: {
      contact: {
        username: "test",
      },
    },
  });
};

export const createTestAddress = async () => {
  const contact = await getTestContact();
  await prisma.address.create({
    data: {
      contact_id: contact.id,
      street: "jalan test",
      city: "kota test",
      province: "provinsi test",
      country: "indonesia",
      postalCode: "234234",
    },
  });
};

export const getTestAddress = async () => {
  return prisma.address.findFirst({
    where: {
      contact: {
        username: "test",
      },
    },
  });
};
