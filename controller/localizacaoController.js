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

        let dadosLocalizacaoDeletada = await localizacaoModel.selectLocalizacaoById(id)


    }
}

module.exports = {
    selectAllStates,
    insertLocalizacao
}