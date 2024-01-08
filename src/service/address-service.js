import { prisma } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { createAddressValidation } from "../validation/address-validation.js";
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

export default { create };
