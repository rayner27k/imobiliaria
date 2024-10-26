# Use a imagem base do Node.js
FROM node:18

# Baixa e instala o dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN apt-get update && apt-get install -y wget && \
    wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código da aplicação para o contêiner
COPY . .

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# Comando para rodar a aplicação, usando o dockerize para aguardar o banco de dados
CMD ["dockerize", "-wait", "tcp://db:5432", "-timeout", "30s", "node", "src/server.js"]
