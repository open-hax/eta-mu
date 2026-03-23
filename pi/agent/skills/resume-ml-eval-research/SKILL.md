---
name: resume-ml-eval-research
description: Research and synthesize credible ML techniques for resume and job-description evaluation, ranking, and improvement, with emphasis on local, explainable, reproducible methods.
---

# Skill: Resume ML Evaluation Research

## Goal
Turn vague "use AI/ML on resumes" ideas into a concrete, evidence-backed evaluation design that can be implemented locally and explained honestly.

## Use This Skill When
- The user wants research on ML techniques for resume evaluation or improvement.
- You need to choose between embeddings, rerankers, lexical scoring, or parser ensembles.
- You want to build a resume-processing artifact that is good enough to cite on a resume.

## Do Not Use This Skill When
- The request is only for formatting changes.
- The user wants hype, black-box claims, or fabricated model capabilities.
- You cannot verify the cited techniques or implementation path.

## Inputs
- Current resume corpus
- Optional job descriptions
- Existing ATS/parser audit outputs
- Local runtime constraints (Ollama, Python, Node, etc.)

## Research Checklist
1. Separate technique classes:
   - parser ensemble / information extraction
   - lexical scoring / coverage analysis
   - dense embedding similarity
   - hybrid retrieval (lexical + dense)
   - reranking / cross-encoders / learning-to-rank
   - explainability / provenance / bias checks
2. Prefer methods that can run locally or degrade gracefully.
3. Record tradeoffs explicitly:
   - accuracy vs latency
   - explainability vs sophistication
   - local reproducibility vs cloud dependence
4. Distinguish:
   - what is shippable now
   - what is a near-term extension
   - what is research-only for now
5. Turn research into an implementation architecture, not just a literature list.

## Output
- a short research synthesis
- a ranked technique stack for the current workspace
- explicit implementation recommendations
- risks/limits that prevent overclaiming

## Strong Default Recommendation
For local resume workbenches, start with:
1. parser ensemble
2. lexical keyword/section scoring
3. optional dense embedding similarity
4. hybrid fusion (for example RRF)
5. reranker/cross-encoder only after the previous layers work
