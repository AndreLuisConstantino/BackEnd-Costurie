/**************************************************************************************
 *  Objetivo: ROTAS DA ENTIDADE CHAT
 *  Autor: Muryllo Vieira
 *  Data: 24/10/2023
 *  Versão: 1.0
 **************************************************************************************/
const router = require('express').Router()
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment')
const bodyParserJSON = bodyParser.json();

const {createChat, getChat, getListContacts, insertChat} = require('../controller/chatController.js')

const Message = require('../model_mongodb/message.js')
const Chat = require('../model_mongodb/chat.js')
const chatFunctions = require('../controller/chatController.js')
const config = require('../model_mongodb/modulo/config.js')

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client')

//Instancia da Classe PrismaClient 
var prisma = new PrismaClient()

router.post('/chat', bodyParserJSON, cors(), async (request, response) => {
    const { users } = request.body

    if (
        !users || users.length == 0 || users == undefined
    ) {
        response.status(config.ERROR_REQUIRE_FIELDS.status).json(config.ERROR_REQUIRE_FIELDS)
    } else {
        const data_criacao = moment().format("YYYY-MM-DD")
        const hora_criacao = moment().format("HH:mm:ss")

        const chat = {
            users,
            data_criacao,
            hora_criacao
        }

        try {
            const verificarChat = await Chat.find({ 'users.id': users[0].id && users[1].id })

            if (verificarChat.length > 0) {
                const chatOld = await chatFunctions.getChat(verificarChat[0]._id.toString())

                response.status(200).json(chatOld)
            } else {
                await Chat.create(chat)

                const lastChat = await Chat.find({}).sort({ _id: -1 }).limit(1)

                const lastId = lastChat[0]._id.toString()

                //const insertSQL = await createChat(users, lastId)

                const newChat = await chatFunctions.getChat(lastChat)

                response.status(200).json(newChat)
            }
        } catch (error) {
            response.status(config.ERROR_INTERNAL_SERVER.status).json(config.ERROR_INTERNAL_SERVER)
        }
    }
});

router.get('/chat/user/:idUsuario', cors(), async (request, response) => {
    const idUsuario = request.params.idUsuario;

    try {
        const result = await Chat.find({ 'users.id': parseInt(idUsuario)});

        if (result) {
            let listUsers = []

            for (let i = 0; i < result.length; i++) {

                const user = result[i];

                const newUser = {
                    id_chat: user._id.toString(),
                    users: user.users,
                    isGroup: user.isGroup,
                    data_criacao: user.data_criacao,
                    hora_criacao: user.hora_criacao
                }

                listUsers.push(newUser)
            }

            const dadosJSON = {
                status: config.SUCCESS_REQUEST.status,
                message: config.SUCCESS_REQUEST.message,
                usuarios: listUsers
            }

            response.status(dadosJSON.status).json(dadosJSON);
        } else {
            response.status(config.ERROR_CHAT_NOT_FOUND.status).json(config.ERROR_CHAT_NOT_FOUND);
        }
    } catch (err) {
        response.status(config.ERROR_INTERNAL_SERVER.status).json(config.ERROR_INTERNAL_SERVER);
    }
});

module.exports = router