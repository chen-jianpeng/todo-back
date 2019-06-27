FROM node

WORKDIR /douban-trailer

COPY . /douban-trailer

CMD npm run prod