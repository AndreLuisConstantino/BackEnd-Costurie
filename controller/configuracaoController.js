/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./modulo/config.js')

//Import models
const configuracaoModel = require('../model/configuracaoModel.js')
const usuarioModel = require('../model/usuarioModel.js')

const alterarEmail = async (dadosBody) => {

    // console.log(dadosBody);

    if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario)) {
        return message.ERROR_INVALID_ID
    } else if (dadosBody.email == '' || dadosBody.email == undefined || dadosBody.email.length > 255) {
        return message.ERROR_REQUIRED_FIELDS
    } else {

        try {
            await configuracaoModel.updateEmailModel(dadosBody)

            let novoEmail = await usuarioModel.selectUserByEmailModel(dadosBody)

            let dadosUpdateEmailJson = {}

            dadosUpdateEmailJson.novo_email = novoEmail[0]
            dadosUpdateEmailJson.message = message.SUCCESS_UPDATED_EMAIL.message
            dadosUpdateEmailJson.status = message.SUCCESS_UPDATED_EMAIL.status

            return dadosUpdateEmailJson

        } catch (err) {
            return message.ERROR_UNABLE_TO_UPDATE
        }
    }
}

module.exports = {
    alterarEmail
}