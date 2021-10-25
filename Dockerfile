FROM node:14

RUN mkdir -p /usr/src/app/node_module

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install pm2 -g

COPY . ./

RUN chmod +x ./wait-for-it.sh ./docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD npm run pm2-docker
