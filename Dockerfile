FROM node:25-alpine

LABEL org.opencontainers.image.authors="Jon Uhlmann"
LABEL org.opencontainers.image.description="Standalone shiki server, listening on port 8090/tcp."

ENV NODE_ENV=production

ENV CORS=""
ENV PORT=8090

ENV HEALTHCHECK=true
ENV CHARSET="utf8"
ENV DEFAULT_RESPONSE_CONTENT_TYPE="application/json; charset=utf-8"
ENV DEFAULT_THEME="vitesse-dark"
ENV DEFAULT_LANGUAGE="javascript"

WORKDIR /app

COPY package* ./

RUN set -ex \
    && apk --no-cache upgrade \
    && apk --no-cache add curl ca-certificates \
    && update-ca-certificates \
    && npm --env=production install

COPY index.js ./index.js
COPY healthcheck.js ./healthcheck.js
COPY highlight ./highlight

USER node

HEALTHCHECK --start-period=10s --retries=1 CMD node healthcheck.js || exit 1

EXPOSE 8090

ENTRYPOINT [ "node", "index.js" ]
