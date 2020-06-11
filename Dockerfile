FROM node:lts as build
RUN mkdir /build
WORKDIR /build
COPY . .
RUN yarn install
RUN yarn run build

FROM nginx:alpine
COPY --from=build /build/dist /usr/share/nginx/html