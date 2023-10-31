/*********************************************************************************************************
 * Objetivo: Arquivo responsavel por padronizar as mensagens de ERRO, SUCESSO, FUNÇÕES, VARIAVEIS
 * Autor: Muryllo Vieira
 * Data: 26/10/2023
 * Versão: 1.0
*********************************************************************************************************/

/*************************************** MENSAGENS DE ERRO ***************************************/
const ERROR_REQUIRE_FIELDS = {status: 422, message: 'NÃO FORAM PREENCHIDO TODOS OS CAMPOS OBRIGATÓRIOS'}

const ERROR_INTERNAL_SERVER = {status: 500, message: 'DEVIDO A UM ERRO INTERNO NO SERVIDOR, NÃO FOI POSSIVEL PROCESSAR A REQUISIÇÃO'}

const ERROR_REGISTER_NOT_FOUND= {status: 404, message: 'O SERVIDOR NÃO ENCONTROU O RECURSO SOLICITADO.'}

const ERROR_CHAT_NOT_FOUND = {status: 404, message: 'NENHUM CHAT FOI ENCONTRADO'}

/*************************************** MENSAGENS DE SUCESSO ***************************************/
const SUCCESS_CREATED_ITEM = {status: 201, message: 'ITEM CRIADO COM SUCESSO'}

const SUCCESS_UPDATED_ITEM = {status: 200, message: 'ITEM ATUALIZADO COM SUCESSO'}

const SUCCESS_DELETED_ITEM = {status: 200, message: 'ITEM DELETADO COM SUCESSO'}

const SUCCESS_REQUEST = {status: 200, message: 'REQUISIÇÃO BEM SUCEDIDA'}

const SUCCESS_VALID_TOKEN = {status: 200, message: 'TOKEN VÁLIDO'}

/*************************************** MENSAGENS DE ALERTA ***************************************/
const ALERT_PAGE = "ESTE ENDPOINT RETORNA INÚMEROS DADOS E VOCÊ ESTÁ USANDO SEM PAGINAÇÃO"


module.exports = {
    //Exportes de erro
    ERROR_REGISTER_NOT_FOUND,
    ERROR_INTERNAL_SERVER,
    ERROR_REQUIRE_FIELDS,
    ERROR_CHAT_NOT_FOUND,

    //Exportes de sucesso
    SUCCESS_CREATED_ITEM,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_DELETED_ITEM,
    SUCCESS_REQUEST,
    SUCCESS_VALID_TOKEN,

    //Exportes de alert
    ALERT_PAGE
}