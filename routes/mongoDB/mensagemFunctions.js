/**************************************************************************************
 *  Objetivo: FUNÇÕES DE CONTROLE DE DADOS DA ENTIDADE CHAT
 *  Autor: Luiz Gustavo
 *  Data: 24/11/2023
 *  Versão: 1.0
 **************************************************************************************/

const Message = require('../../model_mongodb/message.js')
const config = require('../../model_mongodb/modulo/config.js')
const moment = require('moment')

const createMessage = async ( messageBy, messageTo, message, image, chatId) => {

   if (
       messageBy == null || messageBy == undefined || isNaN(messageBy) ||
       messageTo == null  || messageTo == undefined || isNaN(messageTo) ||
       message == undefined ||
       chatId == null  || chatId == undefined
   ) {
       return config.ERROR_REQUIRE_FIELDS
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

       try {
           let newMessage = await Message.create(mensagem)

           return newMessage
       } catch (error) {
           return error
       }
   }
}

const deleteMessage = async (idMessage) => {
   if(
       idMessage == null || idMessage == undefined || idMessage == ''
   ){
       return config.ERROR_REQUIRE_FIELDS
   }else{

       const message = await Message.findOne({_id: idMessage})

       if(!message){
           return config.ERROR_REGISTER_NOT_FOUND
       }else{
           message.status = false
           await Message.updateOne({_id: idMessage}, message)

           return true
       }
   }
}

module.exports = {
   createMessage,
   deleteMessage
}