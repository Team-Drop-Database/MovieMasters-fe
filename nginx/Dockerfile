# pull latest nginx image
FROM nginx:latest

# copy config file into container
COPY default.conf /etc/nginx/conf.d/default.conf

# copy self-signed SSL certificate and private key into container
COPY nginx-selfsigned.key /etc/nginx/ssl/nginx-selfsigned.key
COPY nginx-selfsigned.crt /etc/nginx/ssl/nginx-selfsigned.crt

# expose both port 3000 (for http access) and port 443 (for https access)
EXPOSE 3000 443

# start nginx
CMD ["nginx", "-g", "daemon off;"]