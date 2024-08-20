# NOTE: docker build -t frontend_app -f app/Dockerfile .

# STAGE 1: Build app
FROM node:18-alpine as react-build

ADD ["server/src/graphql/schema.gql", "./server/src/graphql/"]
RUN ls -la
RUN ls -la ./server/src/graphql/

RUN mkdir /react_app
WORKDIR /react_app
COPY app ./
RUN ls -la

RUN yarn install
RUN yarn generate
RUN yarn build

# Stage 2: Serve file using NGINX
FROM nginx:alpine
COPY app/.nginx/nginx.conf /etc/nginx/conf.d/configfile.template

COPY --from=react-build /react_app/build /usr/share/nginx/html

ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
