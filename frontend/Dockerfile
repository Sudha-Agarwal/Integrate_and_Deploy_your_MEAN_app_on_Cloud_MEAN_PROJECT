# Use the official Angular image as a parent image
FROM node:18.19 as build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY User-app/package*.json ./

# Install Angular CLI
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY User-app .

# Build the Angular app
RUN ng build --configuration=production --output-path=dist/User-app

# Use nginx as the base image
FROM nginx:alpine

# Copy the built Angular app to nginx html directory
COPY --from=build /usr/src/app/dist/User-app /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
