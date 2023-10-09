/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas de tag e tag-usuário
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();

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

const tagController = require('../controller/tagController.js')
const tagUsuarioController = require('../controller/tagUsuarioController.js')

//Dependencia para gerenciar as permissões da API
const cors = require('cors')
//Dependencia para gerenciar o corpo de requisições da API
const bodyParser = require('body-parser')

//Define que os dados que iram chegar na requisição será no padrão JSON
const bodyParserJSON = bodyParser.json()

const verifyJWT = async (request, response, next) => {
    const jwt = require('../middleware/middlewareJWT.js')

    let token = request.headers['x-access-token']

    const autenticidadeToken = await jwt.validateJWT(token)

    if (autenticidadeToken) {
        next()
    } else {
        return response.status(401).end()
    }
}

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('../controller/modulo/config.js')

//Endpoint para pegar todas as tags pela categoria
router.post('/tag/tag_by_categoria', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    let contentType = request.headers['content-type']

    let dadosBody = request.body

    if (String(contentType).toLowerCase() == 'application/json') {
        let resultTag = await tagController.selectAllTagsByCategoria(dadosBody)

        if (resultTag) {
            response.status(resultTag.status)
            response.json(resultTag)
        } else {
            response.status(resultTag.status)
            response.json(resultTag)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint que pega a tag pelo id
router.get('/tag/:id', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    let idTag = request.params.id

    let dadosTag = await tagController.selectTagById(idTag)

    if (dadosTag) {
        response.status(dadosTag.status)
        response.json(dadosTag)
    } else {
        response.status(dadosTag.status)
        response.json(dadosTag)
    }
})

//Endpoint que retorna todos as tags existentes no BD
router.get('/tag', verifyJWT, cors(), bodyParserJSON, async (request, response) => {

    let dadosTag = await tagController.selectTagsByCategoria()

    if (dadosTag) {
        response.status(dadosTag.status)
        response.json(dadosTag)
    } else {
        response.status(dadosTag.status)
        response.json(dadosTag)
    }
})

//Endpoint que insere tag
router.post('/tag/inserir', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    let contentType = request.headers['content-type']

    let dadosBody = request.body

    if (String(contentType).toLowerCase() == 'application/json') {
        let resultTag = await tagController.insertTag(dadosBody)

        if (resultTag) {
            response.status(resultTag.status)
            response.json(resultTag)
        } else {
            response.status(resultTag.status)
            response.json(resultTag)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint para inserir as tags do usuário
router.post('/tag/inserir_tags', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    let contentType = request.headers['content-type']

    let dadosBody = request.body

    if (String(contentType).toLowerCase() == 'application/json') {
        let resultTag = await tagUsuarioController.insertTagsUsuario(dadosBody)

        if (resultTag) {
            response.status(resultTag.status)
            response.json(resultTag)
        } else {
            response.status(resultTag.status)
            response.json(resultTag)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

module.exports = router