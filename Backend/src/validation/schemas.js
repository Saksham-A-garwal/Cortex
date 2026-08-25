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
  idempotencyKey: z.string().trim().min(8).max(100).optional(),
});

const chatIdParamSchema = z.object({ chatId: objectId });
const idParamSchema = z.object({ id: objectId });

const factId = z
  .string()
  .regex(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    "Must be a valid memory id.",
  );

const factIdParamSchema = z.object({ id: factId });
const updateMemorySchema = z.object({
  text: z.string().trim().min(1, "Memory text is required.").max(500),
});
const updateMemorySettingsSchema = z.object({ enabled: z.boolean() });

const connectorIdParamSchema = z.object({
  id: z.string().trim().min(1).max(50).regex(/^[a-z0-9-]+$/, "Must be a valid connector id."),
});

module.exports = {
  objectId,
  otpRequestSchema,
  otpVerifySchema,
  sendMessageSchema,
  chatIdParamSchema,
  idParamSchema,
  factIdParamSchema,
  updateMemorySchema,
  updateMemorySettingsSchema,
  connectorIdParamSchema,
};
