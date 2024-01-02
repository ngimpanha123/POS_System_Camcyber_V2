FROM node:16-slim

# Install libreoffice for convert office to pdf
RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:libreoffice/ppa
RUN apt-get install -y --force-yes libreoffice

RUN apt-get clean
ARG PORT=8001
WORKDIR /app
COPY package*.json ./
RUN npm install

# Install poppler for convert pdf to image
RUN apt-get install -y poppler-utils
RUN npm install -g node-gyp && npm install --save-dev node-gyp
RUN npm install --save node-poppler

COPY . .

RUN cp .env.example .env

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
