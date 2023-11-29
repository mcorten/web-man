# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:20 as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

LABEL org.opencontainers.image.title="web-man client"
LABEL org.opencontainers.image.description="web-man allows to test socker IO 4  servers"
LABEL org.opencontainers.image.source="https://github.com/mcorten/web-man"
LABEL org.opencontainers.image.authos="mcorten"

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/web-man /usr/share/nginx/html

# Expose port 80
EXPOSE 80