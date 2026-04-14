FROM node:20-alpine

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy source code
COPY . .

# OpenShift uses random user → ensure permissions are safe
RUN chown -R 1001:0 /app && chmod -R g=u /app

USER 1001

EXPOSE 3000

CMD ["npm", "start"]
