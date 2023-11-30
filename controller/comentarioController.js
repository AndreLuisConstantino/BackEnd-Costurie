/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./modulo/config.js')

//Import models
let comentarioModel = require('../model/comentariosModel.js')
let usuarioModel = require('../model/usuarioModel.js')
let respostasModel = require('../model/respostasModel.js')
let publicacaoModel = require('../model/publicacaoModel.js')

const insertComentario = async (dadosBody) => {

    if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario) ||
        dadosBody.id_publicacao == '' || dadosBody.id_publicacao == undefined || isNaN(dadosBody.id_publicacao)
    ) {
        return message.ERROR_INVALID_ID
    } else if (dadosBody.mensagem == '' || dadosBody.mensagem == undefined || !isNaN(dadosBody.mensagem) || dadosBody.mensagem > 255) {
        return message.ERROR_REQUIRED_FIELDS
    } else {

        let usuario = await usuarioModel.selectUserById(dadosBody.id_usuario)

        if (usuario) {
            let publicacao = await publicacaoModel.selectPublicacaoByIdModel(dadosBody.id_publicacao)

            if (publicacao) {
                let dadosInserirComentario = await comentarioModel.insertComentarioModel(dadosBody)

                if (dadosInserirComentario) {
                    let inserirComentarioJson = {}

                    let comentario = await comentarioModel.selectLastIdComentarioModel()

                    inserirComentarioJson.comentario = comentario[0]
                    inserirComentarioJson.message = message.SUCCESS_CREATED_ITEM.message
                    inserirComentarioJson.status = message.SUCCESS_CREATED_ITEM.status

                    return inserirComentarioJson
                } else {
                    return message.ERROR_NOT_POSSIBLE_INSERT_COMMENT
                }
            } else {
                return message.ERROR_PUBLICATION_NOT_FOUND
            }
        } else {
            return message.ERROR_USER_NOT_FOUND
        }
    }
}

const selectComentariosByIdPublicacao = async (id_publicacao) => {

    if (id_publicacao == '' || id_publicacao == undefined || isNaN(id_publicacao)) {
        return message.ERROR_INVALID_ID
    } else {

        let publicacao = await publicacaoModel.selectPublicacaoByIdModel(id_publicacao)

        if (publicacao) {
            let dadosComentarios = await comentarioModel.selectComentariosByIdPublicacaoModel(id_publicacao)

            for (let i = 0; i < dadosComentarios.length; i++) {
                let arrayRespostas = []

                let comentario = dadosComentarios[i]

                // console.log(comentario.id_usuario);

                let usuario = await usuarioModel.selectUserById(comentario.id_usuario)

                // console.log(usuario);

                let respostas = await respostasModel.selectAllRespostasByIdComentario(comentario.id)
                // console.log(respostas);

                if (respostas) {
                    for (let i = 0; i < respostas.length; i++) {
                        let resposta = respostas[i]

                        let usuarioResposta = await usuarioModel.selectUserById(resposta.id_usuario)

                        // console.log(resposta);

                        let usuarioRespostaJson = {
                            nome_de_usuario: usuarioResposta[0].nome_de_usuario,
                            foto: usuarioResposta[0].foto
                        }

                        resposta.usuario = usuarioRespostaJson

                        arrayRespostas.push(resposta)

                        comentario.respostas = arrayRespostas
                    }
                } else {
                    comentario.respostas = []
                }

                let usuarioJson = {
                    nome_de_usuario: usuario[0].nome_de_usuario,
                    foto: usuario[0].foto
                }

                comentario.usuario = usuarioJson
            }

            if (dadosComentarios) {
                let dadosComentariosJson = {}

                dadosComentariosJson.comentarios = dadosComentarios
                dadosComentariosJson.message = message.SUCCES_REQUEST.message
                dadosComentariosJson.status = message.SUCCES_REQUEST.status

                return dadosComentariosJson
            } else {
                return message.ERROR_ITEM_NOT_FOUND
            }
        } else {
            return message.ERROR_PUBLICATION_NOT_FOUND
        }
    }
}

const selectAllComentarios = async () => {

    let dadosComentarios = await comentarioModel.selectAllComentariosModel()

    if (dadosComentarios) {
        let dadosComentariosJson = {}

        dadosComentariosJson.comentarios = dadosComentarios
        dadosComentariosJson.message = message.SUCCES_REQUEST.message
        dadosComentariosJson.status = message.SUCCES_REQUEST.status

        return dadosComentariosJson
    } else {
        return message.ERROR_ITEM_NOT_FOUND
    }
}

const deleteComentario = async (id_comentario) => {

    if (id_comentario == '' || id_comentario == undefined || isNaN(id_comentario)) {
        return message.ERROR_INVALID_ID
    } else {

        let comentarioExcluido = await comentarioModel.selectComentarioByIdModel(id_comentario)

        let excluirComentario = await comentarioModel.deleteComentarioModel(id_comentario)

        if (excluirComentario) {
            let dadosDeleteComentarioJson = {}

            dadosDeleteComentarioJson.comentario_excluido = comentarioExcluido[0]
            dadosDeleteComentarioJson.message = message.SUCCESS_DELETED_ITEM.message
            dadosDeleteComentarioJson.status = message.SUCCESS_DELETED_ITEM.status

            return dadosDeleteComentarioJson
        } else {
            return message.ERROR_DELETED_ITEM
        }
    }
}

module.exports = {
    insertComentario,
    selectComentariosByIdPublicacao,
    selectAllComentarios,
    deleteComentario
}