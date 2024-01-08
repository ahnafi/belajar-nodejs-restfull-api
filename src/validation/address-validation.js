import joi from "joi";

const createAddressValidation = joi.object({
  street: joi.string().max(255).optional(),
  city: joi.string().max(100).optional(),
  province: joi.string().max(100).optional(),
  country: joi.string().max(100).required(),
  postalCode: joi.string().max(10).required(),
});

const getAddressValidation = joi.number().positive().required();

export { createAddressValidation, getAddressValidation };
