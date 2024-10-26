const app = require('./app'); // Importa a aplicação Express

const PORT = process.env.PORT || 3000; // Define a porta do servidor

// Inicia o servidor e exibe mensagens no console
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`); // Mensagem de sucesso ao iniciar
    console.log(`Documentação da API disponível em http://localhost:${PORT}/api-docs`); // URL da documentação
});
