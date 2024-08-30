# NOTE: docker build -t frontend_app -f client/Dockerfile .

# STAGE 1: Build app
FROM node:18-alpine as react-build

WORKDIR /app

# Copy the schema.gql file from the server
COPY server/src/graphql/schema.gql ./server/src/graphql/

# Copy the client folder contents
COPY client ./client

WORKDIR /app/client

RUN yarn install
RUN yarn generate
RUN yarn build

# Stage 2: Serve file using NGINX
FROM nginx:alpine

COPY client/.nginx/nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=react-build /app/client/dist /usr/share/nginx/html

ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
