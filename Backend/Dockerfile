# Use an official Node.js runtime as a parent image
FROM node:18.19 as build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install global dependencies
#RUN npm install -g node-gyp

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Remove existing node_modules (if any) and rebuild bcrypt
#RUN rm -rf node_modules && npm install bcrypt && npm rebuild bcrypt --build-from-source

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
