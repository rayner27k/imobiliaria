const express = require('express');
const transacaoController = require('../controllers/transacaoController');
const validateTransacao = require('../middlewares/validateTransacao');
const validateIdParam = require('../middlewares/validateIdParam');

const router = express.Router();

/**
 * @swagger
 * /transacoes:
 *   get:
 *     summary: Retorna a lista de todas as transações
 *     responses:
 *       200:
 *         description: Lista de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   cliente_id:
 *                     type: integer
 *                   fazenda_id:
 *                     type: integer
 *                   data_transacao:
 *                     type: string
 *                   valor:
 *                     type: number
 */
router.get('/', transacaoController.getAllTransacoes); // Obtém todas as transações

/**
 * @swagger
 * /transacoes:
 *   post:
 *     summary: Cria uma nova transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: integer
 *               fazenda_id:
 *                 type: integer
 *               data_transacao:
 *                 type: string
 *                 format: date
 *               valor:
 *                 type: number
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 */
router.post('/', validateTransacao, transacaoController.createTransacao); // Cria uma nova transação

/**
 * @swagger
 * /transacoes/{id}:
 *   put:
 *     summary: Atualiza uma transação existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da transação a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: integer
 *               fazenda_id:
 *                 type: integer
 *               data_transacao:
 *                 type: string
 *               valor:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *       404:
 *         description: Transação não encontrada
 */
router.put('/:id', validateIdParam, validateTransacao, transacaoController.updateTransacao); // Atualiza uma transação

/**
 * @swagger
 * /transacoes/{id}:
 *   delete:
 *     summary: Deleta uma transação existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da transação a ser deletada
 *     responses:
 *       204:
 *         description: Transação deletada com sucesso
 *       404:
 *         description: Transação não encontrada
 */
router.delete('/:id', validateIdParam, transacaoController.deleteTransacao); // Deleta uma transação

module.exports = router;
