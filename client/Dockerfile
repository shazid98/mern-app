FROM node:14.14.0-alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm i
COPY . .
EXPOSE 8000:8000
CMD ["npm", "run", "start"]