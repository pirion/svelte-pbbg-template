FROM node:latest

WORKDIR /usr/src/app

# install dependancies
COPY package*.json ./
RUN npm install
RUN npm install --only=dev

# add code files
COPY . .

# set startup information
EXPOSE 3000
CMD ["npm", "run", "dev"]