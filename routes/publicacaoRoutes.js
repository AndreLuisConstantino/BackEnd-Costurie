/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas de publicacao
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();

const publicacaoController = require('../controller/publicacaoController.js')


//Dependencia para gerenciar as permissões da API
const cors = require('cors')
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
//Dependencia para gerenciar o corpo de requisições da API
const bodyParser = require('body-parser')

//Define que os dados que iram chegar na requisição será no padrão JSON
const bodyParserJSON = bodyParser.json()

const { verifyJWT } = require('../module/secret.js')

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('../controller/modulo/config.js')

//Endpoint para inserir uma publicação
router.post('/publicacao/inserir', cors(), verifyJWT, bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        // console.log(dadosBody);

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
router.get('/publicacao/select_all', cors(), verifyJWT, async (request, response) => {

    let dadosPublicacao = await publicacaoController.selectMostRecentPublications()

    response.status(dadosPublicacao.status)
    response.json(dadosPublicacao)
})

//Endpoint que retorna a publicação pelo id
router.get('/publicacao/select_by_id/:id', cors(), verifyJWT, async (request, response) => {

    let idPublicacao = request.params.id

    let dadosPublicacao = await publicacaoController.selectPublicacaoById(idPublicacao)

    response.status(dadosPublicacao.status)
    response.json(dadosPublicacao)
})

//Endpoint que atualiza uma publicação que já existe
router.put('/publicacao/editar_publicacao', cors(), verifyJWT, bodyParserJSON, async (request, response) => {

    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosUpdatePublicacao = await publicacaoController.updatePublicacao(dadosBody)

        //  console.log(dadosUpdatePublicacao);

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

//Endpoint que deleta uma publicação
router.delete('/publicacao/:id', cors(), verifyJWT, async (request, response) => {

    let idPublicacao = request.params.id

    let dadosDeletarPublicacao = await publicacaoController.deletePublicacao(idPublicacao)

    response.status(dadosDeletarPublicacao.status)
    response.json(dadosDeletarPublicacao)
})

//Endpoint para curtir uma publicação
router.post('/publicacao/curtir', cors(), verifyJWT, bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosCurtirPublicacao = await publicacaoController.curtirPublicacao(dadosBody)

        if (dadosCurtirPublicacao) {
            response.status(dadosCurtirPublicacao.status)
            response.json(dadosCurtirPublicacao)
        } else {
            response.status(dadosCurtirPublicacao.status)
            response.json(dadosCurtirPublicacao)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint para retirar a curtida
router.post('/publicacao/retirar_curtida', cors(), verifyJWT, bodyParserJSON, async (request, response) => { 
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosRetirarCurtidaPublicacao = await publicacaoController.retirarCurtida(dadosBody)

        if (dadosRetirarCurtidaPublicacao) {
            response.status(dadosRetirarCurtidaPublicacao.status)
            response.json(dadosRetirarCurtidaPublicacao)
        } else {
            response.status(dadosRetirarCurtidaPublicacao.status)
            response.json(dadosRetirarCurtidaPublicacao)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }

})

//Endpoint que traz todas as publicações existentes no sistema
router.get('/publicacao/', cors(), verifyJWT, async (request, response) => {

    let dadosPublicacoes = await publicacaoController.selectAllPublicationsOfSystem()

    response.status(dadosPublicacoes.status)
    response.json(dadosPublicacoes)
})

//Endpoint de selecionar as publicações mais populares
router.get('/publicacao/populares', cors(), verifyJWT, async (request, response) => {

    let dadosPublicacoesPopulares = await publicacaoController.selectMostPopularPublications()

    // console.log(dadosPublicacoesPopulares);

    response.status(dadosPublicacoesPopulares.status)
    response.json(dadosPublicacoesPopulares)
})

//Endpoint para verificar a curtida
router.post('/publicacao/verificar_curtida', cors(), verifyJWT, bodyParserJSON,async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosVerificarCurtida = await publicacaoController.verificarCurtida(dadosBody)

        if (dadosVerificarCurtida) {
            response.status(dadosVerificarCurtida.status)
            response.json(dadosVerificarCurtida)
        } else {
            response.status(dadosVerificarCurtida.status)
            response.json(dadosVerificarCurtida)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

module.exports = router 