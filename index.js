/*****************************************************************************
 * Objetivo: Criar uma API para o TCC Costuriê
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

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
    console.log(token);

    const autenticidadeToken = await jwt.validateJWT(token)

    if (autenticidadeToken) {
        next()
    } else {
        return response.status(401).end()
    }
}

/* Usuário */
//Endpoint para cadastrar um Usuário 
app.post('/usuario/cadastro', cors(), bodyParserJSON, async (request, response) => {
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

//Endpoint para autenticar o Usuário
app.post('/usuario/login', cors(), bodyParserJSON, async (request, response) => {
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
app.get('/usuario/token', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
    response.status(200)
    response.json({ 'Validate': 'Validado, pode usar o app ;)', status: true })
})

//Endpoint para enviar email no esqueci a senha
app.post('/usuario/esqueceu_a_senha', cors(), bodyParserJSON, async (request, response) => {

    let email = request.body

    let resultUserEmail = await usuarioController.getUserByEmail(email)

    if (resultUserEmail.message == 'O email já existe em nosso sistema') {

        const token = Math.floor(Math.random() * 1000000)

        const now = new Date()
        now.setHours(now.getHours() + 1)

        const dataFormatada = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

        let updateToken = await usuarioController.updateUserTokenAndExpires(resultUserEmail.email[0].id, token, dataFormatada)

        if (updateToken.atualizado) {
            let nodemailer = require('./module/secret.js')
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
app.post('/usuario/validar_token', cors(), bodyParserJSON, async (request, response) => {
    let contentType = request.headers['content-type']

    let dadosBody = request.body

    if (String(contentType).toLowerCase() == 'application/json') {
        let resultToken = await usuarioController.selectTokenById(dadosBody)

        if (resultToken) {
            response.status(resultToken.status)
            response.json(resultToken)
        } else {
            response.status(resultToken.status)
            response.json(resultToken)
        }
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

app.put('/usuario/atualizar_senha', cors(), bodyParserJSON, async (request, response) => {
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

/* Personalização de perfil */
app.put('/usuario/personalizar_perfil', cors(), bodyParserJSON, async (request, response) => {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let dadosUpdatePersonalizarPerfil = await usuarioController.updateUserProfile(dadosBody)

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

/* Perfil de Usuário */
app.get('/usuario/meu_perfil/:id', verifyJWT ,cors(), bodyParserJSON, async (request, response) => {

    let usuarioId = request.params.id

    let resultDadosPerfilUsuario = await usuarioController.selectProfileById(usuarioId)
    // console.log(resultDadosPerfilUsuario);
    if (resultDadosPerfilUsuario) {
        response.status(resultDadosPerfilUsuario.status)
        response.json(resultDadosPerfilUsuario)
    } else {
        response.status(resultDadosPerfilUsuario.status)
        response.json(resultDadosPerfilUsuario)
    }
})

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))