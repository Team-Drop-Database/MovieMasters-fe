FROM node:23-alpine

WORKDIR /app
COPY . .
RUN ["npm", "install"]
RUN ["npm", "run", "build"]
EXPOSE 3000
ENTRYPOINT ["npm", "start"]