import { prisma } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createContactValidation,
  getContactValidation,
  searchContactValidation,
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

const remove = async (username, contactId) => {
  contactId = MyValidate(getContactValidation, contactId);

  const count = await prisma.contact.count({
    where: {
      username: username,
      id: contactId,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "Contact not found");
  }

  return prisma.contact.delete({
    where: {
      id: contactId,
    },
  });
};

const search = async (username, request) => {
  request = MyValidate(searchContactValidation, request);

  const skip = (request.page - 1) * request.size;

  const filters = [];

  filters.push({ username });

  if (request.name)
    filters.push({
      OR: [
        {
          firstName: {
            contains: request.name,
          },
        },
        {
          lastName: {
            contains: request.name,
          },
        },
      ],
    });
  if (request.email) filters.push({ email: { contains: request.email } });
  if (request.phone) filters.push({ phone: { contains: request.phone } });

  const contact = await prisma.contact.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  const count = await prisma.contact.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: contact,
    paging: {
      page: request.page,
      total_item: count,
      total_page: Math.ceil(count / request.size),
    },
  };
};

export default {
  create,
  remove,
  get,
  update,
  search,
};
