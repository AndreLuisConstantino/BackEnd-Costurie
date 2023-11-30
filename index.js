/*****************************************************************************
 * Objetivo: Criar uma API para o TCC Costuriê
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const mongoose = require('mongoose')

//Constantes MongoDB
const DB_USER = 'muryllovieira59'
const DB_PASSWORD = 'NEnQyCRQNB9CsKya'
const STRING_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@chat-tcc-costurie.lenlxrh.mongodb.net/?retryWrites=true&w=majority`
//teste

/* 

    Para rodar o servidor, basta digitar no terminal : npm run dev
    Padronizacão de commit -> "DATA [Feature implementada]"
    Import das depenencias do projeto

*/

/**
 * MongoDB:
 * 
 * Username: muryllovieira59
 * Password: 9BEzjV00xrXvFv65
 * 
 * StringConnection: mongodb+srv://muryllovieira59:$9BEzjV00xrXvFv65@chat-tcc-costurie.lenlxrh.mongodb.net/?retryWrites=true&w=majority
 **/

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
const comentarioRouter = require('./routes/comentarioRoutes.js')
const respostaComentarioRouter = require('./routes/respostasRoutes.js')
const configuracoesRouter = require('./routes/configuracoesRoutes.js')
const chatRouter = require('./routes/chatRoutes')
const messageRouter = require('./routes/messageRoutes')


//Rotas para o usuário
app.use('/', userRouter)
app.use('/', localizacaoRouter)
app.use('/', tagRouter)
app.use('/', categoriaRouter)
app.use('/', publicacaoRouter)
app.use('/', comentarioRouter)
app.use('/', respostaComentarioRouter)
app.use('/', configuracoesRouter)
app.use('/', chatRouter)
app.use('/', messageRouter)

//Conexão com o banco
mongoose
    .connect(
        STRING_CONNECTION
    )
    .then(() => {
        app.listen(3000, () => {
            console.log('Servidor aguardando requisições na porta 3000')
        })
    })
    .catch((err) => console.log(err))

/***************************************
* Objetivo: Chat com Socket.IO
* Data: 01/11/2023
* Autor: Muryllo
* Versão: 1.0
**************************************/
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: '*' } })
const chatControler = require('./routes/mongoDB/chatFunctions.js')
const mensagemController = require('./routes/mongoDB/mensagemFunctions.js')
const { log } = require('console')
var lista = []

io.on('connection', socket => {
    console.log('Usuario Conectado', socket.id);

    socket.on('createRoom', async listUsers => {
        console.log(typeof(listUsers));
        const list = JSON.parse(listUsers)

        let newChat = await chatControler.insertChat(list)

        io.emit('newChat', newChat)
    })

    socket.on('listMessages', async chat => {
        const listMessages = await chatControler.getChat(chat)

        lista = listMessages

        io.emit('receive_message', listMessages)
    })

    socket.on('listContacts', async user => {
        const listContacts = await chatControler.getListContacts(user)

        listContacts.id_user = parseInt(user)

        io.emit('receive_contacts', listContacts)
    })

    socket.on('message', async text => {
        console.log("Mensagem: " + text);

        let retornoMensagem = await mensagemController.createMessage(text.messageBy, text.messageTo, text.message, text.image, text.chatId)

        lista.mensagens.push(retornoMensagem)

        io.emit('receive_message', lista)
    })

    socket.on('deleteMessage', async message => {
        console.log(message);
        const messageDeleted = await mensagemController.deleteMessage(message)

        let newList = lista.mensagens.filter(mensagem => mensagem._id != message)

        lista.mensagens = newList

        io.emit('receive_message', lista)
    })

    socket.on('disconnect', reason => {
        console.log('Usuário desconectado');
    })
})

server.listen(3001, () => console.log('SERVER SOCKET.IO LIGADO: 3001'))