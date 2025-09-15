# ---------- deps ----------
FROM node:20 AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# ---------- build ----------
FROM node:20 AS build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- run ----------
FROM node:20
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# 런타임에 필요한 것만 복사
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/package*.json ./
COPY --from=deps  /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm","start"]
