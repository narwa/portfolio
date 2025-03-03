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

# Copy only necessary files for the build
COPY index.html ./
COPY 404.html ./
COPY server.js ./
COPY config.template.js ./config.js
COPY css/ ./css/
COPY js/ ./js/
COPY img/ ./img/
COPY Curriculum_Vitae_And_Resume_Narwanto_Classic.pdf ./

# Production stage - minimal image
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/index.html ./
COPY --from=build /app/404.html ./
COPY --from=build /app/server.js ./
COPY --from=build /app/config.js ./
COPY --from=build /app/css/ ./css/
COPY --from=build /app/js/ ./js/
COPY --from=build /app/img/ ./img/
COPY --from=build /app/Curriculum_Vitae_And_Resume_Narwanto_Classic.pdf ./

# Install only production dependencies
COPY package.json ./
RUN npm install --only=production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV EMAIL_USER=narwantomail@gmail.com
# EMAIL_PASSWORD will be passed at runtime

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
