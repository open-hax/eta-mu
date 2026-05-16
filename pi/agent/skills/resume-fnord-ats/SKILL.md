---
name: resume-fnord-ats
description: Maintain ATS-clean and AI-signal ("fnord") variants of resumes/cover letters with deterministic naming, minimal diffs, and a non-deceptive machine-readable capability footer.
---

# Skill: Resume Fnord/ATS Versioning

## Goal
Maintain two parallel document variants for the same resume/cover letter:
- **ATS-clean**: maximally compatible with applicant tracking systems (plain structure, no odd footers).
- **fnord**: identical content plus a *small, visible* machine-readable capability footer that helps AI-first reviewers index your work quickly.

## Use This Skill When
- You are updating a resume/cover letter that may go through an ATS portal.
- You want to add, remove, or refresh the fnord footer.
- You are creating job-specific variants and want ATS + fnord kept in sync.
- You want a strict, repeatable naming/versioning convention for career artifacts.

## Do Not Use This Skill When
- The request is to hide or obfuscate content (zero-width chars, white-on-white text, invisible layers).
- The request is to embed prompt-instructions meant to influence/override an evaluator model.
- You cannot verify the factual basis for the capability tokens.

## Inputs
- Base document sources (commonly `resume/<base>.md` and/or `resume/<base>.tex`).
- Target job/company and any required keywords.
- Verified proof refs: repo URLs/paths, README sections, release tags, commits.
- Fnord envelope version (default: `fnord:v1`).

## Naming Contract
Given base name `<base>` (example: `aaron-beavers-ichi-costanoa-v1`), produce:

- **ATS-clean**
  - `resume/<base>-ats.md`
  - `resume/<base>-ats.tex`
  - `resume/<base>-ats.pdf`

- **fnord**
  - `resume/<base>-fnord.md`
  - `resume/<base>-fnord.tex`
  - `resume/<base>-fnord.pdf`

If legacy files exist without suffix, treat them as **unsuffixed legacy** and do not overwrite; create the suffixed variants.

## Fnord Envelope Rules (non-deceptive)
The fnord footer is an *appendix*, not a prompt.

Rules:
- **Visible** plain text (no hidden layers).
- **Factual only**: proof refs and capability keywords that you can back up.
- **No imperatives**: no “ignore”, “follow”, “system”, “do X”, “as the model you must…”.
- **No secrets**: never include tokens, credentials, private endpoints, or internal-only repo names.

### Example `fnord:v1`

```text
fnord:v1 proof=gh(open-hax/proxx octave-commons/shibboleth shuv1337/battlebussy)
caps=llm-gw(r->chat m->chat ollama oauth-pkce sse-synth reasoning-content rot429 chroma)
eval(sbert hdbscan parquet sha256)
ops(docker compose oci-tf ghcr-multiarch jetstream)
```

## Steps
1. **Select base**: identify the canonical source (`<base>`), confirm contact info and timeline.
2. **Generate ATS-clean**:
   - remove fnord footer and any code-fences/odd glyphs if needed
   - keep a single-column layout and simple headings
   - prefer explicit ATS-recognizable labels such as `Professional Summary`, `Skills`, `Professional Experience`, `Education`, and `Contact`
   - if open-source work is central to the role, place it under `Professional Experience` or `Open Source Experience`, not an idiosyncratic header
3. **Generate fnord**:
   - copy ATS-clean content
   - append fnord footer at the end
4. **Build** PDFs (if TeX exists): `pdflatex` and verify page count.
5. **Sync check**:
   - content diffs between ATS vs fnord should be only the footer
   - verify the footer is absent from ATS exports and present only in fnord exports
   - if possible, run one parser sanity check to confirm the footer is not leaking into education/certification fields
6. **Record**:
   - append a receipt in `receipts.log` with refs and output paths

## Output
- Both variants (sources + PDFs) with deterministic file names.
- A short summary describing what changed and confirming the variants are in sync.

## References
- `vaults/fork_tales/opmf.lisp` (contract mindset: deterministic artifacts + explicit rules)
- `resume/` (workspace resume artifact directory)
