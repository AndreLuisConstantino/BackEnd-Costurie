/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/10/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require("../controller/modulo/config.js");

//Imports
const moment = require('moment')

const Message = require('../model_mongodb/message.js')
const Chat = require('../model_mongodb/chat.js')
const config = require('../model_mongodb/modulo/config.js')

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client')

//Instancia da Classe PrismaClient 
var prisma = new PrismaClient()

const createChat = async (users, chatId) => {

    if (
        !users || users.length == 0 || users == undefined || users == "" ||
        !chatId || chatId == ""
    ) {
        return config.ERROR_REQUIRE_FIELDS
    } else {
        for (let i = 0; i < users.length; i++) {
            const idUser = users[i].id;

            const sql = `insert into tbl_chat(id_mongo, id_usuario) values ("${chatId}", ${idUser})`

            const resultStatus = await prisma.$executeRawUnsafe(sql)

            if (!resultStatus)
                return config.ERROR_INTERNAL_SERVER
        }

        const lastIds = `select * from tbl_chat order by id desc limit 2`

        const rsChat = await prisma.$queryRawUnsafe(lastIds)

        const dadosJSON = {
            status: config.SUCCESS_REQUEST.status,
            config: config.SUCCESS_REQUEST.config,
            chat: rsChat
        }

        if (lastIds.length > 0) {
            return dadosJSON
        } else {
            return config.ERROR_INTERNAL_SERVER.status
        }
    }
}

const getChat = async (idChat) => {

    try {
        const resultChat = await Chat.findOne({ _id: idChat });

        if (resultChat) {
            const listMessages = await Message.find({ chatId: idChat, status: true })

            const dadosJSON = {
                status: config.SUCCESS_REQUEST.status,
                message: config.SUCCESS_REQUEST.message,
                id_chat: resultChat._id,
                usuarios: resultChat.users,
                data_criacao: resultChat.data_criacao,
                hora_criacao: resultChat.hora_criacao,
                mensagens: listMessages
            }

            return dadosJSON
        } else {
            return config.ERROR_CHAT_NOT_FOUND
        }
    } catch (err) {
        return config.ERROR_INTERNAL_SERVER
    }
}

const getListContacts = async (idUsuario) => {
    try {
        const result = await Chat.find({ 'users.id': parseInt(idUsuario) });

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

            return { users: listUsers }
        } else {
            return config.ERROR_CHAT_NOT_FOUND
        }
    } catch (err) {
        return config.ERROR_INTERNAL_SERVER
    }
}

const insertChat = async (usuarios) => {
    console.log(usuarios);

    if (
        !usuarios || usuarios.length == 0 || usuarios == undefined
    ) {
        response.status(config.ERROR_REQUIRE_FIELDS.status).json(config.ERROR_REQUIRE_FIELDS)
    } else {
        const data_criacao = moment().format("YYYY-MM-DD")
        const hora_criacao = moment().format("HH:mm:ss")

        let users = usuarios.users

        const chat = {
            users,
            data_criacao,
            hora_criacao
        }

        try {
            const verificarChat = await Chat.find({
                $and: [
                  { 'users.id': users[0].id },
                  { 'users.id': users[1].id }
                ]
              })

            if (verificarChat.length > 0) {
                const chatOld = await getChat(verificarChat[0]._id.toString())

                return chatOld
            } else {
                await Chat.create(chat)

                const lastChat = await Chat.find({}).sort({ _id: -1 }).limit(1)

                const lastId = lastChat[0]._id.toString()

                //const insertSQL = await createChat(users, lastId)

                const newChat = await getChat(lastChat)

                return newChat
            }
        } catch (error) {
            return config.ERROR_INTERNAL_SERVER
        }
    }
}

module.exports = {
    createChat,
    getChat,
    getListContacts,
    insertChat
}