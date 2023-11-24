/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas de comentários
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();

const comentarioController = require('../controller/comentarioController.js')

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

//Endpoint que insere comentário
router.post('/comentario/inserir', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosInserirComentario = await comentarioController.insertComentario(dadosBody)

        // console.log(dadosInserirComentario);

        if (dadosInserirComentario) {
            response.status(dadosInserirComentario.status)
            response.json(dadosInserirComentario)
        } else {
            response.status(dadosInserirComentario.status)
            response.json(dadosInserirComentario)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint que seleciona os comentários pelo id da publicação
router.get('/comentario/select_by_id_publicacao/:id', verifyJWT, cors(), async (request, response) => {
    
    let idPublicacao = request.params.id

    let dadosComentarios = await comentarioController.selectComentariosByIdPublicacao(idPublicacao)

    response.status(dadosComentarios.status)
    response.json(dadosComentarios)
})

//Endpoint para selecionar todos os comentários do sistema
router.get('/comentario/select_all', verifyJWT, cors(), async (request, response) => {
    
    let dadosComentarios = await comentarioController.selectAllComentarios()

    response.status(dadosComentarios.status)
    response.json(dadosComentarios)
})

//Endpoint para deletar um comentario
router.delete('/comentario/:id', verifyJWT, cors(), async (request, response) => {

    let idComentario = request.params.id

    let dadosDeleteComentario = await comentarioController.deleteComentario(idComentario)

    response.status(dadosDeleteComentario.status)
    response.json(dadosDeleteComentario)
})

module.exports = router 