# Frontend - React + Vite + TypeScript (Development)

FROM node:20-alpine

WORKDIR /app

# AUTO RELOAD
ENV CHOKIDAR_USEPOLLING=true

# Copy dependency files first for better layer caching
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

EXPOSE 5173

# Run Vite development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
