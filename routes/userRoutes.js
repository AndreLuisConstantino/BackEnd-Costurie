/*****************************************************************************
 * Objetivo: Arquivo para a separacao de rotas do usuário
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

// const express = require('express')
// const {verifyJWT} = require('../index.js')
// const router = express.Router();
// const usuarioController = require('../controller/usuarioController.js')

// //Dependencia para gerenciar as permissões da API
// const cors = require('cors')
// //Dependencia para gerenciar o corpo de requisições da API
// const bodyParser = require('body-parser')

// //Define que os dados que iram chegar na requisição será no padrão JSON
// const bodyParserJSON = bodyParser.json()

// router.get('/usuario/select_all', verifyJWT, cors(), bodyParserJSON, async (request, response) => {

//     let dadosUsuario = await usuarioController.selectAllUsers()

//     if (dadosUsuario) {
//         response.status(dadosUsuario.status)
//         response.json(dadosUsuario)
//     } else {
//         response.status(dadosUsuario.status)
//         response.json(dadosUsuario)
//     }
// })

// module.exports = router