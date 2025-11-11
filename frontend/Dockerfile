# Если hangs часто — смените на node:18 (Debian, быстрее npm)
FROM node:18-alpine

WORKDIR /app

# Copy package + lock для кэша
COPY package*.json ./

# Зеркало для скорости (npmmirror — быстрое), clean cache, ci (fast) или fallback install
RUN npm config set registry https://registry.npmmirror.com && \
    npm cache clean --force && \
    (npm ci --verbose || npm install --verbose)

# Copy source
COPY . .

# Build (для prod; dev — volumes)
RUN npm run build

EXPOSE 3000

CMD ["npx", "vite", "--host", "0.0.0.0"]