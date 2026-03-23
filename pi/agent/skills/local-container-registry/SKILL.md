---
name: local-container-registry
description: Run a local Docker registry (localhost:5000), publish reusable CUDA-capable ML base images, and stand up local ML services when container/runtime issues appear.
license: GPL-3.0
compatibility:
  pi: ">=0.58.0"
metadata:
  scope: system
  tags:
    - docker
    - registry
    - base-image
    - ml
    - cuda
    - open-hax
    - embeddings
---

# Skill: Local Container Registry

## Goal
Provide a **system-wide, reusable** workflow for:
- running a local registry at `localhost:5000`
- publishing baked **CUDA-capable ML base images**
- reusing those images across repos
- standing up local ML services when container/runtime issues appear

## Use This Skill When
- You need a reusable ML base image with torch/CUDA/sentence-transformers/etc.
- You hit container errors like `libcusparseLt.so.0`, torch import failures, or missing CUDA runtime libs.
- You want to stand up a local ML service such as embeddings inference or the Open Hax proxy/model gateway.
- Docker builds are repeatedly rebuilding heavy ML deps.
- A repo needs `FROM localhost:5000/...` for a cached ML runtime.

## Do Not Use This Skill When
- You only need a one-off tiny container with no ML runtime.
- You are deploying to a managed remote registry instead of local reuse.
- The issue is unrelated to containers, CUDA, GPU runtime, or local ML services.

## Inputs
- Registry port (default `5000`)
- Base image target name/tag
- Whether Docker can use an insecure localhost registry
- Which local ML service is needed, if any:
  - embeddings
  - Open Hax proxy/model gateway
  - generic ML dev/runtime container

## Steps

### 1) Start and validate the local registry
System-wide registry compose file:
- `~/.config/local-container-registry/docker-compose.yml`

Start it:

```bash
docker compose -f ~/.config/local-container-registry/docker-compose.yml up -d
curl -sSf http://localhost:5000/v2/_catalog
```

Optional systemd user service:

```bash
systemctl --user daemon-reload
systemctl --user enable --now local-container-registry.service
systemctl --user status local-container-registry.service
```

### 2) Fix Docker daemon registry access if needed
If Docker errors with HTTPS/TLS problems against `localhost:5000`, add:

`/etc/docker/daemon.json`

```json
{ "insecure-registries": ["localhost:5000"] }
```

Restart Docker.

### 3) Prefer official CUDA-capable bases
For reusable ML base images, prefer official image families over hand-assembling CUDA libs:

- general CUDA runtime: `nvidia/cuda:<ver>-cudnn-runtime-ubuntu22.04`
- general ML toolbox base: `pytorch/pytorch:<ver>-cuda<ver>-cudnn<ver>-runtime`
- embeddings service: Hugging Face Text Embeddings Inference image
- local proxy/model gateway: Open Hax service/proxy images

Default recommendation for broad ML/dev reuse:
- `pytorch/pytorch:2.4.1-cuda12.4-cudnn9-runtime`

### 4) Build + push a baked ML base image
Example:

```bash
docker build -f Dockerfile.ml-base \
  -t localhost:5000/shibboleth/ml-base:cuda12.4-2026-03-18 \
  .

docker push localhost:5000/shibboleth/ml-base:cuda12.4-2026-03-18
```

Optional preload:

```bash
docker build -f Dockerfile.ml-base \
  --build-arg PRELOAD_E5=1 \
  -t localhost:5000/shibboleth/ml-base:cuda12.4-2026-03-18 \
  .
```

### 5) Consume the image from any repo
In Dockerfiles:

```dockerfile
FROM localhost:5000/shibboleth/ml-base:cuda12.4-2026-03-18
```

In compose/build flows:

```bash
PROMPTBENCH_BASE_IMAGE=localhost:5000/shibboleth/ml-base:cuda12.4-2026-03-18 \
  docker compose build
```

### 6) Stand up local ML services when needed
Use dedicated official/service images for narrow services:

- **Embeddings service**: Hugging Face Text Embeddings Inference
- **Local proxy/model gateway**: Open Hax stack / proxy service image(s)

Guideline:
- use the baked base image for a broad toolbox/dev container
- use a dedicated service image when you need a stable local API endpoint

## Output
- A running registry at `localhost:5000`
- A tagged CUDA-capable ML base image reusable across repos
- A documented build/tag/push/consume workflow
- A default playbook for container-side ML runtime failures and local ML service setup
