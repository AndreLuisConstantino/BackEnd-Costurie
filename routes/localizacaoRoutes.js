/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas de localização
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();

const localizacaoController = require('../controller/localizacaoController.js')

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

//Endpoint para pegar todos os estados
router.get('/localizacao/estados/', cors(), verifyJWT, bodyParserJSON, async (request, response) => {

    let dadosEstados = await localizacaoController.selectAllStates()

    if (dadosEstados) {
        response.status(dadosEstados.status)
        response.json(dadosEstados)
    } else {
        response.status(dadosEstados.status)
        response.json(dadosEstados)
    }
})

//Endpoint para pegar todas as cidades
router.get('/localizacao/cidades/', cors(), verifyJWT, bodyParserJSON, async (request, response) => {

    let dadosCidades = localizacaoController.selectAllCitiesByState()
})

router.get('/localizacao/select_all', cors(), verifyJWT, bodyParserJSON, async (request, response) => {

    let dadosLocalizacao = await localizacaoController.selectAllLocations()

    if (dadosLocalizacao) {
        response.status(dadosLocalizacao.status)
        response.json(dadosLocalizacao)
    } else {
        response.status(dadosLocalizacao.status)
        response.json(dadosLocalizacao)
    }
})

router.put('/localizacao/atualizar', cors(), verifyJWT, bodyParserJSON, async (request, response) => {
    let contentType = request.headers['content-type']

    let dadosBody = request.body

    if (String(contentType).toLowerCase() == 'application/json') {
        let resultLocalizacao = await localizacaoController.updateLocalizacao(dadosBody)

        if (resultLocalizacao) {
            response.status(resultLocalizacao.status)
            response.json(resultLocalizacao)
        } else {
            response.status(resultLocalizacao.status)
            response.json(resultLocalizacao)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})


module.exports = router