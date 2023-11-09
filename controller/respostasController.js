/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./modulo/config.js')

//Import Models
const respostasModel = require('../model/respostasModel.js')
const comentarioModel = require('../model/comentariosModel.js')
const usuarioModel = require('../model/usuarioModel.js')

const inserirResposta = async (dadosBody) => {

    if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario) ||
        dadosBody.id_comentario == '' || dadosBody.id_comentario == undefined || isNaN(dadosBody.id_comentario)
    ) {
        return message.ERROR_INVALID_ID
    } else if (dadosBody.mensagem == '' || dadosBody.mensagem == undefined || dadosBody.mensagem.length > 255) {
        return message.ERROR_MISTAKE_IN_THE_FILDS
    } else {

        let usuario = await  usuarioModel.selectUserById(dadosBody.id_usuario)

        if (usuario.length) {
            let comentario = await comentarioModel.selectComentarioByIdModel(dadosBody.id_comentario)

            if (comentario) {
                let dadosInserirResposta = await respostasModel.inserirRespostaModel(dadosBody)

                if (dadosInserirResposta) {

                    let dadosResposta = await respostasModel.selectLastIdRespostaModel()

                    let comentario = await comentarioModel.selectComentarioByIdModel(dadosBody.id_comentario)

                    let usuario = await usuarioModel.selectProfileByIdModel(dadosBody.id_usuario)

                    let usuarioJson = {
                        nome_de_usuario: usuario[0].nome_de_usuario,
                        foto: usuario[0].foto
                    }

                    let dadosRespostaJson = {}

                    dadosRespostaJson.resposta = dadosResposta
                    dadosRespostaJson.comentario = comentario
                    dadosRespostaJson.usuario = usuarioJson
                    dadosRespostaJson.message = 'Comentário inserido com sucesso'
                    dadosRespostaJson.status = 201

                    return dadosRespostaJson
                } else {
                    return message.ERROR_INTERNAL_SERVER
                }
            } else {
                return message.ERROR_COMMENTARY_NOT_FOUND
            }
        } else {
            return message.ERROR_USER_NOT_FOUND
        }
    }
}

const selectAllRespostas = async () => {

    let dadosRespostas = await respostasModel.selectAllRespostasModel()

    if (dadosRespostas) {
        let dadosRespostaJson = {}

        dadosRespostaJson.respostas = dadosRespostas
        dadosRespostaJson.status = message.SUCCES_REQUEST.status
        dadosRespostaJson.message = message.SUCCES_REQUEST.message

        return dadosRespostaJson
    } else {
        return message.ERROR_ITEM_NOT_FOUND
    }
}

const deleteResposta = async (id_resposta) => {

    if (id_resposta == '' || id_resposta == undefined || isNaN(id_resposta)) {
        return message.ERROR_INVALID_ID
    } else {
        let respostaDeletada = await respostasModel.selectRespostaById(id_resposta)

        let dadosDeleteResposta = await respostasModel.deleteRespostaModel(id_resposta)

        if (dadosDeleteResposta) {
            let dadosDeleteRespostaJson = {}

            dadosDeleteRespostaJson.message = message.SUCCESS_DELETED_ITEM.message
            dadosDeleteRespostaJson.status = message.SUCCESS_DELETED_ITEM.status
            dadosDeleteRespostaJson.resposta_deletada = respostaDeletada[0]

            return dadosDeleteRespostaJson
        } else {
            return message.ERROR_DELETED_ITEM
        }
    }
}

const selectRespostasByIdComentario = async (id_comentario) => {

    if (id_comentario == '' || id_comentario == undefined || isNaN(id_comentario)) {
        return message.ERROR_INVALID_ID
    } else {
        let comentario = await comentarioModel.selectComentarioByIdModel(id_comentario)

        if (comentario) {
            
            let dadosRespostas = await respostasModel.selectAllRespostasByIdComentario(id_comentario)

            if (dadosRespostas) {

                let dadosRespostasJson = {}

                dadosRespostasJson.message = message.SUCCESS_COMENTARY_RESPONSES_FOUND.message
                dadosRespostasJson.status = message.SUCCESS_COMENTARY_RESPONSES_FOUND.status
                dadosRespostasJson.respostas = dadosRespostas

                return dadosRespostasJson
            } else {
                return message.ERROR_COMMENTARY_RESPONSES_NOT_FOUND
            }

            
        } else {
            return message.ERROR_COMMENTARY_NOT_FOUND
        }
    }
}

module.exports = {
    inserirResposta,
    selectAllRespostas,
    deleteResposta,
    selectRespostasByIdComentario
}