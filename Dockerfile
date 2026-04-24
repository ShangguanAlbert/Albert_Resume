FROM node:22-alpine

WORKDIR /app

ARG BASE_URL=/
ENV BASE_URL=${BASE_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3719

CMD ["npm", "run", "preview"]
