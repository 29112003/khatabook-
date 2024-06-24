const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose schema
const hisaabSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    encrypted: {
      type: Boolean,
      default: false,
    },
    shareable: {
      type: Boolean,
      default: false,
    },
    passcode: {
      type: Number,
      default: null,
    },
    editPermission: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Hisaab = mongoose.model("Hisaab", hisaabSchema);

// Joi validation schema
const validateHisaab = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    user: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // ObjectId validation
    encrypted: Joi.boolean(),
    shareable: Joi.boolean(),
    passcode: Joi.number().allow(null),
    editPermission: Joi.boolean(),
  });

  return schema.validate(data);
};

module.exports = {
  HisaabModel,
  hisaabModelValidator,
};
