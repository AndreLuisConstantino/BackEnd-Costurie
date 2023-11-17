/****************************************************************************** 
* Objetivo: Arquivo responsável por padrozinar as mensagens de ERRO, SUCESSO, Funções, variáveis para o projeto
* Data: 30/08/2023
* Autor: André
* Versão: 1.0
******************************************************************************/

/******************************** MENSAGENS DE ERRO **********************************************/
const ERROR_REQUIRED_FIELDS = {status: 400, message: 'Campos obrigatórios não foram preenchidos.'}

const ERROR_MISTAKE_IN_THE_FILDS = {status: 400, message: 'Campos obrigatórios foram preenchidos errado.'}

const ERROR_INTERNAL_SERVER = {status: 500, message: 'Devido a um erro interno no servidor não possivel processar a requisição.'}

const ERROR_INVALID_CONTENT_TYPE = {status: 415, message: `O tipo de mídia no tipo de conteúdo da solicitação não é suportado pelo servidor. [application/json]`}

const ERROR_INVALID_ID = {status: 400, message: 'O ID informado na requisição não é válido ou não foi encaminhado.'}

const ERROR_DELETED_ITEM = {status: 404, message: 'O item não pode ser excluido, pois ele não foi encontrado'}

const ERROR_ITEM_NOT_FOUND = {status: 404, message: 'O item não pode ser encontrado na requisição.'}

const ERROR_USER_NOT_FOUND = {status: 404, message: 'O usuário não foi encontrado'}

const ERROR_EMAIL_ALREADY_EXISTS = {status: 400, message: 'O email já existe em nosso sistema'}

const ERROR_EMAIL_NOT_FOUND = {status: 404, message: 'O email não foi encontrado em nosso sistema'}

const ERROR_INVALID_WEB_TOKEN = {status: 401, message: 'O webtoken encaminhado na requisicão não está valido'}

const ERROR_UNABLE_TO_UPDATE = {status: 401, message: 'O token encaminhado na requisicão não está valido'}

const ERROR_UNABLE_TO_UPDATE_EMAIL = {status: 400, message: 'O email não pode ser atualizado'}

const ERROR_INVALID_TOKEN = {status: 401, message: 'O token encaminhado na requisicão não está valido'}

const ERROR_CATEGORY_NOT_FOUND = {status: 404, message: 'A categoria não foi encontrada no nosso sistema'}

const ERROR_CATEGORIES_NOT_FOUND = {status: 404, message: 'Nenhuma categoria foi encontrada em nosso sistema'}

const ERROR_NOT_POSSIBLE_INSERT_TAGS = {status: 400, message: 'Não foi possível inserir as tags no sistema'}

const ERROR_DELETED_USER = {status: 404, message: 'Por um erro interno esse usuário não pode ser excluido em nosso banco, ou ele não existe'}

const ERROR_NOT_POSSIBLE_UPDATE_LOCALIZATION = {status: 400, message: 'Não foi possível fazer o update de localização'}

const ERROR_TAG_NAME_ALREADY_EXISTS = {status: 400, message: 'Este nome de usuário já existe em nosso sistema'}

const ERROR_INSERT_USER = {status: 400, message: 'Não foi possível atualizar o usuário'}

const ERROR_TAGS_WERE_NOT_FORWARDED = {status: 400, message: 'As tags não foram encaminhadas na requisição'}

const ERROR_NOT_POSSIBLE_INSERT_PUBLICATION = {status: 400, message: 'Não foi possível fazer a publicacao'}

const ERROR_NOT_POSSIBLE_INSERT_COMMENT = {status: 400, message: 'Não foi possível fazer o comentário'}

const ERROR_NOT_POSSIBLE_INSERT_LIKE = {status: 400, message: 'Não foi possível dar uma curtida na publicação.'}

const ERROR_ATTACHMENT_WERE_NOT_FORWARDED = {status: 400, message: 'Os anexos não foram encaminhados na requisição'}

const ERROR_PUBLICATION_ID_NOT_FOUND = {status: 404, message: 'O id informado não exite no sistema'}

const ERROR_PUBLICATION_NOT_FOUND = {status: 404, message: 'O id da publicação informado não exite no sistema'}

const ERROR_INSERT_COMMENT = {status: 404, message: 'Não foi possível inserir o comentário.'}

const ERROR_USER_ALREADY_LIKED = {status: 400, message: 'Usuário já curtiu está publicação.'}

const ERROR_COMMENTARY_NOT_FOUND = {status: 400, message: 'Comentário não foi encontrado no nosso sistema'}

const ERROR_COMMENTARY_RESPONSES_NOT_FOUND = {status: 400, message: 'Não existem respostas para este comentário'}

/******************************** MENSAGENS DE SUCESSO **********************************************/
const SUCCESS_CREATED_ITEM = {status: 201, message: 'Item criado com sucesso.'}

const SUCCESS_UPDATED_ITEM = {status: 200, message: 'Item atualizado com sucesso.'}

const SUCCESS_DELETED_ITEM = {status: 200, message: 'Item excluido com sucesso.'}

const SUCCESS_LIKED_PUBLICATION = {status: 200, message: 'Publicação curtida com sucesso.'}

const SUCCES_REQUEST = {status: 200, message: 'Requisição bem secedida'}

const SUCCESS_EMAIL_FOUND = {status: 200, message: 'Email encontrado com sucesso.'}

const SUCCESS_UPDATED_EMAIL = {status: 200, message: 'Email atualizado com sucesso.'}

const SUCCESS_CATEGORY_FOUND = {status: 200, message: 'Tags encontradas com sucesso'}

const SUCCESS_CATEGORIES_FOUND = {status: 200, message: 'Categorias encontradas com sucesso.'}

const SUCCESS_USER_FOUND = {status: 200, message: 'Requisição bem secedida'}

const SUCCESS_COMENTARY_RESPONSES_FOUND = {status: 200, message: 'Respostas de comentário encontradas com sucesso'}



module.exports = {
    ERROR_REQUIRED_FIELDS,
    ERROR_INTERNAL_SERVER,
    SUCCESS_CREATED_ITEM,
    ERROR_MISTAKE_IN_THE_FILDS,
    ERROR_INVALID_ID,
    SUCCESS_UPDATED_ITEM,
    ERROR_INVALID_CONTENT_TYPE,
    SUCCESS_DELETED_ITEM,
    ERROR_DELETED_ITEM,
    ERROR_ITEM_NOT_FOUND,
    SUCCES_REQUEST,
    ERROR_EMAIL_ALREADY_EXISTS,
    ERROR_INVALID_WEB_TOKEN,
    SUCCESS_EMAIL_FOUND,
    ERROR_EMAIL_NOT_FOUND,
    ERROR_UNABLE_TO_UPDATE,
    ERROR_INVALID_TOKEN,
    ERROR_USER_NOT_FOUND,
    ERROR_CATEGORY_NOT_FOUND,
    SUCCESS_CATEGORY_FOUND,
    ERROR_NOT_POSSIBLE_INSERT_TAGS,
    SUCCESS_CATEGORIES_FOUND,
    SUCCESS_USER_FOUND,
    ERROR_CATEGORIES_NOT_FOUND,
    ERROR_DELETED_USER,
    ERROR_NOT_POSSIBLE_UPDATE_LOCALIZATION,
    ERROR_TAG_NAME_ALREADY_EXISTS,
    ERROR_INSERT_USER,
    ERROR_TAGS_WERE_NOT_FORWARDED,
    ERROR_NOT_POSSIBLE_INSERT_PUBLICATION,
    ERROR_ATTACHMENT_WERE_NOT_FORWARDED,
    ERROR_PUBLICATION_ID_NOT_FOUND,
    ERROR_NOT_POSSIBLE_INSERT_LIKE,
    SUCCESS_LIKED_PUBLICATION,
    ERROR_INSERT_COMMENT,
    ERROR_USER_ALREADY_LIKED,
    ERROR_NOT_POSSIBLE_INSERT_COMMENT,
    ERROR_PUBLICATION_NOT_FOUND,
    ERROR_COMMENTARY_NOT_FOUND,
    ERROR_COMMENTARY_RESPONSES_NOT_FOUND,
    SUCCESS_COMENTARY_RESPONSES_FOUND,
    ERROR_UNABLE_TO_UPDATE_EMAIL,
    SUCCESS_UPDATED_EMAIL
}