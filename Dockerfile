FROM node:22-alpine AS production

# Set working directory for production
WORKDIR /app-production

# Install the dependencies for production, you might want to use yarn or pnpm instead
COPY package*.json ./

# Install dependencies for production
RUN npm install --verbose

# Copy the rest of the files into the working directory for production
COPY . .

# Expose the port for production
EXPOSE 3000

# Build the application for production
RUN NODE_OPTIONS=--max-old-space-size=4096 npm run build

# Command to run the app for production
CMD [ "node", ".output/server/index.mjs" ]
