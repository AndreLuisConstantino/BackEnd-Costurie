/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas do usuário
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const express = require('express')
const router = express.Router();
const usuarioController = require('../controller/usuarioController.js')

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

//Endpoint para cadastrar um Usuário 
router.post('/usuario/cadastro', cors(), bodyParserJSON, async (request, response) => {
        let contentType = request.headers['content-type']

        if (String(contentType).toLowerCase() == 'application/json') {
            //Recebe os dados encaminhados na requisição
            let dadosBody = request.body

            // let dadosEmailExistente = await usuarioController.getUserByEmail(dadosBody.email)

            // if (dadosEmailExistente.message == 'O email já existe em nosso sistema') {
            //     response.status(dadosEmailExistente.status)
            //     response.json(dadosEmailExistente)
            // } else {
            //     let resultUsuarioExistente = await usuarioController.selectUserByEmailTagName(dadosBody)

            //     if (resultUsuarioExistente.message == "Usuário já existe em nosso sistema") {
            //         response.status(resultUsuarioExistente.status)
            //         response.json(resultUsuarioExistente)
            //     } else {
            //         let resultDadosUsuario = await usuarioController.insertUsuario(dadosBody)

            //         response.status(resultDadosUsuario.status)
            //         response.json(resultDadosUsuario)
            //     }
            // }
            let resultUsuarioExistente = await usuarioController.selectUserByEmailTagName(dadosBody)

            if (resultUsuarioExistente.message == 'Usuário já existe em nosso sistema') {
                response.status(resultUsuarioExistente.status)
                response.json(resultUsuarioExistente)
            } else {
                let resultDadosUsuario = await usuarioController.insertUsuario(dadosBody)

                if (resultDadosUsuario) {
                    response.status(resultDadosUsuario.status)
                    response.json(resultDadosUsuario)
                } else {
                    response.status(resultDadosUsuario.status)
                    response.json(resultDadosUsuario)
                }

            }

        } else {
            response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
            response.json(message.ERROR_INVALID_CONTENT_TYPE)
        }
})

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
router.get('/usuario/token', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    response.status(200)
    response.json({ 'Validate': 'Validado, pode usar o app ;)', status: true })
})

//Endpoint para enviar email no esqueci a senha
router.post('/usuario/esqueceu_a_senha', cors(), bodyParserJSON, async (request, response) => {

    let email = request.body

    let resultUserEmail = await usuarioController.getUserByEmail(email)

    if (resultUserEmail.message == 'O email já existe em nosso sistema') {

        const token = Math.floor(Math.random() * 1000000)

        const now = new Date()
        now.setHours(now.getHours() + 1)

        const dataFormatada = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

        let updateToken = await usuarioController.updateUserTokenAndExpires(resultUserEmail.email[0].id, token, dataFormatada)

        if (updateToken.atualizado) {
            let nodemailer = require('../module/secret.js')
            let smtp = nodemailer.smtp

            let mailOptions = {
                from: 'tcccosturie@gmail.com',
                to: email.email,
                replyTo: email,
                subject: "Olá Bem vindo!",
                text: 'Olá faça a sua redefinição de senha aqui',
                template: 'index',
                context: { token }
            }

            smtp.sendMail(mailOptions).then(info => {
                info.id = resultUserEmail.email[0].id
                response.send(info)
            }).catch(error => {
                response.send(error)
            })
        }
    } else {
        response.status(message.ERROR_EMAIL_NOT_FOUND.status)
        response.json(message.ERROR_EMAIL_NOT_FOUND)
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
router.get('/usuario/meu_perfil/:id', verifyJWT, cors(), bodyParserJSON, async (request, response) => {

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
router.put('/usuario/editar_perfil', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosUpdatePerfil = await usuarioController.updateProfileTagLocality(dadosBody)

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
router.post('/usuario/inserir_localizacao', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosInsertLocalizacao = await localizacaoController.insertLocalizacao(dadosBody)
        // console.log(dadosInsertLocalizacao);

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
router.post('/usuario/select_by_tag', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
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
router.get('/usuario/select_all', verifyJWT, cors(), bodyParserJSON, async (request, response) => {

    let dadosUsuario = await usuarioController.selectAllUsers()

    if (dadosUsuario) {
        response.status(dadosUsuario.status)
        response.json(dadosUsuario)
    } else {
        response.status(dadosUsuario.status)
        response.json(dadosUsuario)
    }
})

//Endpoint para deletar um usuário pelo id
router.delete('/usuario/:id', verifyJWT, cors(), async (request, response) => {
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