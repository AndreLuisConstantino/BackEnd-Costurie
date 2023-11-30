/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas de categoria
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();

const categoriaController = require('../controller/categoriaController.js')

//Permissões do cors
router.use((request, response, next) => {
    //Define quem poderá acessar a API (* = Todos)
    response.header('Acess-Control-Allow-Origin', '*')
    //Define quais métodos serão utilizados na API
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    //Atribui as permissões ao Cors
    router.use(cors())

    next()
})

//Dependencia para gerenciar as permissões da API
const cors = require('cors')
//Dependencia para gerenciar o corpo de requisições da API
const bodyParser = require('body-parser')

//Define que os dados que iram chegar na requisição será no padrão JSON
const bodyParserJSON = bodyParser.json()

const { verifyJWT } = require('../module/secret.js')

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('../controller/modulo/config.js')

//Selecionar todas as categorias
router.get('/categoria/select_all', cors(), verifyJWT, async (request, response) => {

    let dadosCategorias = await categoriaController.selectAllCategories()

    if (dadosCategorias) {
        response.status(dadosCategorias.status)
        response.json(dadosCategorias)
    } else {
        response.status(dadosCategorias.status)
        response.json(dadosCategorias)
    }
})

//Endpoint para selecionar todas as categorias pelo id
router.get('/categoria/:id', cors(), verifyJWT, bodyParserJSON, async (request, response) => {
    let idCategoria = request.params.id

    let dadosCategorias = await categoriaController.selectCategoriaById(idCategoria)

    if (dadosCategorias) {
        response.status(dadosCategorias.status)
        response.json(dadosCategorias)
    } else {
        response.status(dadosCategorias.status)
        response.json(dadosCategorias)
    }
})

module.exports = router 