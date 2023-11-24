/**************************************************************************************
 *  Objetivo: ROTAS DA ENTIDADE MENSAGEM
 *  Autor: Muryllo Vieira
 *  Data: 24/10/2023
 *  Versão: 1.0
 **************************************************************************************/

const Message = require('../model_mongodb/message.js')
const router = require('express').Router()
const message = require('../controller/modulo/config.js')
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment')    
const bodyParserJSON = bodyParser.json();

router.post('/message', bodyParserJSON, cors(), async (request, response) => {

    const { messageBy, messageTo, message, image, chatId } = request.body

    if (
        !messageBy || messageBy == undefined || isNaN(messageBy) ||
        !messageTo || messageTo == undefined || isNaN(messageTo) ||
        message == undefined ||
        !chatId || chatId == undefined ||
        image == undefined
    ) {
        console.log('testezika');
        response.status(404).json(`Morreu, mBy: ${messageBy}, mTo: ${messageTo}, m: ${message}, chat: ${chatId}`)
    } else {
        const data_criacao = moment().format("YYYY-MM-DD")
        const hora_criacao = moment().format("HH:mm:ss")

        const mensagem = {
            messageBy,
            messageTo,
            message,
            image,
            data_criacao,
            hora_criacao,
            chatId
        }

        // console.log(mensagem);

        try {
            await Message.create(mensagem)

            response.status(201).json({status: 201, message: 'mensagem criada com sucesso!', mensagem: mensagem})
        } catch (error) {
            response.status(500).json(error)
        }
    }
})

router.get('/message/:idChat', cors(), async (request, response) => {
    const idChat = request.params.idChat;

    try {
        const result = await Message.find({ chatId: idChat });

        // console.log(result);

        if (result.length != 0) {
            // console.log('testezika');
            let listMessages = []

            for (let i = 0; i < result.length; i++) {

                const mensagem = result[i];

                const newMessage = {
                    id_message: mensagem._id.toString(),
                    messageBy: mensagem.messageBy,
                    messageTo: mensagem.messageTo,
                    message: mensagem.message,
                    data_criacao: mensagem.date,
                    hora_criacao: mensagem.hour,
                    chatId: mensagem.chatId
                }

                listMessages.push(newMessage)
            }

            // console.log(listMessages);

            let dadosJSON = {
                status: 200,
                message: 'Requisição feita com sucesso!',
                mensagens: listMessages
            }

            // console.log(dadosJSON);

            response.status(200).json(dadosJSON);
        } else {
            response.status(404).json({ config: 'Nenhum chat encontrado para o usuário fornecido' });
        }
    } catch (err) {
        response.status(500).json({ error: err });
    }
});

router.put('/message/:idMensagem', bodyParserJSON, cors(), async (request, response) => {

    const idMessage = request.params.idMensagem;

    if (
        idMessage == null || idMessage == undefined || idMessage == ''
    ) {
        response.status(config.ERROR_REQUIRE_FIELDS.status).json(config.ERROR_REQUIRE_FIELDS)
    } else {

        const message = await Message.findOne({ _id: idMessage })

        if (!message) {
            response.status(config.ERROR_REGISTER_NOT_FOUND.status).json(config.ERROR_REGISTER_NOT_FOUND)
        } else {
            message.status = false
            await Message.updateOne({ _id: idMessage }, message)

            const lista = await getChat(message.chatId)

            response.status(200).json(lista)
        }
    }
})

module.exports = router