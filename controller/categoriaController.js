/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/10/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require("../controller/modulo/config.js");

const categoriaModel = require('../model/categoriaModel.js')

const selectAllCategories = async () => {
    
    let dadosCategorias = await categoriaModel.selectAllCategorias()

    if (dadosCategorias) {
        let dadosCategoriasJson = {}

        dadosCategoriasJson.cateorias = dadosCategorias
        dadosCategoriasJson.message = message.SUCCESS_CATEGORIES_FOUND.message
        dadosCategoriasJson.status = message.SUCCESS_CATEGORIES_FOUND.status

        return dadosCategoriasJson
    } else {
        return message.ERROR_CATEGORY_NOT_FOUND
    }
}

const selectCategoriaById = async (id) => {

    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosCategoria = await categoriaModel.selectCategoriasByIdModel(id)

        if (dadosCategoria) {
            let dadosCategoriaJson = {}

            dadosCategoriaJson.categoria = dadosCategoria[0]
            dadosCategoriaJson.message = 'Categoria achada com sucesso'
            dadosCategoriaJson.status = 200

            return dadosCategoriaJson
        } else {
            return message.ERROR_CATEGORY_NOT_FOUND
        }
    }
}

module.exports = {
    selectAllCategories,
    selectCategoriaById
}