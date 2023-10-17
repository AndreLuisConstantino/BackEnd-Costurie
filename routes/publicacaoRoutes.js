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

module.exports = router 