/*****************************************************************************
 * Objetivo: Criar uma API para o TCC Costuriê
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

/* 

    Para rodar o servidor, basta digitar no terminal : npm run dev
    Padronizacão de commit -> "DATA [Feature implementada]"
    Import das depenencias do projeto

*/

//Dependencia para criar as requisições da API
const express = require('express')
//Dependencia para gerenciar as permissões da API
const cors = require('cors')

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

//Imports das rotas
const userRouter = require('./routes/userRoutes.js')
const localizacaoRouter = require('./routes/localizacaoRoutes.js')
const tagRouter = require('./routes/tagRoutes.js')
const categoriaRouter = require('./routes/categoriaRoutes.js')
const publicacaoRouter = require('./routes/publicacaoRoutes.js')

//Rotas para o usuário
app.use('/', userRouter)
app.use('/', localizacaoRouter)
app.use('/', tagRouter)
app.use('/', categoriaRouter)
app.use('/', publicacaoRouter)

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))