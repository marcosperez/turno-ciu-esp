FROM node:18

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package*.json ./
RUN npx puppeteer browsers install chrome

# Instalar las dependencias de Node.js
RUN npm install --production

# Copiar el código de la aplicación a /app
COPY . .

# Exponer el puerto 9999
EXPOSE 9999

# Definir la variable de entorno para Puppeteer
# ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

# Comando por defecto para iniciar la aplicación
CMD [ "node", "index.js" ]
