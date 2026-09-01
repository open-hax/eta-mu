# syntax=docker/dockerfile:1.7

FROM eclipse-temurin:21-jre-jammy AS java

FROM node:24-bookworm-slim AS build

COPY --from=java /opt/java/openjdk /opt/java/openjdk
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

WORKDIR /workspace
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && corepack enable \
 && corepack prepare pnpm@10.14.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile --ignore-scripts --filter @eta-mu/gitops-controller...
RUN pnpm -C packages/gitops-controller build
RUN pnpm --filter @eta-mu/gitops-controller deploy --prod --legacy /opt/controller
# The workspace-wide root override causes pnpm's legacy deploy projection to
# emit a link back to /workspace even though the controller does not depend on
# the monorepo root. Remove it before the cross-stage COPY so runtime layers can
# never retain or dereference the build workspace.
RUN test -L /opt/controller/node_modules/@open-hax/eta-mu-monorepo \
 && unlink /opt/controller/node_modules/@open-hax/eta-mu-monorepo \
 && test ! -L /opt/controller/node_modules/@open-hax/eta-mu-monorepo

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=node:node /opt/controller/ ./

USER node
EXPOSE 8790
CMD ["node", "dist/server.js"]
