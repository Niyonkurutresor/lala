import Joi from "joi";

const create = Joi.object({
  property_id: Joi.string().required(),
  name: Joi.string().required(),
  category: Joi.string().required(),
  icon: Joi.string().optional(),
});

const update = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  icon: Joi.string().optional(),
});

export default { create, update };
