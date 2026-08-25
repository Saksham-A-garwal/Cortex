const { z } = require("zod");

const objectId = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Must be a 24-character hexadecimal id.");

const email = z.string().trim().toLowerCase().pipe(z.email("Must be a valid email address."));

const otpRequestSchema = z.object({ email });

const otpVerifySchema = z.object({
  email,
  code: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Enter the 6-digit code from your email."),
});

const sendMessageSchema = z.object({
  content: z.string().trim().min(1, "Message content is required.").max(20000),
  chatId: objectId.optional(),
});

const chatIdParamSchema = z.object({ chatId: objectId });
const idParamSchema = z.object({ id: objectId });

module.exports = {
  objectId,
  otpRequestSchema,
  otpVerifySchema,
  sendMessageSchema,
  chatIdParamSchema,
  idParamSchema,
};
