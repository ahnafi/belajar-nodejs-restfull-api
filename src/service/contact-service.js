import { prisma } from "../app/database.js";
import { createContactValidation } from "../validation/contact-validation.js";
import { MyValidate } from "../validation/validation.js";

const create = async (username, request) => {
  //
  const contact = MyValidate(createContactValidation, request);
  contact.username = username;

  //
  return prisma.contact.create({
    data: contact,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  });
};

export default {
  create,
};
