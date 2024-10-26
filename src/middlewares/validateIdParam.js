const validateIdParam = (req, res, next) => {
    const { id } = req.params; // Extrai o ID dos parâmetros da requisição
    if (!Number.isInteger(Number(id))) { // Verifica se o ID é um número inteiro
        return res.status(400).json({ error: 'ID deve ser um número inteiro' }); // Retorna erro se não for
    }
    next(); // Prossegue para o próximo middleware
};

module.exports = validateIdParam; 
