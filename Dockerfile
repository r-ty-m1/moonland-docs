FROM node:22-alpine

WORKDIR /app
COPY --chown=node:node . .
# 編輯後台的內容、上傳的圖片、回饋存在 /app/storage（部署時掛 vibe.yaml 的 persistence 磁碟；沒掛時容器內也能寫）
RUN mkdir -p /app/storage && chown node:node /app/storage

# node 使用者的 UID/GID 是 1000（平台要求）
USER node
ENV PORT=8080 HOST=0.0.0.0 NODE_ENV=production DATA_DIR=/app/storage
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/healthz" >/dev/null || exit 1

CMD ["node", "server/server.js"]
