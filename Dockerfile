FROM node:lts-alpine AS DEPENCENCY
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i

FROM node:lts-alpine AS BUILD
WORKDIR /app
COPY --from=DEPENCENCY /app/node_modules /app/node_modules
COPY . /app
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY . /app
COPY --from=DEPENCENCY /app/node_modules /app/node_modules
COPY --from=BUILD /app/dist /app/dist
CMD [ "node", "dist/src/main.js" ]