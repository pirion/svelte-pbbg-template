FROM node:latest

WORKDIR /usr/src/app

# install dependancies
COPY package*.json ./
RUN npm install

# add code files
COPY . .

# set startup information
EXPOSE 3000
CMD ["npm", "run", "dev"]