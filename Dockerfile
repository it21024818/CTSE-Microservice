# Building layer
FROM node:20-alpine AS development

# Optional Yarn automation (auth) token build argument
# ARG YARN_TOKEN

# Optionally authenticate Yarn registry
# RUN yarn config set registry https://registry.yarnpkg.com/:_authToken ${YARN_TOKEN}

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

# Install dependencies from package-lock.json (yarn equivalent of npm ci)
RUN yarn install --frozen

# Copy application sources (.ts, .tsx, js)
COPY src/ src/
COPY assets/ assets/

# Build application (produces dist/ folder)
RUN yarn run build

# Runtime (production) layer
FROM node:20-alpine AS production

# Optional Yarn automation (auth) token build argument
# ARG YARN_TOKEN

# Optionally authenticate Yarn registry
# RUN yarn config set registry https://registry.yarnpkg.com/:_authToken ${YARN_TOKEN}

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install runtime dependencies (without dev/test dependencies) - yarn equivalent of npm ci --omit=dev
RUN yarn install --production

# Copy production build
COPY --from=development /app/dist/ ./dist
COPY --from=development /app/assets/ ./assets
# COPY /app/assets/ assets/

# Expose application port
EXPOSE 3000

# Start application
CMD [ "node", "dist/main.js" ]