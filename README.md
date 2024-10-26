# API Imobiliária

Esta é uma API para uma imobiliária que se especializa na compra e venda de fazendas.

## Sumário
1. [Tecnologias Utilizadas](#tecnologias-utilizadas)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Endpoints da API](#endpoints-da-api)
5. [Testes](#testes)
6. [Conteinerização](#conteinerização)
7. [Observações](#observações)

## Tecnologias Utilizadas

- Javascript
- Node.js
- Express
- Npm
- Jest para testes
- Git
- Postman
- PostgreSQL com PostGIS
- Sequelize
- Docker
- VS Code

<img src="https://skillicons.dev/icons?i=javascript,nodejs,express,npm,jest,git,postman,postgres,sequelize,docker,vscode" /><br>

## Pré-requisitos

1. Node.js instalado.
2. Docker e Docker Compose instalados.
3. Clonar o repositório: 
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git

    cd seu-repositorio
    ```

## Configuração do Ambiente

1. Instale as dependências:
     ```bash
     npm install
     ```
2. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
     ```sh
     # Variáveis para ambiente local
     LOCAL_DB_NAME=imobiliaria
     LOCAL_DB_USER=seu_usuario
     LOCAL_DB_PASSWORD=sua_senha
     LOCAL_DB_HOST=localhost
     LOCAL_PORT=3000

     # Variáveis para ambiente Docker
     DOCKER_DB_NAME=imobiliaria
     DOCKER_DB_USER=postgres
     DOCKER_DB_PASSWORD=sua_senha
     DOCKER_DB_HOST=db
     DOCKER_PORT=3000
     ```
3. Inicie a aplicação:
     ```bash
     npm start
     ```

## Endpoints da API

### Clientes
- `GET /clientes`: Retorna todos os clientes.
- `POST /clientes`: Cria um novo cliente.
- `PUT /clientes/:id`: Atualiza um cliente existente.
- `DELETE /clientes/:id`: Remove um cliente.

### Fazendas
- `GET /fazendas`: Retorna todas as fazendas.
- `POST /fazendas`: Cria uma nova fazenda.
- `PUT /fazendas/:id`: Atualiza uma fazenda existente.
- `DELETE /fazendas/:id`: Remove uma fazenda.

### Transações
- `GET /transacoes`: Retorna todas as transações.
- `POST /transacoes`: Cria uma nova transação.
- `PUT /transacoes/:id`: Atualiza uma transação existente.
- `DELETE /transacoes/:id`: Remove uma transação.

## Testes

- Para gerar um relatório de cobertura de testes, execute:
     ```bash
     npm test
     ```

- Para rodar apenas os testes, utilize o seguinte comando:
     ```bash
     npm run test:only
     ```

## Conteinerização

A aplicação pode ser executada em um contêiner Docker. Para isso, siga os passos abaixo:

1. Certifique-se de que o Docker está instalado.
2. Construa e inicie os contêineres usando o Docker Compose:
     ```sh
     docker-compose up --build
     ```

Isso iniciará a aplicação e o banco de dados PostgreSQL, utilizando as configurações definidas no arquivo `.env`.

## Observações

- O arquivo `.dockerignore` deve incluir `node_modules`, `npm-debug.log`, `.env` e `coverage` para evitar que esses arquivos sejam copiados para o contêiner.
- A variável `DB_HOST` no Docker Compose deve ser configurada como `db` para se conectar ao serviço de banco de dados.
- Certifique-se de que o `PostGIS` está configurado corretamente no contêiner de banco de dados PostgreSQL.
