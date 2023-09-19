/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 19/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const localizacaoModel = require('../model/localizacaoModel.js')

const selectAllStates = async () => {
    let dadosEstadosJson = {}

    let estadosResult = await localizacaoModel.selectAllStatesModel()

    if (estadosResult) {
        dadosEstadosJson.estados = estadosResult
        dadosEstadosJson.message = 'Requisição de Estados concluida'
        dadosEstadosJson.status = 200
        
        return dadosEstadosJson
    } else {
        dadosEstadosJson.message = 'Falha ao pegar os estados'
        dadosEstadosJson.status = 400

        return dadosEstadosJson
    }
}

module.exports = {
    selectAllStates
}