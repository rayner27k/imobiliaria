# Use a imagem base do Node.js
FROM node:18

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

# Comando para rodar a aplicação
CMD ["node", "src/server.js"]
