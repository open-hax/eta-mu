#!/usr/bin/env node
import "dotenv/config";
import { etaMuActionBatchSchema } from "@open-hax/eta-mu-runtime";
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
import {
  buildDraftActionBatch,
  buildPlanningContext,
  mapActionBatchToDecision,
  parseActionBatch,
  publishActionBatch,
} from "./runtime-batch.js";
import { findTrackedUnresolvedThreads, findAllUnresolvedThreads } from "./review-gate.js";
import { ensurePRs } from "./ensure-pr.js";
import type { AutofixResult, EtaMuAgentDecision } from "./types.js";
import { readFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const usage = `eta-mu commands:
  eta-mu review-gate --repo owner/repo --pr 123 [--publish-check] [--check-name eta-mu-review-gate] [--head-sha <sha>] [--strict]
  eta-mu classify-event --repo owner/repo --event-name issue_comment --event-path /tmp/event.json
  eta-mu run-event --repo owner/repo --event-name issue_comment --event-path /tmp/event.json --cwd /checkout/path [--dry-run]
  eta-mu ensure-pr --repo owner/repo --base staging [--pattern fix/*] [--pattern feat/*] [--dry-run]
  eta-mu auto-merge --repo owner/repo --pr 123
  eta-mu detect-packages --base <branch> [--workspace-glob packages/*/]
  eta-mu release --repo owner/repo --pr 123 [--tag-prefix v] [--create-release] [--publish-npm]`;

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

const buildSystemPrompt = (): string => [
  "You are eta-mu, an elite GitHub coordination bot built on pi.",
  "You collaborate with humans, CodeRabbit, Codex-like review agents, and other automated reviewers.",
  "Never invent repository facts.",
  "Prefer concise markdown and typed movement.",
  "Return JSON only with exact shape eta-mu-action-batch.v1.",
  "Keep kind fixed to eta-mu-action-batch.v1.",
  "Do not invent files, checks, users, or repository state that are not present in the prompt.",
  "Actions must use only these kinds: comment, summary, label, issue, patch-plan, patch, reroute, defer, request-evidence, request-human-attention, noop.",
  "Use patch only when the current PR should be autofixed automatically.",
  "Use summary when the main output should become a sticky state comment.",
  "If the deterministic draft is already correct, return it unchanged.",
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
    const result = hasFlag(args, "--strict")
      ? findAllUnresolvedThreads(context.unresolvedReviewThreads ?? [])
      : findTrackedUnresolvedThreads(context.unresolvedReviewThreads ?? [], config.reviewActors);
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
      const scope = hasFlag(args, "--strict") ? "all" : "tracked";
      throw new Error(`Unresolved ${scope} review threads: ${result.unresolvedThreads.length}`);
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
    const planningContext = buildPlanningContext(classification, context);
    const draftBatch = buildDraftActionBatch(classification, context);
    let actionBatch = draftBatch;

    try {
      const decisionJson = await runEtaMuPrompt(
        cwd,
        buildSystemPrompt(),
        buildPrompt(
          JSON.stringify(
            {
              classification,
              context,
              planningContext,
              draftActionBatch: draftBatch,
              schemaHint: etaMuActionBatchSchema.shape.kind.value,
            },
            null,
            2,
          ),
        ),
        config.modelProvider,
        config.modelId,
      );
      actionBatch = parseActionBatch(decisionJson, draftBatch);
    } catch (error) {
      console.warn(
        `eta-mu action-batch fallback: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const decision: EtaMuAgentDecision = mapActionBatchToDecision(actionBatch);
    console.log(JSON.stringify({ phase: "decide", actionBatch, decision }, null, 2));

    if (!hasFlag(args, "--dry-run")) {
      try {
        await publishActionBatch(config.controlPlaneUrl, {
          source: "eta-mu-github",
          issue_number: context.issueNumber,
          pull_request_number: context.pullRequestNumber,
          batch: actionBatch as unknown as Record<string, unknown>,
        });
      } catch (error) {
        console.warn(
          `eta-mu action-batch publish skipped: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

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

  if (command === "ensure-pr") {
    const repo = parseRepoSlug(requireArg("--repo", getArg(args, "--repo")));
    const base = getArg(args, "--base") ?? "staging";
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN or GH_TOKEN is required");
    const patterns: string[] = [];
    let index = args.indexOf("--pattern");
    while (index >= 0) {
      const pattern = args[index + 1];
      if (pattern) patterns.push(pattern);
      index = args.indexOf("--pattern", index + 1);
    }
    const result = await ensurePRs({
      repo,
      base,
      token,
      branchPatterns: patterns,
      dryRun: hasFlag(args, "--dry-run"),
    });
    console.log(JSON.stringify(result, null, 2));
    if (result.errors.length > 0) {
      throw new Error(`Failed to create PRs for ${result.errors.length} branch(es)`);
    }
    return;
  }

  if (command === "auto-merge") {
    const repo = parseRepoSlug(requireArg("--repo", getArg(args, "--repo")));
    const pr = Number.parseInt(requireArg("--pr", getArg(args, "--pr")), 10);
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN or GH_TOKEN is required");
    const octokit = createGitHubClient(token);

    const query = `
      query($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          pullRequest(number: $number) {
            id
            state
            autoMergeRequest {
              mergeMethod
            }
          }
        }
      }
    `;

    const response = await octokit.graphql(query, {
      owner: repo.owner,
      name: repo.name,
      number: pr,
    }) as {
      repository: {
        pullRequest: {
          id: string;
          state: string;
          autoMergeRequest?: { mergeMethod: string } | null;
        };
      };
    };

    const pullRequest = response.repository.pullRequest;
    if (pullRequest.state !== "OPEN") {
      console.log(JSON.stringify({ status: "skipped", reason: `PR state is ${pullRequest.state}` }, null, 2));
      return;
    }

    if (pullRequest.autoMergeRequest) {
      console.log(JSON.stringify({ status: "skipped", reason: "Auto-merge already enabled" }, null, 2));
      return;
    }

    const mutation = `
      mutation($pullRequestId: ID!, $mergeMethod: PullRequestMergeMethod!) {
        enablePullRequestAutoMerge(input: {
          pullRequestId: $pullRequestId,
          mergeMethod: $mergeMethod
        }) {
          pullRequest {
            id
            autoMergeRequest {
              mergeMethod
            }
          }
        }
      }
    `;

    const mergeMethod = (getArg(args, "--merge-method") ?? "SQUASH").toUpperCase() as "MERGE" | "SQUASH" | "REBASE";

    await octokit.graphql(mutation, {
      pullRequestId: pullRequest.id,
      mergeMethod,
    });

    console.log(JSON.stringify({ status: "enabled", pr, mergeMethod }, null, 2));
    return;
  }

  if (command === "detect-packages") {
    const base = requireArg("--base", getArg(args, "--base"));
    const workspaceGlob = getArg(args, "--workspace-glob") ?? "packages/*/";

    const changedFiles = execSync(`git diff --name-only origin/${base}...HEAD`, { encoding: "utf8" }).trim().split("\n").filter(Boolean);

    const workspaceDirs = execSync(`ls -d ${workspaceGlob}`, { encoding: "utf8", shell: true })
      .trim()
      .split("\n")
      .filter(Boolean);

    const changedPackages: { path: string; name: string }[] = [];

    for (const dir of workspaceDirs) {
      const pkgJsonPath = `${dir}/package.json`;
      if (!changedFiles.some((file) => file.startsWith(dir))) continue;

      let pkgName: string | undefined;
      try {
        const pkgJson = JSON.parse(await readFile(pkgJsonPath, "utf8")) as { name?: string };
        pkgName = pkgJson.name;
      } catch {
        continue;
      }

      changedPackages.push({ path: dir, name: pkgName ?? dir });
    }

    console.log(JSON.stringify({ changedPackages, changedFiles }, null, 2));
    return;
  }

  if (command === "release") {
    const repo = parseRepoSlug(requireArg("--repo", getArg(args, "--repo")));
    const pr = Number.parseInt(requireArg("--pr", getArg(args, "--pr")), 10);
    const tagPrefix = getArg(args, "--tag-prefix") ?? "v";
    const createRelease = hasFlag(args, "--create-release");
    const publishNpm = hasFlag(args, "--publish-npm");
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN or GH_TOKEN is required");

    const octokit = createGitHubClient(token);

    const pull = await octokit.rest.pulls.get({
      owner: repo.owner,
      repo: repo.name,
      pull_number: pr,
    });

    if (pull.data.state !== "closed" || !pull.data.merged) {
      throw new Error(`PR #${pr} must be merged to create a release`);
    }

    const tag = `${tagPrefix}${Date.now()}`;
    const sha = pull.data.merge_commit_sha ?? pull.data.head.sha;

    if (createRelease) {
      const release = await octokit.rest.repos.createRelease({
        owner: repo.owner,
        repo: repo.name,
        tag_name: tag,
        target_commitish: sha,
        name: `Release ${tag}`,
        body: `Automated release for PR #${pr}: ${pull.data.title}\n\n${pull.data.body ?? ""}`,
        draft: false,
        prerelease: false,
      });
      console.log(JSON.stringify({ releaseUrl: release.data.html_url, tag }, null, 2));
    }

    if (publishNpm) {
      console.log(JSON.stringify({ npmPublish: "npm publish not yet implemented - requires per-package detection" }, null, 2));
    }

    console.log(JSON.stringify({ tag, sha, pr, status: "released" }, null, 2));
    return;
  }

  throw new Error(usage);
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
