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

    let emailExistente = await usuarioModel.selectUserByEmailModel(dadosBody)

    if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario)) {
        return message.ERROR_INVALID_ID
    } else if (dadosBody.email == '' || dadosBody.email == undefined || dadosBody.email.length > 255) {
        return message.ERROR_REQUIRED_FIELDS
    } else if (emailExistente) {
        return message.ERROR_EMAIL_ALREADY_EXISTS
    } else {
        let updateEmail = await configuracaoModel.updateEmailModel(dadosBody)

        if (updateEmail) {
            let novoEmail = await usuarioModel.selectUserByEmailModel(dadosBody)

            let dadosUpdateEmailJson = {}

            dadosUpdateEmailJson.novo_email = novoEmail[0]
            dadosUpdateEmailJson.message = message.SUCCESS_UPDATED_EMAIL.message
            dadosUpdateEmailJson.status = message.SUCCESS_UPDATED_EMAIL.status

            return dadosUpdateEmailJson
        } else {
            return message.ERROR_UPDATE_PASSWORD
        }
    }
}

const alterarSenha = async (dadosBody) => {
    // console.log(dadosBody);
    if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario)) {
        // console.log('testeMonstro');
        return message.ERROR_INVALID_ID
    } else if (dadosBody.senha == '' || dadosBody.senha == undefined || dadosBody.senha.length > 515) {
        // console.log('testeMonstro');
        return message.ERROR_REQUIRED_FIELDS
    } else {

        // console.log(dadosBody);
        let updatePassword = await configuracaoModel.updateSenhaModel(dadosBody)

        if (updatePassword) {
            let novaSenha = await usuarioModel.selectUserByPasswordModel(dadosBody.senha)

            let dadosUpdateSenhaJson = {}

            dadosUpdateSenhaJson.nova_senha = novaSenha[0]
            dadosUpdateSenhaJson.message = message.SUCCESS_UPDATED_PASSWORD.message
            dadosUpdateSenhaJson.status = message.SUCCESS_UPDATED_PASSWORD.status

            return dadosUpdateSenhaJson
        } else {
            return message.ERROR_UPDATE_PASSWORD
        }

    }
    // console.log(dadosBody);
}

module.exports = {
    alterarEmail,
    alterarSenha
}