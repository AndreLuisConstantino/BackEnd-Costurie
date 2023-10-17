/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./modulo/config.js')

//Import models
const publicacaoModel = require('../model/publicacaoModel.js')
const tagPublicacaoModel = require('../model/tagPublicacaoModel.js')
const tagModel = require('../model/tagModel.js')

const insertPublicacao = async (dadosBody) => {

    if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario) ||
        dadosBody.titulo == '' || dadosBody.titulo == undefined || !isNaN(dadosBody.titulo) || dadosBody.titulo.length > 45 ||
        dadosBody.descricao == '' || dadosBody.descricao == undefined || !isNaN(dadosBody.descricao) ||
        dadosBody.anexo == '' || dadosBody.anexo == undefined || !isNaN(dadosBody.anexo) || dadosBody.length == 0
    ) {
        return message.ERROR_REQUIRED_FIELDS
    } else if (dadosBody.tags.length == 0) {
        return message.ERROR_TAGS_WERE_NOT_FORWARDED
    } else {
        // console.log(dadosBody.tags.length);

        let dadosInsertPublicacao = await publicacaoModel.inserirPublicacaoModel(dadosBody)

        let dadosTagsInseridas = await insertTagsPublicacao(dadosBody.tags)

        if (dadosInsertPublicacao) {
            let novaPublicacao = await publicacaoModel.selectLastIdPublicacaoModel()

            let dadosPublicacaoJson = {}

            dadosPublicacaoJson.nova_publicacao = novaPublicacao
            dadosPublicacaoJson.tags_inseridas = dadosTagsInseridas
            dadosPublicacaoJson.message = message.SUCCESS_CREATED_ITEM.message
            dadosPublicacaoJson.status = message.SUCCESS_CREATED_ITEM.status

            return dadosPublicacaoJson
        } else {
            return message.ERROR_NOT_POSSIBLE_INSERT_PUBLICATION
        }
    }
}

const insertTagsPublicacao = async (tags) => {
    let tagsArray = []

    // console.log(tags);

    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i]

        let dadosPublicacao = await publicacaoModel.selectLastIdPublicacaoModel()

        // console.log(dadosPublicacao);

        await tagPublicacaoModel.insertTagPublicacaoModel(tag.id_tag, dadosPublicacao[0].id)

        let tagPublicacaoAtualizada = await tagPublicacaoModel.selectLastId()

        let tagAtualizada = await tagModel.selectTagByIdModel(tagPublicacaoAtualizada[0].id_tag)

        tagsArray.push(tagAtualizada[0])
    }

    return tagsArray
}

module.exports = {
    insertPublicacao
}