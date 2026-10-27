FROM node:22-alpine

WORKDIR /app
COPY --chown=node:node . .

# node 使用者的 UID/GID 是 1000（平台要求）
USER node
ENV PORT=8080 HOST=0.0.0.0 NODE_ENV=production
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/healthz" >/dev/null || exit 1

CMD ["node", "server/server.js"]
