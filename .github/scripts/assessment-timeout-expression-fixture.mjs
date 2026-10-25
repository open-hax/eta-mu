// SPDX-License-Identifier: GPL-3.0-or-later
// Test-only use of GitHub's evaluator. Runtime workflow policy stays in YAML.
import assert from "node:assert/strict";
import { Evaluator, Lexer, Parser, data } from "@actions/expressions";

export function evaluateTimeout(expression, requested) {
  assert.ok(expression.startsWith("${{") && expression.endsWith("}}"));
  const input = new data.Dictionary();
  if (requested !== undefined) input.add("review_timeout_minutes",
    typeof requested === "number" ? new data.NumberData(requested) : new data.StringData(requested));
  const context = new data.Dictionary({ key: "inputs", value: input });
  const ast = new Parser(new Lexer(expression.slice(3, -2).trim()).lex().tokens, ["inputs"], []).parse();
  return new Evaluator(ast, context).evaluate().value;
}

export function assertNumericTimeout(workflow, requested, expected) {
  const model = workflow.jobs.assess.steps.find(step => step.id === "assess");
  const actual = evaluateTimeout(model["timeout-minutes"], requested);
  assert.equal(typeof actual, "number", `native model-step timeout for ${JSON.stringify(requested)} must evaluate to a number`);
  assert.ok(Number.isInteger(actual));
  assert.equal(actual, expected);
  return actual;
}
