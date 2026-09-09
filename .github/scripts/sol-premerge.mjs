// SPDX-License-Identifier: GPL-3.0-or-later

const immutableSha = /^[0-9a-f]{40}$/;
export const environmentName = "sol-premerge";

export function assertCandidate(envelope, repository, branch, pullRequest) {
  const { number, headSha, workflowSha } = envelope;
  if (envelope.eventName !== "workflow_dispatch" || envelope.runAttempt !== 1 ||
      !Number.isSafeInteger(number) || number < 1 || !immutableSha.test(headSha) ||
      !immutableSha.test(workflowSha)) {
    throw new Error("A fresh workflow_dispatch with an explicit PR number and full head SHA is required.");
  }
  const expectedRef = `refs/heads/${repository.default_branch}`;
  if (repository.full_name !== "open-hax/eta-mu" || envelope.repository !== repository.full_name ||
      envelope.ref !== expectedRef || envelope.sha !== workflowSha || branch.commit.sha !== workflowSha ||
      envelope.workflowRef !== `${repository.full_name}/.github/workflows/sol-premerge.yml@${expectedRef}` ||
      branch.protected !== true) {
    throw new Error("Sol pre-merge machinery must come from the current protected default branch.");
  }
  if (pullRequest.number !== number || pullRequest.state !== "open" || pullRequest.merged === true ||
      pullRequest.head?.repo?.full_name !== repository.full_name ||
      pullRequest.base?.repo?.full_name !== repository.full_name ||
      pullRequest.base?.ref !== repository.default_branch || pullRequest.head?.sha !== headSha) {
    throw new Error("The open, same-repository pull request no longer matches the exact approved candidate.");
  }
}

export function assertEnvironment(environment, policies, defaultBranch) {
  const reviewers = environment.protection_rules?.find(rule => rule.type === "required_reviewers");
  if (environment.name !== environmentName || !Number.isSafeInteger(environment.id) ||
      environment.can_admins_bypass !== false || !reviewers?.reviewers?.length ||
      environment.deployment_branch_policy?.protected_branches !== false ||
      environment.deployment_branch_policy?.custom_branch_policies !== true ||
      policies.length !== 1 || policies[0].name !== defaultBranch || policies[0].type !== "branch") {
    throw new Error("sol-premerge requires disabled administrator bypass, a human reviewer, and exactly the default branch deployment policy.");
  }
}

export function assertHumanApproval(reviews, environmentId) {
  const relevant = reviews.filter(review => review.environments?.some(env => env.id === environmentId));
  if (!relevant.length || relevant.some(review => review.state === "rejected") ||
      !relevant.some(review => review.state === "approved" && review.user?.type === "User" &&
        typeof review.user.login === "string" && !review.user.login.endsWith("[bot]"))) {
    throw new Error("A human must approve this run's exact candidate; environment bypass is not approval.");
  }
}

export async function verifyPremerge({ github, context, core, env, requireApproval = false }) {
  const envelope = {
    eventName: context.eventName,
    repository: `${context.repo.owner}/${context.repo.repo}`,
    ref: context.ref,
    sha: context.sha,
    workflowRef: env.GITHUB_WORKFLOW_REF,
    workflowSha: env.GITHUB_WORKFLOW_SHA,
    runAttempt: Number(env.GITHUB_RUN_ATTEMPT),
    number: Number(env.SOL_PR_NUMBER),
    headSha: env.SOL_HEAD_SHA,
  };
  // Validate scalar inputs before placing them in API paths.
  if (!/^[1-9][0-9]*$/.test(env.SOL_PR_NUMBER ?? "") || !immutableSha.test(envelope.headSha)) {
    throw new Error("Invalid Sol candidate identity.");
  }
  const { data: repository } = await github.rest.repos.get(context.repo);
  const { data: branch } = await github.rest.repos.getBranch({ ...context.repo, branch: repository.default_branch });
  const { data: pullRequest } = await github.rest.pulls.get({ ...context.repo, pull_number: envelope.number });
  assertCandidate(envelope, repository, branch, pullRequest);
  const { data: environment } = await github.rest.repos.getEnvironment({
    ...context.repo, environment_name: environmentName,
  });
  const policies = await github.paginate(github.rest.repos.listDeploymentBranchPolicies, {
    ...context.repo, environment_name: environmentName, per_page: 100,
  });
  assertEnvironment(environment, policies, repository.default_branch);
  if (requireApproval) {
    const { data: reviews } = await github.request("GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals", {
      ...context.repo, run_id: context.runId,
    });
    assertHumanApproval(reviews, environment.id);
  }
  core.setOutput("head-sha", envelope.headSha);
  core.setOutput("pr-number", String(envelope.number));
  core.info(`Sol candidate ${repository.full_name}#${envelope.number}@${envelope.headSha}; machinery ${envelope.workflowSha}.`);
  return envelope;
}
