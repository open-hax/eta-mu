---
name: resume-processing-workbench
description: Build and use a local resume-processing workbench that ingests resumes and job descriptions, runs parser/score pipelines, and emits reproducible fit/improvement reports.
---

# Skill: Resume Processing Workbench

## Goal
Create or operate a local CLI/workbench that analyzes resumes and optional job descriptions using reproducible parser, scoring, and reporting steps.

## Use This Skill When
- The user wants a real artifact for resume analysis rather than one-off advice.
- You want a pipeline that can be rerun on many resume variants.
- You want a project worth citing as a resume-processing system.

## Do Not Use This Skill When
- The task is only to edit a single bullet point.
- There is no need for reusable tooling.
- The proposed system depends entirely on external closed APIs.

## Inputs
- Resume PDFs and/or source documents
- Optional job description files
- Existing parser audit outputs if available
- Local tool/runtime availability

## Core Pipeline
1. Inventory resume and JD inputs.
2. Extract text and structural metadata.
3. Run a parser ensemble where available.
4. Compute lexical scoring and overlap signals.
5. Optionally compute dense similarity if a local embedding backend exists.
6. Fuse signals into an explainable scorecard.
7. Emit JSON + Markdown reports with provenance.

## Design Rules
- Every score should be explainable.
- Preserve raw parser outputs; do not collapse everything into one magic number.
- Prefer graceful degradation: lexical-only mode should still work if embeddings are offline.
- Keep artifact claims factual: say "resume-processing workbench" or "resume/JD analysis pipeline" unless training/inference depth truly justifies stronger language.

## Output
- runnable CLI/workbench files
- reproducible JSON/Markdown outputs
- a sample analysis run against current resumes
