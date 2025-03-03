# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json
COPY package.json ./

# Install dependencies using pnpm
RUN pnpm install

# Run the build script to create the public directory
COPY index.html 404.html robots.txt sitemap.xml manifest.json ./
COPY server.js ./
COPY config.template.js ./config.js
COPY css/ ./css/
COPY js/ ./js/
COPY img/ ./img/
COPY Curriculum_Vitae_And_Resume_Narwanto_Classic.pdf ./

# Create the public directory structure
RUN mkdir -p public && \
    cp -r index.html 404.html robots.txt sitemap.xml manifest.json css js img Curriculum_Vitae_And_Resume_Narwanto_Classic.pdf public/

# Production stage - minimal image
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy server.js and config.js from the build stage
COPY --from=build /app/server.js ./
COPY --from=build /app/config.js ./

# Copy the public directory with all static files
COPY --from=build /app/public/ ./public/

# Install only production dependencies
COPY package.json ./
RUN npm install --only=production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV EMAIL_USER=narwantomail@gmail.com
# EMAIL_PASSWORD will be passed at runtime

# Make sure the server knows we're in production mode
RUN echo "Running in production mode with public directory"

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
