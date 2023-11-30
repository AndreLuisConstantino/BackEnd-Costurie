/******************************
 *  Objetivo: CRIAÇÃO DA ENTIDADE DE BANCO - CHAT
 *  Autor: MURYLLO VIEIRA
 *  Data: 24/10/2023
 *  Versão: 1.0
 ******************************/

const mongoose = require('mongoose')

const Chat = mongoose.model('Chat', {
    users: Array, //{id: Int, nome: String, foto: String, status_usuario: true}
    isGroup: {
        type: Boolean,
        default: false
    },
    data_criacao: Date,
    hora_criacao: String
})
//tfff

module.exports = Chat