FROM node:20-alpine AS build_image

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY . .

ENV PATH=/usr/src/app/node_modules/.bin:$PATH
RUN apk add --update python3 make g++
   
RUN yarn install
RUN yarn build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=build_image /usr/src/app/. .
COPY --from=build_image /usr/src/app/node_modules node_modules
COPY --from=build_image /usr/src/app/dist dist
COPY --from=build_image /usr/src/app/package.json package.json

EXPOSE 4001
CMD [ "yarn", "start" ]
 