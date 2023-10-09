/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas de localização
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();

const localizacaoController = require('../controller/localizacaoController.js')

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

//Endpoint para pegar todos os estados
router.get('/localizacao/estados/', verifyJWT, cors(), bodyParserJSON, async (request, response) => {

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
router.get('/localizacao/cidades/', verifyJWT, cors(), bodyParserJSON, async (request, response) => {

    let dadosCidades = localizacaoController.selectAllCitiesByState()
})

//Endpoint para deletar localização pelo id
router.delete('/localizacao/:id', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    let idLocalizacao = request.params.id

    let dadosLocalizacao = await localizacaoController.deleteLocalizacao(idLocalizacao)

    if (dadosLocalizacao) {
        response.status(dadosLocalizacao.status)
        response.json(dadosLocalizacao)
    } else {
        response.status(dadosLocalizacao.status)
        response.json(dadosLocalizacao)
    }
})

router.get('/localizacao/select_all', verifyJWT, cors(), bodyParserJSON, async (request, response) => {

    let dadosLocalizacao = await localizacaoController.selectAllLocations()

    if (dadosLocalizacao) {
        response.status(dadosLocalizacao.status)
        response.json(dadosLocalizacao)
    } else {
        response.status(dadosLocalizacao.status)
        response.json(dadosLocalizacao)
    }
})

module.exports = router