FROM node:18-slim

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create directories for uploads and streams
RUN mkdir -p uploads streams

EXPOSE 5000

CMD ["npm", "start"]
