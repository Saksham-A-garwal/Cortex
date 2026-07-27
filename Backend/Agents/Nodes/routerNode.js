const { getAgentModel } = require("../modelConfig");
const { SystemMessage } = require("@langchain/core/messages");
const { z } = require("zod");
const { routerPrompt } = require("../Prompts/RouterAgent");

const routeSchema = z.object({
  decision: z.enum(["general", "coding", "search", "rag"]),
});

const buildRouterModel = (model) => model.withStructuredOutput(routeSchema, { method: "jsonMode" });

const routerNode = async (state) => {
  // Routing only needs the latest user message. Earlier assistant replies may
  // contain code blocks that distract a text-only classifier.
  const latestMessage = state.messages.at(-1);
  const latestContent = typeof latestMessage.content === "string"
    ? latestMessage.content
    : "";

  // Source code in a fenced block is unambiguously a coding request. Avoid an
  // unnecessary model call and ensure it never falls through to general chat.
  if (latestContent.includes("```")) {
    console.log("ðŸ”€ Router selected coding for a fenced code block");
    return { routeDecision: "coding" };
  }

  // Enforce an object response instead of parsing free-form model text.
  const model = getAgentModel("router");
  const routerModel = buildRouterModel(model);
  const messages = [new SystemMessage(routerPrompt), latestMessage];

  try {
    const { decision } = await routerModel.invoke(messages);

    console.log(`🔀 Router decided to send task to: ${decision}`);

    // Return the decision to update the graph's state!
    return { routeDecision: decision };
  } catch (error) {
    // Fallback just in case the AI hallucinates bad JSON
    console.error(
      "Router failed to output valid JSON. Defaulting to general.",
      error,
    );
    return { routeDecision: "general" };
  }
};

module.exports = { routerNode, routeSchema, buildRouterModel };
