# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files
COPY package.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NAME World

# Run the app when the container launches
CMD ["npm", "start"]
