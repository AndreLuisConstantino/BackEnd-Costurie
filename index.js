/*****************************************************************************
 * Objetivo: Criar uma API para o TCC Costuriê
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

/* 
    Para rodar o servidor, basta digitar no terminal : npm run dev
    
*/

/* 
    Padronizacão de commit -> "DATA [Feature implementada]"
*/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./controller/modulo/config.js')

/*
    Import das depenencias do projeto
*/
//Dependencia para criar as requisições da API
const express = require('express')
//Dependencia para gerenciar as permissões da API
const cors = require('cors')
//Dependencia para gerenciar o corpo de requisições da API
const bodyParser = require('body-parser')

/* Imports Controllers */
const usuarioController = require('./controller/usuarioController.js')
const localizacaoController = require('./controller/localizacaoController.js')
const tagController = require('./controller/tagController.js')
const categoriaController = require('./controller/categoriaController.js')
const tagUsuarioController = require('./controller/tagUsuarioController.js')

//Cria um objeto com as características do expresponses
const app = express()

//Permissões do cors
app.use((request, response, next) => {
    //Define quem poderá acessar a API (* = Todos)
    response.header('Acess-Control-Allow-Origin', '*')
    //Define quais métodos serão utilizados na API
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    //Atribui as permissões ao Cors
    app.use(cors())

    next()
})

//Define que os dados que iram chegar na requisição será no padrão JSON
const bodyParserJSON = bodyParser.json()

//Instanciacão de um servidor em http e a criacão de um IO
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);

//Receber o token encaminhado nas requisicões e solicitar a validacão

const verifyJWT = async (request, response, next) => {
    const jwt = require('./middleware/middlewareJWT.js')

    let token = request.headers['x-access-token']

    const autenticidadeToken = await jwt.validateJWT(token)

    if (autenticidadeToken) {
        next()
    } else {
        return response.status(401).end()
    }
}

const userRouter = require('./routes/userRoutes.js')

//Rotas para o usuário
app.use('/', userRouter)

    
    /* Localizacao*/
    
    //Endpoint para pegar todos os estados
    app.get('/localizacao/estados/', verifyJWT, cors(), bodyParserJSON, async (request, response) => {

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
    app.get('/localizacao/cidades/', verifyJWT, cors(), bodyParserJSON, async (request, response) => {

        let dadosCidades = localizacaoController.selectAllCitiesByState()
    })

    app.delete('/localizacao/:id', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
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

    /* Tag */

    //Endpoint para pegar todas as tags pela categoria
    app.post('/tag/tag_by_categoria', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
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
    app.get('/tag/:id', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
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

    app.get('/tag', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
 
        let dadosTag = await tagController.selectTagsByCategoria()

        if (dadosTag) {
            response.status(dadosTag.status)
            response.json(dadosTag)
        } else {
            response.status(dadosTag.status)
            response.json(dadosTag)
        }
    })

    app.post('/tag/inserir', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
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

   

    /* Tag Usuário */

    //Endpoint para inserir as tags do usuário
    app.post('/tag/inserir_tags', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
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


    /* Categoria */

    //Selecionar todas as categorias
    app.get('/categoria/select_all', verifyJWT, cors(), async (request, response) => {

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
    app.get('/categoria/:id', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
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

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))