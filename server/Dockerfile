# NOTE: docker build -t server_app -f Dockerfile .

FROM node:18

WORKDIR /usr/src/app
COPY . .

RUN yarn install
RUN yarn lint
RUN yarn generate
RUN yarn build

EXPOSE 5001

CMD ["yarn", "start:prod"]