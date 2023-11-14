/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./modulo/config.js')

const alterarEmail = async (email) => {

    if (email == '' || email == undefined || email.length > 255) {
        return message.ERROR_REQUIRED_FIELDS
    } else {

        
    }
}

module.exports = {
    alterarEmail
}