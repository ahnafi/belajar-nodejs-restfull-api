import joi from "joi";

const createContactValidation = joi.object({
  firstName: joi.string().max(100).required(),
  lastName: joi.string().max(100).optional(),
  email: joi.string().max(100).email().optional(),
  phone: joi.string().max(20).optional(),
});

const getContactValidation = joi.number().positive().required();

const updateContactValidation = joi.object({
  id: joi.number().positive().required(),
  firstName: joi.string().max(100).required(),
  lastName: joi.string().max(100).optional(),
  email: joi.string().max(100).email().optional(),
  phone: joi.string().max(20).optional(),
});

export {
  createContactValidation,
  getContactValidation,
  updateContactValidation,
};
