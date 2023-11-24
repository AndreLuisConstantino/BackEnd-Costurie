/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./modulo/config.js')

/* Imports Models */
var tagModel = require('../model/tagModel.js')
var tagUsuarioModel = require('../model/tagUsuarioModel.js')


const insertTagsUsuario = async (dadosBody) => {

    if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario)) {
        return message.ERROR_REQUIRED_FIELDS
    } else {
        let tagsAtualizadas = []

        for (let i = 0; i < dadosBody.tags.length; i++) {
            let tag = dadosBody.tags[i]

            await tagUsuarioModel.insertTagUsuario(tag.id, dadosBody.id_usuario)

            let tagUsuarioAtualizada = await tagUsuarioModel.selectTagUsuarioLastId()

            let tagAtualizada = await tagModel.selectTagByIdModel(tagUsuarioAtualizada[0].id_tag)

            tagsAtualizadas.push(tagAtualizada[0])
        }


        if (tagsAtualizadas.length > 0) {
            let dadosTagJson = {}

            dadosTagJson.tags = tagsAtualizadas
            dadosTagJson.message = message.SUCCESS_CREATED_ITEM.message
            dadosTagJson.status = message.SUCCESS_CREATED_ITEM.status

            return dadosTagJson
        } else {
            return message.ERROR_NOT_POSSIBLE_INSERT_TAGS
        }
    }
}

module.exports = {
    insertTagsUsuario
}