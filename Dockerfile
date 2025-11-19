# Following: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

# The Node.js version to be used
ARG NODE_VERSION=24.11.1

FROM node:${NODE_VERSION}-alpine

# Set the NODE_ENV to production
ENV NODE_ENV production

# Installing OS build libraries
RUN apk --no-cache add g++ make py3-pip tini

# Set the working directory
WORKDIR /app

# Copy files required by npm install
COPY package.json package-lock.json ./

# Install dependencies
RUN npm i --package-lock-only

# Copy the entire monorepo project
COPY --chown=node:node . .

# Set the PORT to 3001
ENV APP_PORT 3001

# Set the user
USER node

# Expose the application port
EXPOSE 3001

# Set the entrypoint
ENTRYPOINT [ "/sbin/tini", "--" ]

# Finally start the APP
CMD [ "node", "." ]
