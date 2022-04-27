# Dockerfile for production

FROM node:9

RUN npm install -g bower@1.8.14 serve@12.0.1

RUN mkdir -p /app/yhteyshaku && chown node:node /app/yhteyshaku

WORKDIR /app/yhteyshaku

USER node

COPY *.json *.html *.js ./
COPY css css/
COPY images images/
COPY scripts scripts/
COPY styles styles/
COPY views views/

RUN bower install

WORKDIR /app

EXPOSE 8000

CMD serve -l 8000
