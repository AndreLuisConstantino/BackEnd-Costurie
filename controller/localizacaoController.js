/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 19/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require("../controller/modulo/config.js");

/* Imports Models */
const usuarioModel = require("../model/usuarioModel.js");
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

const insertLocalizacao = async (dadosLocalizacao) => {

    if (dadosLocalizacao.id_usuario == '' || dadosLocalizacao.id_usuario == undefined || isNaN(dadosLocalizacao.id_usuario) ||
        dadosLocalizacao.estado == '' || dadosLocalizacao.estado == undefined || !isNaN(dadosLocalizacao.estado) || dadosLocalizacao.estado.length > 255 ||
        dadosLocalizacao.cidade == '' || dadosLocalizacao.cidade == undefined || !isNaN(dadosLocalizacao.cidade) || dadosLocalizacao.cidade.length > 255 ||
        dadosLocalizacao.bairro == '' || dadosLocalizacao.bairro == undefined || !isNaN(dadosLocalizacao.bairro) || dadosLocalizacao.bairro.length > 255) {
        return message.ERROR_MISTAKE_IN_THE_FILDS
    } else {

        let usuario = await usuarioModel.selectUserByIdModel(dadosLocalizacao.id_usuario)

        if (usuario) {
            let dadosInsertLocalizacao = await localizacaoModel.insertLocalizacaoModel(dadosLocalizacao)

            if (dadosInsertLocalizacao) {
                let usuario = await usuarioModel.selectUserByIdModel(dadosLocalizacao.id_usuario)

                let novaLocalizacao = await localizacaoModel.selectLastId()

                let dadosLocalizacaoJson = {}
                dadosLocalizacaoJson.usuario = usuario
                dadosLocalizacaoJson.novaLocalizacao = novaLocalizacao
                dadosLocalizacaoJson.message = message.SUCCESS_CREATED_ITEM.message
                dadosLocalizacaoJson.status = message.SUCCESS_CREATED_ITEM.status

                return dadosLocalizacaoJson
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_USER_NOT_FOUND
        }


    }
}

const deleteLocalizacao = async (id) => {

    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosLocalizacaoDeletada = await localizacaoModel.selectLocalizacaoByIdModel(id)

        let deleteLocalizacao = await localizacaoModel.deleteLocalizacaoModel(id)

        if (deleteLocalizacao) {
            let dadosLocalizacaoJson = {}

            dadosLocalizacaoJson.localizacao_deletada = dadosLocalizacaoDeletada
            dadosLocalizacaoJson.message = message.SUCCESS_DELETED_ITEM.message
            dadosLocalizacaoJson.status = message.SUCCESS_DELETED_ITEM.status

            return dadosLocalizacaoJson
        } else {
            return message.ERROR_DELETED_ITEM
        }
    }
}

const selectAllLocations = async () => {

    let dadosLocalizacao = await localizacaoModel.selectAllLocationsModel()

    if (dadosLocalizacao) {
        let dadosLocalizacaoJson = {}

        dadosLocalizacaoJson.localizacoes = dadosLocalizacao
        dadosLocalizacaoJson.message = 'Localizações achadas com sucesso'
        dadosLocalizacaoJson.status = 200

        return dadosLocalizacaoJson
    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}

const updateLocalizacao = async (dadosBody) => {

    if (dadosBody.id_localizacao == '' || dadosBody.id_localizacao == undefined || isNaN(dadosBody.id_localizacao)) {
        return message.ERROR_INVALID_ID
    } else if (dadosBody.estado == '' || dadosBody.estado == undefined || !isNaN(dadosBody.estado) || dadosBody.estado.length > 255 ||
            dadosBody.cidade == '' || dadosBody.cidade == undefined || !isNaN(dadosBody.cidade) || dadosBody.cidade.length > 255 ||
            dadosBody.bairro == '' || dadosBody.bairro == undefined || !isNaN(dadosBody.bairro) || dadosBody.cidade.length > 255
            ) {
        return message.ERROR_REQUIRED_FIELDS
    } else {
         
        let dadosUpdateLocalizacao = await localizacaoModel.updateLocalizacaoModel(dadosBody)

        if (dadosUpdateLocalizacao) {
            let localizacaoAtualizada = await localizacaoModel.selectLocalizacaoByIdModel(dadosBody.id_localizacao)

            let dadosLocalizacaoJson = {}

            dadosLocalizacaoJson.localizacao_atualizada = localizacaoAtualizada[0]
            dadosLocalizacaoJson.message = message.SUCCESS_UPDATED_ITEM.message
            dadosLocalizacaoJson.status = message.SUCCESS_UPDATED_ITEM.status

            return dadosLocalizacaoJson
        } else {
            return message.ERROR_NOT_POSSIBLE_UPDATE_LOCALIZATION
        }

    }
}

module.exports = {
    selectAllStates,
    insertLocalizacao,
    selectAllLocations,
    deleteLocalizacao,
    updateLocalizacao
}