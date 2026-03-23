---
name: resume-oss-ats-audit
description: Audit resumes with runnable open-source ATS, parser, and resume-optimization tools; distinguish real parser signal from demo hype and produce a reproducible findings report.
---

# Skill: Resume OSS ATS Audit

## Goal
Run a reproducible, evidence-based audit of resume PDFs using practical open-source ATS/parsing/optimization tools, then summarize which findings are structural, parser-specific, or target-job-specific.

## Use This Skill When
- The user wants an ATS/resume audit using open-source tools.
- The user asks for exhaustive or broad resume analysis.
- You need to test whether a resume layout survives multiple parsers.
- You want to measure the impact of optional footers or formatting choices.

## Do Not Use This Skill When
- The request is only to tailor one resume to one JD without broad audit.
- The user wants advice only and does not need tool-backed evidence.
- The available tools are entirely cloud/proprietary and can’t be reproduced locally.

## Inputs
- Current resume PDFs in `resume/`
- Optional job descriptions for targeted comparisons
- Local toolchain availability (`python3`, `pip3`, `pdftotext`, `pdfinfo`, `git`)

## Audit Axes
1. Structural ATS compatibility (page count, text extraction, headings)
2. Parser interoperability (multiple parsers agree/disagree)
3. JD alignment (targeted overlap for specific roles)
4. Footer contamination (e.g. fnord/no-fnord shadow comparison)
5. Metadata readiness (RMS/XMP or similar structured metadata)
6. Extractor variance (`pdftotext` vs `pypdf` vs `pdfplumber`) so parser breakage is not over-attributed to resume content

## Steps
1. Inventory current PDFs.
2. Create a temporary venv for audit tools.
3. Install only tools that are runnable or near-runnable; record breakage explicitly.
4. Run baseline extractors (`pdftotext`, `pdfinfo`).
5. Run multiple OSS parsers and save raw outputs.
6. Run keyword/section matchers in both baseline and target-specific modes.
7. If footers or unusual elements exist, build analysis-only shadow PDFs with those removed and compare results.
8. Compare multiple text extractors when parser outputs conflict.
9. Check for machine-readable PDF metadata where relevant.
10. Write a report separating:
   - runnable tools
   - broken/demo-only tools
   - cross-parser truths
   - parser-specific false positives/false negatives
11. Save all outputs under `resume/analysis/` and `resume/analysis/tmp/`.

## Output
- `resume/analysis/<date>-*.md` report
- machine-readable raw tool outputs in `resume/analysis/tmp/`
- ranked recommendations with confidence levels

## References
- `resume-fnord-ats` skill for ATS-vs-fnord variant management
- `resume/analysis/` for prior audits
