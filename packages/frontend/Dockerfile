# dockerfile
# the first image use node image as the builder because it has git program
FROM node:14.11-stretch as builder

ENV NODE_ENV production
ENV REACT_APP_NOTES_URL notes.project-hub.studio

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY ./ /app/

## compile typescript
RUN npm run build

## remove packages of devDependencies
RUN npm prune --production

# ===============
# the second image use node:slim image as the runtime
FROM nginx:mainline-alpine as runtime

COPY --from=builder "/app/build/" "/usr/share/nginx/html"

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d