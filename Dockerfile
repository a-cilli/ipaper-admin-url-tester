# Use the official Node.js image (slim version for smaller size)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port that the app will run on (default Next.js is 3000)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]