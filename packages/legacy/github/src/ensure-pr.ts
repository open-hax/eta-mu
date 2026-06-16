import {
  createGitHubClient,
  createPullRequest,
  fetchBranchCommits,
  inferPRTitle,
  listBranchesWithoutPRs,
  parseRepoSlug,
} from "./github.js";
import type { RepoSlug } from "./types.js";

export interface EnsurePROptions {
  readonly repo: RepoSlug;
  readonly base: string;
  readonly token: string;
  readonly branchPatterns: readonly string[];
  readonly dryRun: boolean;
}

export interface EnsurePRResult {
  readonly created: readonly { branch: string; prNumber: number; url: string }[];
  readonly skipped: readonly string[];
  readonly errors: readonly { branch: string; error: string }[];
}

const defaultBranchPatterns = [
  "fix/*",
  "feat/*",
  "chore/*",
  "docs/*",
  "refactor/*",
  "test/*",
  "perf/*",
];

const buildPRBody = (branch: string, commits: readonly string[]): string => {
  const lines = [
    `Automated pull request for branch \`${branch}\`.`,
    "",
    "### Commits",
    ...commits.map((commit) => `- ${commit}`),
    "",
    "_This PR was created automatically by eta-mu automation._",
  ];
  return lines.join("\n");
};

export const ensurePRs = async (options: EnsurePROptions): Promise<EnsurePRResult> => {
  const octokit = createGitHubClient(options.token);
  const branches = await listBranchesWithoutPRs(
    octokit,
    options.repo,
    options.base,
    options.branchPatterns.length > 0 ? options.branchPatterns : defaultBranchPatterns,
  );

  const created: { branch: string; prNumber: number; url: string }[] = [];
  const skipped: string[] = [];
  const errors: { branch: string; error: string }[] = [];

  for (const branch of branches) {
    try {
      if (options.dryRun) {
        skipped.push(branch.name);
        continue;
      }

      const commits = await fetchBranchCommits(octokit, options.repo, branch.name, options.base);
      const title = inferPRTitle(branch.name);
      const body = buildPRBody(branch.name, commits);

      const pr = await createPullRequest(octokit, options.repo, branch.name, options.base, title, body);
      created.push({ branch: branch.name, prNumber: pr.number, url: pr.url });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ branch: branch.name, error: message });
    }
  }

  return { created, skipped, errors };
};
