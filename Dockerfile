FROM node:20

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY . .

RUN pnpm install

RUN apt update && \
    apt install -y wget netcat-traditional && \
    wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for && \
    chmod +x /usr/bin/wait-for

EXPOSE 3456
