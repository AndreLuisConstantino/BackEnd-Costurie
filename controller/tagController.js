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



module.exports = {
    selectAllTagsByCategoria
}