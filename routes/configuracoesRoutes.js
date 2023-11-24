/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas de configurações
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();

const configuracaoController = require('../controller/configuracaoController.js')

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

//Endpoint para alterar o email
router.put('/configuracao/alterar_email', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosAlterarEmail = await configuracaoController.alterarEmail(dadosBody)

        if (dadosAlterarEmail) {
            response.status(dadosAlterarEmail.status)
            response.json(dadosAlterarEmail)
        } else {
            response.status(dadosAlterarEmail.status)
            response.json(dadosAlterarEmail)
        }

    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint para alterar a senha
router.put('/configuracao/alterar_senha', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosAlterarSenha = await configuracaoController.alterarSenha(dadosBody)

        if (dadosAlterarSenha) {
            response.status(dadosAlterarSenha.status)
            response.json(dadosAlterarSenha)
        } else {
            response.status(dadosAlterarSenha.status)
            response.json(dadosAlterarSenha)
        }

    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

module.exports = router 