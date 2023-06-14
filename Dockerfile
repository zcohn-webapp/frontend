FROM node:alpine

RUN apk update
RUN apk upgrade
RUN apk add git

ENV WORKING_DIR="/usr/app"
ENV PORT=5173

WORKDIR ${WORKING_DIR}
RUN mkdir "${WORKING_DIR}/webapp"

COPY webapp/package*.json "webapp"

RUN cd webapp && npm install

COPY . ${WORKING_DIR}

EXPOSE ${PORT}

CMD ["npm", "run", "dev", "--prefix", "/usr/app/webapp"]
