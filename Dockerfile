FROM php:8.3-apache-bullseye

ENV NODE_VERSION=22.14.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

COPY frontend /home/frontend
WORKDIR /home/frontend
RUN npm run build
RUN rmdir /var/www/html
RUN mv dist /var/www/html
COPY backend /var/www/html/api

EXPOSE 80
