/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas de publicacao
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();

const publicacaoController = require('../controller/publicacaoController.js')

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

//Endpoint para inserir uma publicação
router.post('/publicacao/inserir', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
     //Recebe o content-type da requisição
     let contentType = request.headers['content-type']

     if (String(contentType).toLowerCase() == 'application/json') {
         let dadosBody = request.body
 
         let dadosInserirPublicacao = await publicacaoController.insertPublicacao(dadosBody)

         if (dadosInserirPublicacao) {
            response.status(dadosInserirPublicacao.status)
            response.json(dadosInserirPublicacao)
        } else {
            response.status(dadosInserirPublicacao.status)
            response.json(dadosInserirPublicacao)
        }
     } else {
         response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
         response.json(message.ERROR_INVALID_CONTENT_TYPE)
     }
})

//Endpoint que retorna todas as publicações
router.get('/publicacao/select_all', cors(), async (request, response) => {

    let dadosPublicacao = await publicacaoController.selectAllPublications()

    response.status(dadosPublicacao.status)
    response.json(dadosPublicacao)
})

//Endpoint que retorna a publicação pelo id
router.get('/publicacao/select_by_id/:id', verifyJWT, cors(), async (request, response) => {
    
    let idPublicacao = request.params.id

    let dadosPublicacao = await publicacaoController.selectPublicacaoById(idPublicacao)

    response.status(dadosPublicacao.status)
    response.json(dadosPublicacao)
})

//Endpoint que atualiza uma publicação que já existe
router.put('/publicacao/editar_publicacao', verifyJWT, bodyParserJSON, cors(), async (request, response) => {

    let contentType = request.headers['content-type']

     if (String(contentType).toLowerCase() == 'application/json') {
         let dadosBody = request.body
 
         let dadosUpdatePublicacao = await publicacaoController.updatePublicacao(dadosBody)

         if (dadosUpdatePublicacao) {
            response.status(dadosUpdatePublicacao.status)
            response.json(dadosUpdatePublicacao)
        } else {
            response.status(dadosUpdatePublicacao.status)
            response.json(dadosUpdatePublicacao)
        }
     } else {
         response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
         response.json(message.ERROR_INVALID_CONTENT_TYPE)
     }
})

router.delete('/publicacao/:id', verifyJWT, cors(), async (request, response) => {

    let idPublicacao = request.params.id

    let dadosDeletarPublicacao = await publicacaoController.deletePublicacao(idPublicacao)

    response.status(dadosDeletarPublicacao.status)
    response.json(dadosDeletarPublicacao)
})

module.exports = router 