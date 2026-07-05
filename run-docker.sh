#!/bin/bash
docker run -d --platform linux/amd64 \
  -v /Users/midou/midou-blog:/app \
  -w /app \
  -p 4000:4000 \
  node:14.20-alpine \
  sh -c "npm install && npm run server"
