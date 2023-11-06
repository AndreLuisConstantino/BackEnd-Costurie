/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./modulo/config.js')

const inserirResposta = async (dadosBody) => {
    
    if (dadosBody.mensagem == '' || dadosBody.mensagem == undefined || dadosBody.mensagem.length > 255) {
    }
}

module.exports = {
    inserirResposta
}