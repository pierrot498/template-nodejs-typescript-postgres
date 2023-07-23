# pull the Node.js Docker image
FROM node:alpine

# create the directory inside the container
WORKDIR /app

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install --silent

# run npm install in our local machine
RUN npm run build

# copy the generated modules and all other files to the container
COPY . .

# our app is running on port PORT within the container, so need to expose it
EXPOSE ${PORT}

# the command that starts our app
CMD ["node", "./dist/server.js"]