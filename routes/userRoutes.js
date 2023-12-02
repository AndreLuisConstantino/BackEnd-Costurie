/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas do usuário
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();
const usuarioController = require('../controller/usuarioController.js')
const localizacaoController = require('../controller/localizacaoController.js')

const { verifyJWT } = require('../module/secret.js')

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
 
//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('../controller/modulo/config.js')

router.get('/', (request, response) => {
    response.send('Hello Worde')
})

router.post('/usuario/cadastro', cors(), bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosUsuarioRegistrado = await usuarioController.registrarUsuario(dadosBody)

        if (dadosUsuarioRegistrado) {
            response.status(dadosUsuarioRegistrado.status)
            response.json(dadosUsuarioRegistrado)
        } else {
            response.status(dadosUsuarioRegistrado.status)
            response.json(dadosUsuarioRegistrado)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint para a realização de login
router.post('/usuario/login', cors(), bodyParserJSON, async (request, response) => {
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosLogin = request.body

        let dadosResponseLogin = await usuarioController.selectUserByLogin(dadosLogin)

        if (dadosResponseLogin) {
            response.status(dadosResponseLogin.status)
            response.json(dadosResponseLogin)
        } else {
            response.status(dadosResponseLogin.status)
            response.json(dadosResponseLogin)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint para a validação de token JWT
router.get('/usuario/token',  cors(), verifyJWT, bodyParserJSON, async (request, response) => {
    response.status(200)
    response.json({ 'Validate': 'Validado, pode usar o app ;)', status: true })
})

//Endpoint para enviar o email
router.post('/usuario/esqueceu_a_senha', cors(), bodyParserJSON, async (request, response) => {

    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosSendEmail = await usuarioController.sendMail(dadosBody)

        // console.log(dadosSendEmail);

        if (dadosSendEmail) {
            response.send(dadosSendEmail)       
        } else {
            response.send(dadosSendEmail)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint para a validação do token gerado no esqueci a senha
router.post('/usuario/validar_token', cors(), bodyParserJSON, async (request, response) => {
    let contentType = request.headers['content-type']

    let dadosBody = request.body

    if (String(contentType).toLowerCase() == 'application/json') {
        let resultTag = await usuarioController.selectTokenById(dadosBody)

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

//Endpoint para a atualização de senha
router.put('/usuario/atualizar_senha', cors(), bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosUpdateSenha = await usuarioController.updateUserPassword(dadosBody)

        if (dadosUpdateSenha) {
            response.status(dadosUpdateSenha.status)
            response.json(dadosUpdateSenha)
        } else {
            response.status(dadosUpdateSenha.status)
            response.json(dadosUpdateSenha)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint que atualiza nome, foto e descrição
router.put('/usuario/personalizar_perfil', cors(), bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosUpdatePersonalizarPerfil = await usuarioController.updateUserProfile(dadosBody)

        // console.log(dadosUpdatePersonalizarPerfil);

        if (dadosUpdatePersonalizarPerfil) {
            response.status(dadosUpdatePersonalizarPerfil.status)
            response.json(dadosUpdatePersonalizarPerfil)
        } else {
            response.status(dadosUpdatePersonalizarPerfil.status)
            response.json(dadosUpdatePersonalizarPerfil)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint que pega as informações da tela de perfil
router.get('/usuario/meu_perfil/:id',  cors(), verifyJWT, bodyParserJSON, async (request, response) => {

    let usuarioId = request.params.id

    let resultDadosPerfilUsuario = await usuarioController.selectProfileById(usuarioId)
    // console.log(resultDadosPerfilUsuario); 
    // console.log(resultDadosPerfilUsuario.usuario.tags);

    if (resultDadosPerfilUsuario) {
        response.status(resultDadosPerfilUsuario.status)
        response.json(resultDadosPerfilUsuario)
    } else {
        response.status(resultDadosPerfilUsuario.status)
        response.json(resultDadosPerfilUsuario)
    }
})

//Endpoint que atualiza a tela de perfil
router.put('/usuario/editar_perfil', cors(), verifyJWT, bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body
 
        let dadosUpdatePerfil = await usuarioController.updateProfileTagLocality(dadosBody)
        // console.log(dadosUpdatePerfil);

        if (dadosUpdatePerfil) {
            response.status(dadosUpdatePerfil.status)
            response.json(dadosUpdatePerfil)
        } else {
            response.status(dadosUpdatePerfil.status)
            response.json(dadosUpdatePerfil)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//Endpoint para inserir a tela de localização
router.post('/usuario/inserir_localizacao', cors(), verifyJWT, bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosInsertLocalizacao = await localizacaoController.insertLocalizacao(dadosBody)
        // console.log(dadosInsertLocalizacao)

        if (dadosInsertLocalizacao) {
            response.status(dadosInsertLocalizacao.status)
            response.json(dadosInsertLocalizacao)
        } else {
            response.status(dadosInsertLocalizacao.status)
            response.json(dadosInsertLocalizacao)
        }

    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }

})

//Endpoint para selecionar os usuarios pela tag
router.post('/usuario/select_by_tag', cors(), verifyJWT, bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosUsuariosByTag = await usuarioController.selectAllUsuariosByTag(dadosBody)

        if (dadosUsuariosByTag) {
            response.status(dadosUsuariosByTag.status)
            response.json(dadosUsuariosByTag)
        } else {
            response.status(dadosUsuariosByTag.status)
            response.json(dadosUsuariosByTag)
        }

    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

// Endpoint para selecionar todos os usuários
router.get('/usuario/select_all', cors(), bodyParserJSON, async (request, response) => {

    let dadosUsuario = await usuarioController.selectAllUsers()

    if (dadosUsuario) {
        response.status(dadosUsuario.status)
        response.json(dadosUsuario)
    } else {
        response.status(dadosUsuario.status)
        response.json(dadosUsuario)
    }
})

//Endpoint para selecionar usuário pelo email
router.get('/usuario/:email', cors(), verifyJWT, async (request, response) => {
    let emailUsuario = request.params.email

    let dadosUsuario = await usuarioController.getUserByEmail(emailUsuario)

    response.status(dadosUsuario.status)
    response.json(dadosUsuario)
})

//Endpoint para deletar um usuário pelo id
router.delete('/usuario/:id', cors(), verifyJWT, async (request, response) => {
    let idUsuario = request.params.id

    let usuarioDeletado = await usuarioController.deleteUserById(idUsuario)

    if (usuarioDeletado) {
        response.status(usuarioDeletado.status)
        response.json(usuarioDeletado)
    } else {
        response.status(usuarioDeletado.status)
        response.json(usuarioDeletado)
    }
})

module.exports = router