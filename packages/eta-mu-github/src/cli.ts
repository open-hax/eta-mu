#!/usr/bin/env node
import "dotenv/config";
import { loadConfig } from "./config.js";
import { classifyGithubEvent } from "./event-classifier.js";
import {
  createGitHubClient,
  createIssueComment,
  fetchEventContext,
  formatReviewGateOutput,
  parseRepoSlug,
  publishCheckRun,
  upsertStickyComment,
} from "./github.js";
import { runAutofixForEvent } from "./autofix.js";
import { runEtaMuPrompt } from "./pi-agent.js";
import { findTrackedUnresolvedThreads } from "./review-gate.js";
import type { AutofixResult, EtaMuAgentDecision } from "./types.js";
import { readFile } from "node:fs/promises";

const usage = `eta-mu commands:
  eta-mu review-gate --repo owner/repo --pr 123 [--publish-check] [--check-name eta-mu-review-gate] [--head-sha <sha>]
  eta-mu classify-event --repo owner/repo --event-name issue_comment --event-path /tmp/event.json
  eta-mu run-event --repo owner/repo --event-name issue_comment --event-path /tmp/event.json --cwd /checkout/path [--dry-run]`;

const requireArg = (name: string, value: string | undefined): string => {
  if (!value) throw new Error(`Missing required argument ${name}`);
  return value;
};

const getArg = (args: readonly string[], flag: string): string | undefined => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};

const hasFlag = (args: readonly string[], flag: string): boolean => args.includes(flag);

const readJson = async (path: string): Promise<Record<string, unknown>> => JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;

const parseDecision = (value: string): EtaMuAgentDecision => {
  const parsed = JSON.parse(value) as Partial<EtaMuAgentDecision>;
  if (parsed.shouldRespond !== true) {
    return { shouldRespond: false, mode: "noop", body: "" };
  }
  if ((parsed.mode !== "reply" && parsed.mode !== "upsert-state" && parsed.mode !== "autofix") || typeof parsed.body !== "string") {
    throw new Error(`Invalid eta-mu response payload: ${value}`);
  }
  return { shouldRespond: true, mode: parsed.mode, body: parsed.body };
};

const buildSystemPrompt = (): string => [
  "You are eta-mu, an elite GitHub coordination bot built on pi.",
  "You collaborate with humans, CodeRabbit, Codex-like review agents, and other automated reviewers.",
  "Never invent repository facts.",
  "Prefer concise markdown when speaking to humans.",
  "Return JSON only with shape {\"shouldRespond\":boolean,\"mode\":\"reply\"|\"upsert-state\"|\"autofix\"|\"noop\",\"body\":string}.",
  "Use mode=reply for a direct human-facing comment.",
  "Use mode=upsert-state for a sticky status comment that should replace eta-mu's prior state note.",
  "Use mode=autofix only when the current PR should be changed automatically; in that mode body must be a terse implementation brief for the fixer, not a user-facing comment.",
  "Use mode=noop when eta-mu should remain silent.",
].join("\n");

const buildPrompt = (context: string): string => `${context}\n\nReturn JSON only.`;

const formatAutofixComment = (result: AutofixResult): string => {
  const lines = ["## eta-mu autofix", "", `- status: ${result.pushed ? "pushed" : result.applied ? "applied" : "no-change"}`, `- reason: ${result.reason}`];
  if (result.commitSha) lines.push(`- commit: \`${result.commitSha}\``);
  if (result.changedFiles.length > 0) lines.push(`- changed files: ${result.changedFiles.map((file) => `\`${file}\``).join(", ")}`);
  if (result.summary) lines.push("", "<details><summary>eta-mu summary</summary>", "", result.summary, "", "</details>");
  return lines.join("\n");
};

const command = process.argv[2];
const args = process.argv.slice(3);

const main = async (): Promise<void> => {
  const config = loadConfig();
  if (!command) throw new Error(usage);

  if (command === "review-gate") {
    const repo = parseRepoSlug(requireArg("--repo", getArg(args, "--repo")));
    const pr = Number.parseInt(requireArg("--pr", getArg(args, "--pr")), 10);
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN or GH_TOKEN is required");
    const octokit = createGitHubClient(token);
    const context = await fetchEventContext(octokit, repo, {
      trigger: "pr-activity",
      shouldRun: true,
      reason: "review gate",
      pullRequestNumber: pr,
      issueNumber: pr,
      debounceKey: `${repo.owner}/${repo.name}:pr:${pr}`,
    }, {});
    const result = findTrackedUnresolvedThreads(context.unresolvedReviewThreads ?? [], config.reviewActors);
    const output = formatReviewGateOutput(result);
    const checkName = getArg(args, "--check-name") ?? config.reviewCheckName;
    const headSha = getArg(args, "--head-sha") ?? context.pullRequestHead?.sha;

    console.log(JSON.stringify({
      repo: `${repo.owner}/${repo.name}`,
      pullRequestNumber: pr,
      trackedActors: result.trackedActors,
      unresolvedThreads: result.unresolvedThreads.length,
      reviewCheckName: checkName,
    }, null, 2));

    if (hasFlag(args, "--publish-check")) {
      if (!headSha) throw new Error("--publish-check requires a head SHA (pass --head-sha or run on a PR event)");
      await publishCheckRun(octokit, repo, headSha, checkName, output);
    }

    if (result.unresolvedThreads.length > 0) {
      throw new Error(`Unresolved tracked review threads: ${result.unresolvedThreads.length}`);
    }
    return;
  }

  if (command === "classify-event") {
    const repo = requireArg("--repo", getArg(args, "--repo"));
    const eventName = requireArg("--event-name", getArg(args, "--event-name"));
    const eventPath = requireArg("--event-path", getArg(args, "--event-path"));
    const payload = await readJson(eventPath);
    const classification = classifyGithubEvent(eventName, payload, config, repo);
    console.log(JSON.stringify(classification, null, 2));
    return;
  }

  if (command === "run-event") {
    const repo = parseRepoSlug(requireArg("--repo", getArg(args, "--repo")));
    const eventName = requireArg("--event-name", getArg(args, "--event-name"));
    const eventPath = requireArg("--event-path", getArg(args, "--event-path"));
    const cwd = requireArg("--cwd", getArg(args, "--cwd"));
    const payload = await readJson(eventPath);
    const classification = classifyGithubEvent(eventName, payload, config, `${repo.owner}/${repo.name}`);
    console.log(JSON.stringify({ phase: "classify", classification }, null, 2));
    if (!classification.shouldRun) return;
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN or GH_TOKEN is required");
    const octokit = createGitHubClient(token);
    const context = await fetchEventContext(octokit, repo, classification, payload);
    const decisionJson = await runEtaMuPrompt(
      cwd,
      buildSystemPrompt(),
      buildPrompt(JSON.stringify({ classification, context }, null, 2)),
      config.modelProvider,
      config.modelId,
    );
    const decision = parseDecision(decisionJson);
    console.log(JSON.stringify({ phase: "decide", decision }, null, 2));
    if (!decision.shouldRespond || hasFlag(args, "--dry-run")) return;
    const targetIssue = context.issueNumber ?? context.pullRequestNumber;
    if (!targetIssue) {
      throw new Error("No issue or pull request number available for commenting");
    }
    if (decision.mode === "upsert-state") {
      await upsertStickyComment(octokit, repo, targetIssue, config.stateCommentMarker, decision.body);
      return;
    }
    if (decision.mode === "autofix") {
      const result = await runAutofixForEvent(repo, context, decision.body, config, token);
      await upsertStickyComment(octokit, repo, targetIssue, config.autofixCommentMarker, formatAutofixComment(result));
      return;
    }
    await createIssueComment(octokit, repo, targetIssue, decision.body);
    return;
  }

  throw new Error(usage);
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
