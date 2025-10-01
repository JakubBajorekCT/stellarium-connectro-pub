FROM node:22-alpine
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
COPY tsconfig.json /app
RUN npm install
COPY src /app/src
CMD npm run start
