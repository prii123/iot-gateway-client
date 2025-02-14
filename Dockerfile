# Usa una imagen de Node.js como base
FROM node:18-alpine 

# Establece el directorio de trabajo
WORKDIR /app

# Copia y instala dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Expone el puerto de Next.js
EXPOSE 3001

# Ejecuta Next.js en modo producción
CMD ["npm", "run", "start"]
