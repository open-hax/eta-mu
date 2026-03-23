---
name: resume-ats-optimize
description: Turn audit findings into ATS-clean resume variants by simplifying parser-hostile formatting, standardizing section labels, improving quantification, and preserving truthfulness.
---

# Skill: Resume ATS Optimize

## Goal
Create ATS-clean resume variants from existing sources using audit-backed fixes that improve parseability and keyword signaling without inventing experience.

## Use This Skill When
- An OSS ATS audit has already identified parser failures.
- The user wants resume optimization grounded in evidence, not generic advice.
- You need to create `-ats` variants from existing resume sources.
- You need to separate ATS-clean outputs from fnord / AI-signal outputs.

## Do Not Use This Skill When
- The user asks for hidden prompts, invisible text, or deceptive footer tricks.
- The user wants to add unverified keywords or fabricated metrics.
- The user only wants style changes with no ATS concern.

## Inputs
- Existing resume source files (`.md`, `.tex`, `.pdf`)
- Prior audit report, if available
- Target role/JD if optimizing for a specific application

## Default Fixes
- Remove fnord footer from ATS variants.
- Prefer a single-column layout.
- Replace parser-hostile decorative glyphs where practical.
- Standardize headings to ATS-recognizable labels.
- Fold open-source roles into recognizable experience sections when helpful.
- Add verified numbers already present in source material or READMEs.
- Prefer explicit contact labeling (`Contact:` or clearly isolated contact line) when a toolset misses contact blocks.
- Prefer plain ASCII-safe separators and bullet markers where the PDF toolchain allows it.

## Steps
1. Read the latest audit findings first.
2. Choose the base document and produce a new `-ats` variant rather than overwriting legacy files.
3. Remove AI-signal/footer content from the ATS variant.
4. Standardize section labels (for example: `Professional Summary`, `Work Experience`, `Skills`).
5. Normalize high-value role entries so OSS work is recognized as experience if needed.
6. Replace vague bullets with quantified bullets **only when numbers are verified**.
7. Prefer metrics that came from audited repo docs (for example provider counts, stage counts, architecture counts) over impressionistic adjectives.
8. Compile PDF and rerun at least one parser sanity check if possible.
9. Record what changed and which parser issue each change was meant to address.

## Output
- `<base>-ats.md`
- `<base>-ats.tex`
- `<base>-ats.pdf`
- a short change log tied to parser/audit findings

## References
- `resume-oss-ats-audit`
- `resume-fnord-ats`
