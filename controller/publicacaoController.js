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
const anexosModel = require('../model/anexosModel.js')

const insertPublicacao = async (dadosBody) => {

    if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario) ||
        dadosBody.titulo == '' || dadosBody.titulo == undefined || !isNaN(dadosBody.titulo) || dadosBody.titulo.length > 45 ||
        dadosBody.descricao == '' || dadosBody.descricao == undefined || !isNaN(dadosBody.descricao)
    ) {
        return message.ERROR_REQUIRED_FIELDS
    } else if (dadosBody.tags.length == 0) {     
        return message.ERROR_TAGS_WERE_NOT_FORWARDED
    } else if (dadosBody.anexos.length == 0) {
        return message.ERROR_ATTACHMENT_WERE_NOT_FORWARDED
    } else {
        // console.log(dadosBody.tags.length);

        let dadosInsertPublicacao = await publicacaoModel.inserirPublicacaoModel(dadosBody)

        let dadosTagsInseridas = await insertTagsPublicacao(dadosBody.tags)

        let dadosAnexosInseridos = await insertAnexosPublicacao(dadosBody.anexos)

        // console.log(dadosAnexosInseridos);

        if (dadosInsertPublicacao) {
            let novaPublicacao = await publicacaoModel.selectLastIdPublicacaoModel()

            let dadosPublicacaoJson = {}

            dadosPublicacaoJson.nova_publicacao = novaPublicacao
            dadosPublicacaoJson.tags_inseridas = dadosTagsInseridas
            dadosPublicacaoJson.anexos_inseridas = dadosAnexosInseridos
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

const insertAnexosPublicacao = async (anexos) => {
    let anexosArray = []

    for (let i = 0; i < anexos.length; i++) {
        let anexo = anexos[i]

        let dadosPublicacao = await publicacaoModel.selectLastIdPublicacaoModel()

        await anexosModel.insertAnexoModel(anexo.conteudo, dadosPublicacao[0].id)
        
        let anexoAtualizado = await anexosModel.selectLastIdAnexoModel()
        
        anexosArray.push(anexoAtualizado)
    }

    return anexosArray
}

const selectAllPublications = async () => {

    let dadosPublicacao = await publicacaoModel.selectAllPublicationsModel()

    if (dadosPublicacao) {
        let dadosPublicacaoJson = {}

        dadosPublicacaoJson.publicacoes = dadosPublicacao
        dadosPublicacaoJson.status = message.SUCCES_REQUEST.status
        dadosPublicacaoJson.message = message.SUCCES_REQUEST.message

        return dadosPublicacaoJson
    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}

const selectPublicacaoById = async (id_publicacao) => {

    if (id_publicacao == '' || id_publicacao == undefined || isNaN(id_publicacao)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosPublicacao = await publicacaoModel.selectPublicacaoByIdModel(id_publicacao)

        if (dadosPublicacao) {
            let dadosPublicacaoJson = {}

            dadosPublicacaoJson.publicacao = dadosPublicacao
            dadosPublicacaoJson.status = message.SUCCES_REQUEST.status
            dadosPublicacaoJson.message = message.SUCCES_REQUEST.message

            return dadosPublicacaoJson
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }
}

const updatePublicacao = async (dadosBody) => {

    if (dadosBody.id_publicacao == '' || dadosBody.id_publicacao == undefined || isNaN(dadosBody.id_publicacao)  || 
        dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario) ||
        dadosBody.titulo == '' || dadosBody.titulo == undefined || !isNaN(dadosBody.titulo) || dadosBody.titulo.length > 45 ||
        dadosBody.anexo == '' || dadosBody.anexo == undefined || !isNaN(dadosBody.anexo) ||
        dadosBody.descricao == '' || dadosBody.descricao == undefined || !isNaN(dadosBody.descricao) || dadosBody.descricao.length > 500
        ) {
         return message.ERROR_MISTAKE_IN_THE_FILDS   
    } else {

        let dadosUpdatePublicacao = await publicacaoModel.updatePublicacaoModel(dadosBody)

        if (dadosUpdatePublicacao) {
            let dadosUpdatePublicacaoJson = {}

            let novaPublicacao = await publicacaoModel.selectPublicacaoByIdModel(dadosBody.id_publicacao)

            dadosUpdatePublicacaoJson.publicacao_atualizada = novaPublicacao[0]
            dadosUpdatePublicacaoJson.message = message.SUCCESS_UPDATED_ITEM.message
            dadosUpdatePublicacaoJson.status = message.SUCCESS_UPDATED_ITEM.status
            
            return dadosUpdatePublicacaoJson
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }
}

const deletePublicacao = async (id_publicacao) => {

    if (id_publicacao == '' || id_publicacao == undefined || id_publicacao == null || isNaN(id_publicacao)) {
        return message.ERROR_INVALID_ID
    } else {

        let publicacaoDeletada = await publicacaoModel.selectPublicacaoByIdModel(id_publicacao)

        let dadosPublicacaoDeletada = await publicacaoModel.deletePublicacaoModel(id_publicacao)

        if (dadosPublicacaoDeletada) {

            let dadosPublicacaoJson = {}

            dadosPublicacaoJson.publicacao_deletada = publicacaoDeletada
            dadosPublicacaoJson.message = message.SUCCESS_DELETED_ITEM.message
            dadosPublicacaoJson.status = message.SUCCESS_DELETED_ITEM.status

            return dadosPublicacaoJson
        } else {
            return message.ERROR_DELETED_ITEM
        }
    }
}

module.exports = {
    insertPublicacao,
    selectAllPublications,
    selectPublicacaoById,
    updatePublicacao,
    deletePublicacao
}