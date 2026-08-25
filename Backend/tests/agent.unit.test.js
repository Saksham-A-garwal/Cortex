const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MAX_TOOL_CALLS_PER_TURN,
  DEFAULT_ALLOWED_TOOLS,
  resolveAllowedTools,
  filterToolsByAllowlist,
  isOverToolBudget,
} = require("../Agents/guardrails");

const { isGreeting } = require("../Agents/Nodes/greetingNode");
const { routeFromEntry, shouldContinueToTools } = require("../Agents/graph");

test("FR-AGENT-05: a fresh turn is under budget", () => {
  assert.equal(isOverToolBudget(0), false);
  assert.equal(isOverToolBudget(0, 2), false);
});

test("FR-AGENT-05: the cap triggers exactly at the limit, not one past it", () => {
  assert.equal(isOverToolBudget(MAX_TOOL_CALLS_PER_TURN - 1, 1), false);
  assert.equal(isOverToolBudget(MAX_TOOL_CALLS_PER_TURN, 1), true);
});

test("FR-AGENT-05: a single oversized batch is caught, not just a slow drift", () => {
  assert.equal(isOverToolBudget(0, MAX_TOOL_CALLS_PER_TURN + 1), true);
});

test("FR-AGENT-05: no allowlist given falls back to the default set", () => {
  assert.deepEqual(resolveAllowedTools(null), DEFAULT_ALLOWED_TOOLS);
  assert.deepEqual(resolveAllowedTools([]), DEFAULT_ALLOWED_TOOLS);
});

test("FR-AGENT-05: an unknown tool name cannot be smuggled into the allowlist", () => {
  const resolved = resolveAllowedTools(["web_search", "execute_code", "rm_rf"]);
  assert.deepEqual(resolved, ["web_search"]);
});

test("FR-AGENT-05: filtering removes tools the session is not allowed", () => {
  const fakeTools = [
    { name: "web_search" },
    { name: "search_my_documents" },
    { name: "write_code" },
  ];
  const filtered = filterToolsByAllowlist(fakeTools, ["web_search"]);
  assert.deepEqual(filtered.map((t) => t.name), ["web_search"]);
});

test("FR-AGENT-04: greetings and pleasantries short-circuit", () => {
  for (const text of ["hi", "Hello!", "hey there", "thanks!", "good morning", "ok", "bye"]) {
    assert.equal(isGreeting(text), true, `expected a greeting: ${text}`);
  }
});

test("FR-AGENT-04: real questions do NOT short-circuit", () => {
  for (const text of [
    "what is the current node lts version?",
    "summarise my uploaded pdf",
    "write a function that reverses a string",
    "hello, can you search the web for the latest react release notes and compare them",
  ]) {
    assert.equal(isGreeting(text), false, `should not be a greeting: ${text}`);
  }
});

test("FR-AGENT-04: a fenced code block is never a greeting", () => {
  assert.equal(isGreeting("hi ```js\nconst x=1\n```"), false);
});

test("FR-AGENT-03: the loop ends when the model stops requesting tools", () => {
  const state = { messages: [{ content: "done" }] };
  assert.notEqual(shouldContinueToTools(state), "tools");
});

test("FR-AGENT-03: the loop continues while tool calls are pending", () => {
  const state = { messages: [{ content: "", tool_calls: [{ name: "web_search", id: "1" }] }] };
  assert.equal(shouldContinueToTools(state), "tools");
});

test("entry routing sends greetings to the cheap path and everything else to the agent", () => {
  assert.equal(routeFromEntry({ messages: [{ content: "hi" }] }), "greeting");
  assert.equal(routeFromEntry({ messages: [{ content: "search the web for node lts" }] }), "agent");
});
