/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 25/09/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./modulo/config.js')

/* Imports Models */
var categoriaModel = require('../model/categoriaModel.js')
var tagModel = require('../model/tagModel.js')
// var usuarioModel = require('../model/usuarioModel.js')


const selectAllTagsByCategoria = async (dadosBody) => {
    let status = false

    if (dadosBody.categoria == '' || dadosBody.categoria == undefined || !isNaN(dadosBody.categoria)) {
        return message.ERROR_REQUIRED_FIELDS
    } else {
        if (String(dadosBody.categoria).toUpperCase() == 'GERAL') {
            let allTags = await tagModel.selectAllTagsModel()

            if (allTags) {
                // console.log(allTags);
                let dadosTagJson = {}

                dadosTagJson.tags = allTags
                dadosTagJson.message = message.SUCCESS_CATEGORY_FOUND.message
                dadosTagJson.status = message.SUCCESS_CATEGORY_FOUND.status

                return dadosTagJson
            } else {
                return message.ERROR_CATEGORY_NOT_FOUND
            }
        }

        let allCategorias = await categoriaModel.selectAllCategorias()

        if (allCategorias) {

            allCategorias.forEach((categoria) => {

                if (String(categoria.nome).toUpperCase() == String(dadosBody.categoria).toUpperCase()) {
                    status = true
                }
            })

            if (status) {
                let tagsByCategoria = await tagModel.selectAllTagsByCategoriaModel(dadosBody.categoria)

                if (tagsByCategoria) {
                    let dadosTagJson = {}

                    dadosTagJson.tags = tagsByCategoria
                    dadosTagJson.message = message.SUCCESS_CATEGORY_FOUND.message
                    dadosTagJson.status = message.SUCCESS_CATEGORY_FOUND.status

                    return dadosTagJson
                }
            } else {
                return message.ERROR_CATEGORY_NOT_FOUND
            }

        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }
}

const insertTag = async (dadosBody) => {

    if (dadosBody.nome == '' || dadosBody.nome == undefined || dadosBody.nome.length > 100 || !isNaN(dadosBody.nome) ||
        dadosBody.imagem == '' || dadosBody.imagem == undefined || !isNaN(dadosBody.imagem) ||
        dadosBody.id_categoria == '' || dadosBody.id_categoria == undefined || isNaN(dadosBody.id_categoria)
    ) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosInsertTag = await tagModel.insertTagModel(dadosBody)

        if (dadosInsertTag) {
            let dadosTagJson = {}

            let tagInserida = await tagModel.selectTagLastID()

            dadosTagJson.tag_inserida = tagInserida
            dadosTagJson.message = 'Tag inserida com sucesso'
            dadosTagJson.status = 201

            return dadosTagJson
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }
}

const selectTagById = async (id) => {

    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosTag = await tagModel.selectTagByIdModel(id)

        if (dadosTag) {
            let dadosTagJson = {}

            dadosTagJson.tag = dadosTag[0]
            dadosTagJson.message = 'Tag encontrada com sucesso!'
            dadosTagJson.status = 200

            return dadosTagJson
        } else {
            return message.ERROR_ITEM_NOT_FOUND
        }
    }
}

const selectTagsByCategoria = async () => {
    let dadosTags = await tagModel.selectAllTagsInCategoriaModel()

    if (dadosTags) {
        let dadosTagJson = {}

        dadosTagJson.tags = dadosTags
        dadosTagJson.message = message.SUCCESS_CATEGORY_FOUND.message
        dadosTagJson.status = message.SUCCESS_CATEGORY_FOUND.status

        return dadosTagJson
    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    selectAllTagsByCategoria,
    selectTagById,
    selectTagsByCategoria,
    insertTag
}