import { prisma } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createAddressValidation,
  getAddressValidation,
} from "../validation/address-validation.js";
import { getContactValidation } from "../validation/contact-validation.js";
import { MyValidate } from "../validation/validation.js";

const checkContactMustExists = async (username, contactId) => {
  contactId = MyValidate(getContactValidation, contactId);

  const totalContactInDatabase = await prisma.contact.count({
    where: {
      username: username,
      id: contactId,
    },
  });

  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, "contact is not found");
  }

  return contactId;
};

const create = async (username, contactId, request) => {
  contactId = await checkContactMustExists(username, contactId);

  const address = MyValidate(createAddressValidation, request);
  address.contact_id = contactId;

  return prisma.address.create({
    data: address,
    select: {
      id: true,
      city: true,
      country: true,
      postalCode: true,
      street: true,
      province: true,
    },
  });
};

const get = async (username, contactId, addressId) => {
  contactId = await checkContactMustExists(username, contactId);
  addressId = MyValidate(getAddressValidation, addressId);

  const address = await prisma.address.findFirst({
    where: { id: addressId, contact_id: contactId },
    select: {
      id: true,
      city: true,
      country: true,
      postalCode: true,
      street: true,
      province: true,
    },
  });

  if (!address) {
    throw new ResponseError(404, "Address is not found");
  }

  return address;
};

export default { create, get };
