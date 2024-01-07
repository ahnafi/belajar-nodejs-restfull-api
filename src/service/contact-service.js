import { prisma } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createContactValidation,
  getContactValidation,
} from "../validation/contact-validation.js";
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

const get = async (username, contactId) => {
  //
  contactId = MyValidate(getContactValidation, contactId);
  //
  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      username: username,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact Not found");
  }

  return contact;
};

export default {
  create,
  get,
};
