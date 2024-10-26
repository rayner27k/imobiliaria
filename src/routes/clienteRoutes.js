const express = require('express');
const clienteController = require('../controllers/clienteController');
const validateIdParam = require('../middlewares/validateIdParam');

const router = express.Router();

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Retorna a lista de todos os clientes
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get('/', clienteController.getAllClientes); // Obtém todos os clientes

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 */
router.post('/', clienteController.createCliente); // Cria um novo cliente

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.put('/:id', validateIdParam, clienteController.updateCliente); // Atualiza um cliente

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Deleta um cliente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente a ser deletado
 *     responses:
 *       204:
 *         description: Cliente deletado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.delete('/:id', validateIdParam, clienteController.deleteCliente); // Deleta um cliente

module.exports = router; 