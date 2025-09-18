FROM node:22.1.0-alpine
WORKDIR /app
COPY app/package.json /app/package.json
RUN npm install
COPY app /app
EXPOSE 8000
CMD ["node", "index.js"]
