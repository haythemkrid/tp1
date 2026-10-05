FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server.js ./

USER node
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
