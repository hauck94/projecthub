FROM node:15-stretch-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

## compile typescript
RUN npm run build

RUN npm prune --production

ENV NODE_ENV production
ENV PORT 80

# Delete this lines
ENV DBPORT 3306
ENV DBUSER root
ENV DBPASSWORD 123456789
ENV DBDATABASE project_hub
ENV DBHOST db
# Delete this lines

EXPOSE 80

CMD ["node", "dist/src/index.js"]