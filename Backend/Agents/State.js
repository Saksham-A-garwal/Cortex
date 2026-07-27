const { Annotation } = require("@langchain/langgraph");

const StateAnnotation = Annotation.Root({
  // The array of LangChain message objects
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),

  // The decision made by the Router (e.g., "coding", "search", "general")
  routeDecision: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "general",
  }),

  userId: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
});

module.exports = { StateAnnotation };
