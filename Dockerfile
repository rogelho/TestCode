FROM nginx
WORKDIR /usr/share/nginx/html
COPY ./dist/gradient-able-v7.3.7/. .
