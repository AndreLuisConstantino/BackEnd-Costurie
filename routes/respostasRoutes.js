/*****************************************************************************
 * Data: 30/08/2023
 * Autor: André
 * Objetivo: Arquivo para a separacao de rotas de respostas de comentário
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();

const respostasController = require('../controller/respostasController.js')

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

//Endpoint para fazer uma resposta de comentário
router.post('/respostas_comentario/inserir', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosInserirRespostaComentario = await respostasController.inserirResposta(dadosBody)

        // console.log(dadosInserirRespostaComentario);

        if (dadosInserirRespostaComentario) {
            response.status(dadosInserirRespostaComentario.status)
            response.json(dadosInserirRespostaComentario)
        } else {
            response.status(dadosInserirRespostaComentario.status)
            response.json(dadosInserirRespostaComentario)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint para selecionar todas as respostas de comentário
router.get('/respostas_comentario', verifyJWT, cors(), async (request, response) => {
    // console.log('teste');
    let dadosResposta = await respostasController.selectAllRespostas()

    response.status(dadosResposta.status)
    response.json(dadosResposta)
})

router.get('/respostas_comentario/:id_comentario', verifyJWT, cors(), async (request, response) => {

    let idComentario = request.params.id_comentario

    let dadosRespostas = await respostasController.selectRespostasByIdComentario(idComentario)

    response.status(dadosRespostas.status)
    response.json(dadosRespostas)
})

//Endpoint para deletar uma resposta de comentário
router.delete('/respostas_comentario/:id', verifyJWT, cors(), async (request, response) => {
    let idResposta = request.params.id

    let dadosDeletarResposta = await respostasController.deleteResposta(idResposta)

    response.status(dadosDeletarResposta.status)
    response.json(dadosDeletarResposta)
})

module.exports = router 