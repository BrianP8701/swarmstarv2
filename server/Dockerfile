FROM node:18

WORKDIR /usr/src/app
COPY . .

RUN yarn install
RUN yarn lint
RUN yarn generate
RUN yarn build

ENV PORT=8080

CMD ["sh", "-c", "yarn start:prod --port $PORT"]