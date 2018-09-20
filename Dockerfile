# Dockerfile for production

FROM node:9

RUN npm install -g bower serve

RUN mkdir /app && chown node:node /app

WORKDIR /app

USER node

COPY *.json *.html *.js ./
COPY css css/
COPY images images/
COPY scripts scripts/
COPY styles styles/
COPY views views/

RUN bower install

EXPOSE 8000

CMD serve -l 8000