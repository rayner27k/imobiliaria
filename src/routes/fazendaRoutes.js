const express = require('express');
const fazendaController = require('../controllers/fazendaController');
const validateIdParam = require('../middlewares/validateIdParam');

const router = express.Router();

/**
 * @swagger
 * /fazendas:
 *   get:
 *     summary: Retorna a lista de todas as fazendas
 *     responses:
 *       200:
 *         description: Lista de fazendas
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
 *                   localizacao:
 *                     type: string
 *                   area:
 *                     type: number
 */
router.get('/', fazendaController.getAllFazendas); // Obtém todas as fazendas

/**
 * @swagger
 * /fazendas/{id}:
 *   get:
 *     summary: Retorna uma fazenda específica pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da fazenda a ser obtida
 *     responses:
 *       200:
 *         description: Fazenda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 localizacao:
 *                   type: string
 *                 area:
 *                   type: number
 *       404:
 *         description: Fazenda não encontrada
 */
router.get('/:id', validateIdParam, fazendaController.getFazendaById); // Obtém uma fazenda pelo ID

/**
 * @swagger
 * /fazendas:
 *   post:
 *     summary: Cria uma nova fazenda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               localizacao:
 *                 type: string
 *               area:
 *                 type: number
 *     responses:
 *       201:
 *         description: Fazenda criada com sucesso
 */
router.post('/', fazendaController.createFazenda); // Cria uma nova fazenda

/**
 * @swagger
 * /fazendas/{id}:
 *   put:
 *     summary: Atualiza uma fazenda existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da fazenda a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               localizacao:
 *                 type: string
 *               area:
 *                 type: number
 *     responses:
 *       200:
 *         description: Fazenda atualizada com sucesso
 *       404:
 *         description: Fazenda não encontrada
 */
router.put('/:id', validateIdParam, fazendaController.updateFazenda); // Atualiza uma fazenda

/**
 * @swagger
 * /fazendas/{id}:
 *   delete:
 *     summary: Deleta uma fazenda existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da fazenda a ser deletada
 *     responses:
 *       204:
 *         description: Fazenda deletada com sucesso
 *       404:
 *         description: Fazenda não encontrada
 */
router.delete('/:id', validateIdParam, fazendaController.deleteFazenda); // Deleta uma fazenda

module.exports = router;
