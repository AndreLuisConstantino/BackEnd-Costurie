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
var tagUsuarioModel = require('../model/tagUsuarioModel.js')
const e = require('express')
// var usuarioModel = require('../model/usuarioModel.js')


const selectAllTagsByCategoria = async (dadosBody) => {
    let status = false

    if (dadosBody.categoria == '' || dadosBody.categoria == undefined || !isNaN(dadosBody.categoria)) {
        return message.ERROR_REQUIRED_FIELDS
    } else {
        if (String(dadosBody.categoria).toUpperCase() == 'GERAL') {
            let allTags = await tagModel.selectAllTagsModel()

            if (allTags) {
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

const insertTags = async (dadosBody) => {

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
    let dadosTagsArray = []

    let dadosCategoria = await categoriaModel.selectAllCategorias()

    // console.log(dadosCategoria);

    if (dadosCategoria.length) {

        for (let i = 0; i < dadosCategoria.length; i++) {
            let categoriaIndex = dadosCategoria[i]

            let dadosTagsByCategoria = await tagModel.selectAllTagsByCategoriaIdModel(categoriaIndex.id)

            // categoriaIndex.tags = dadosTagsByCategoria

            dadosTagsArray.push(dadosTagsByCategoria)
        }

        if (dadosTagsArray) {
            let dadosTagsJson = {}

            dadosTagsJson.categorias_e_tags = dadosTagsArray
            dadosTagsJson.message = message.SUCCESS_CATEGORY_FOUND.message
            dadosTagsJson.status = message.SUCCESS_CATEGORY_FOUND.status

            return dadosTagsJson
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    } else {
        return message.ERROR_CATEGORIES_NOT_FOUND
    }
}

module.exports = {
    selectAllTagsByCategoria,
    insertTags,
    selectTagById,
    selectTagsByCategoria
}