import { prisma } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createContactValidation,
  getContactValidation,
  updateContactValidation,
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

const update = async (username, request) => {
  const contact = MyValidate(updateContactValidation, request);

  const count = await prisma.contact.count({
    where: {
      id: contact.id,
      username: username,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "Contact Not found");
  }

  return prisma.contact.update({
    where: {
      id: contact.id,
    },
    data: {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  });
};

export default {
  create,
  get,
  update,
};
