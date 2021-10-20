FROM node:14

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

RUN npm install nodemon --save

COPY . .

EXPOSE 8080

CMD npm run dev