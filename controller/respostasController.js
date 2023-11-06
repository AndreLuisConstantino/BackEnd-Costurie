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


const inserirResposta = async (dadosBody) => {

    if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario) ||
        dadosBody.id_comentario == '' || dadosBody.id_comentario == undefined || isNaN(dadosBody.id_comentario)
    ) {
        return message.ERROR_INVALID_ID
    } else if (dadosBody.mensagem == '' || dadosBody.mensagem == undefined || dadosBody.mensagem.length > 255) {
        return message.ERROR_MISTAKE_IN_THE_FILDS
    } else {

        let dadosInserirResposta = await respostasModel.inserirRespostaModel(dadosBody)

        if (dadosInserirResposta) {

            let dadosResposta = await respostasModel.selectLastIdRespostaModel()

            let comentario = await comentarioModel.selectComentarioByIdModel(dadosBody.id_comentario)

            let dadosRespostaJson = {}

            dadosRespostaJson.resposta = dadosResposta
            dadosRespostaJson.comentario = comentario
            dadosRespostaJson.message = 'Comentário inserido com sucesso'
            dadosRespostaJson.status = 201

            return dadosRespostaJson
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }
}

module.exports = {
    inserirResposta
}