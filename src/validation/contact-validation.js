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

const searchContactValidation = joi.object({
  page: joi.number().min(1).positive().default(1),
  size: joi.number().min(1).positive().max(100).default(10),
  name: joi.string().optional(),
  email: joi.string().optional(),
  phone: joi.string().optional(),
});

export {
  createContactValidation,
  getContactValidation,
  updateContactValidation,
  searchContactValidation,
};
