/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./modulo/config.js')

//Import models
const publicacaoModel = require('../model/publicacaoModel.js')
const tagPublicacaoModel = require('../model/tagPublicacaoModel.js')
const tagModel = require('../model/tagModel.js')
const anexosModel = require('../model/anexosModel.js')
const usuarioModel = require('../model/usuarioModel.js')
const avaliacaoModel = require('../model/avaliacaoModel.js')

const insertPublicacao = async (dadosBody) => {

    // console.log(dadosBody)

    if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario) ||
        dadosBody.titulo == '' || dadosBody.titulo == undefined || !isNaN(dadosBody.titulo) || dadosBody.titulo.length > 45 ||
        dadosBody.descricao == '' || dadosBody.descricao == undefined || !isNaN(dadosBody.descricao)
    ) {
        return message.ERROR_REQUIRED_FIELDS
    } else if (dadosBody.tags.length == 0) {
        return message.ERROR_TAGS_WERE_NOT_FORWARDED
    } else if (dadosBody.anexos.length == 0) {
        return message.ERROR_ATTACHMENT_WERE_NOT_FORWARDED
    } else {
        // console.log(dadosBody.tags.length);

        let dadosInsertPublicacao = await publicacaoModel.inserirPublicacaoModel(dadosBody)

        let dadosTagsInseridas = await insertTagsPublicacao(dadosBody.tags)

        // console.log(dadosBody.anexos);

        let lastPublicacao = await publicacaoModel.selectLastIdPublicacaoModel()

        // console.log(lastPublicacao);

        let dadosAnexosInseridos = await insertAnexosPublicacao(dadosBody.anexos, lastPublicacao[0].id)

        if (dadosInsertPublicacao) {
            let novaPublicacao = await publicacaoModel.selectLastIdPublicacaoModel()

            let dadosPublicacaoJson = {}

            dadosPublicacaoJson.nova_publicacao = novaPublicacao
            dadosPublicacaoJson.tags_inseridas = dadosTagsInseridas
            dadosPublicacaoJson.anexos_inseridas = dadosAnexosInseridos
            dadosPublicacaoJson.message = message.SUCCESS_CREATED_ITEM.message
            dadosPublicacaoJson.status = message.SUCCESS_CREATED_ITEM.status

            // console.log(dadosPublicacaoJson);

            return dadosPublicacaoJson
        } else {
            return message.ERROR_NOT_POSSIBLE_INSERT_PUBLICATION
        }
    }
}

const insertTagsPublicacao = async (tags) => {
    let tagsArray = []

    // console.log(tags);

    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i]

        let dadosPublicacao = await publicacaoModel.selectLastIdPublicacaoModel()

        // console.log(dadosPublicacao);

        await tagPublicacaoModel.insertTagPublicacaoModel(tag.id_tag, dadosPublicacao[0].id)

        let tagPublicacaoAtualizada = await tagPublicacaoModel.selectLastId()

        let tagAtualizada = await tagModel.selectTagByIdModel(tagPublicacaoAtualizada[0].id_tag)

        tagsArray.push(tagAtualizada[0])
    }

    // console.log(tagsArray);

    return tagsArray
}

const insertAnexosPublicacao = async (anexos, id_publicacao) => {
    let anexosArray = []

    for (let i = 0; i < anexos.length; i++) {
        let anexo = anexos[i]

        await anexosModel.insertAnexoModel(anexo.conteudo, id_publicacao)

        let anexoAtualizado = await anexosModel.selectLastIdAnexoModel()

        anexosArray.push(anexoAtualizado[0])
    }

    // console.log(anexosArray);

    return anexosArray
}

const selectMostRecentPublications = async () => {

    let dadosPublicacaoComAnexoArray = []

    let dadosPublicacao = await publicacaoModel.selectAllPublicationsModel()

    let ultimaPosicaoArray = dadosPublicacao.length

    let primeiraPosicaoDeletada = ultimaPosicaoArray - 5

    let cincoPrimeirasPublicacoes = await dadosPublicacao.slice(primeiraPosicaoDeletada, ultimaPosicaoArray)

    for (let i = 0; i < cincoPrimeirasPublicacoes.length; i++) {
        let publicacao = cincoPrimeirasPublicacoes[i]

        let dadosAnexos = await anexosModel.selectAnexosByIdModel(publicacao.id)

        publicacao.anexos = dadosAnexos

        dadosPublicacaoComAnexoArray.push(publicacao)
    }

    if (dadosPublicacao) {
        let dadosPublicacaoJson = {}

        dadosPublicacaoJson.publicacoes = dadosPublicacaoComAnexoArray
        dadosPublicacaoJson.status = message.SUCCES_REQUEST.status
        dadosPublicacaoJson.message = message.SUCCES_REQUEST.message

        return dadosPublicacaoJson
    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}

const selectTags = async (tags) => {
    let arrayTags = []

    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i]

        let tagSelecionada = await tagModel.selectTagByIdModel(tag.id_tag)

        arrayTags.push(tagSelecionada[0])
    }

    return arrayTags
}

const selectPublicacaoById = async (id_publicacao) => {

    let publicacao_existente = await publicacaoModel.selectPublicacaoByIdModel(id_publicacao)

    if (publicacao_existente == false) {
        return message.ERROR_PUBLICATION_ID_NOT_FOUND
    } else if (id_publicacao == '' || id_publicacao == undefined || isNaN(id_publicacao)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosPublicacao = await publicacaoModel.selectPublicacaoByIdModel(id_publicacao)

        // console.log(dadosPublicacao);

        let usuario = await usuarioModel.selectUserByIdModel(dadosPublicacao[0].id_usuario)

        let anexos = await anexosModel.selectAnexosByIdModel(dadosPublicacao[0].id)

        let tags = await tagPublicacaoModel.selectAllTagsByIdPublicacaoModel(dadosPublicacao[0].id)

        let tagSelecionada = await selectTags(tags)

        delete dadosPublicacao[0].id_usuario

        dadosPublicacao[0].usuario = usuario[0]

        dadosPublicacao[0].anexos = anexos

        dadosPublicacao[0].tags = tagSelecionada

        if (dadosPublicacao) {
            let dadosPublicacaoJson = {}

            dadosPublicacaoJson.publicacao = dadosPublicacao[0]
            dadosPublicacaoJson.status = message.SUCCES_REQUEST.status
            dadosPublicacaoJson.message = message.SUCCES_REQUEST.message

            return dadosPublicacaoJson
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }
}

const updatePublicacao = async (dadosBody) => {

    if (dadosBody.id_publicacao == '' || dadosBody.id_publicacao == undefined || isNaN(dadosBody.id_publicacao) ||
        dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario) ||
        dadosBody.titulo == '' || dadosBody.titulo == undefined || !isNaN(dadosBody.titulo) || dadosBody.titulo.length > 45 ||
        dadosBody.descricao == '' || dadosBody.descricao == undefined || !isNaN(dadosBody.descricao) || dadosBody.descricao.length > 500
    ) {
        return message.ERROR_MISTAKE_IN_THE_FILDS
    } else if (dadosBody.tags.length == 0) {
        return message.ERROR_TAGS_WERE_NOT_FORWARDED
    } else if (dadosBody.anexos.length == 0) {
        return message.ERROR_ATTACHMENT_WERE_NOT_FORWARDED
    } else {

        let dadosUpdatePublicacao = await publicacaoModel.updatePublicacaoModel(dadosBody)

        // console.log(dadosUpdatePublicacao);

        let dadosUpdateTagsPublicacao = await updateTagsPublicacao(dadosBody.tags, dadosBody.id_publicacao)

        let dadosUpdateAnexoPublicacao = await updateAnexosPublicacao(dadosBody.anexos, dadosBody.id_publicacao)

        if (dadosUpdatePublicacao) {
            let dadosUpdatePublicacaoJson = {}

            let novaPublicacao = await publicacaoModel.selectPublicacaoByIdModel(dadosBody.id_publicacao)

            dadosUpdatePublicacaoJson.publicacao_atualizada = novaPublicacao[0]
            dadosUpdatePublicacaoJson.tags_atualizadas = dadosUpdateTagsPublicacao
            dadosUpdatePublicacaoJson.anexos_atualizados = dadosUpdateAnexoPublicacao
            dadosUpdatePublicacaoJson.message = message.SUCCESS_UPDATED_ITEM.message
            dadosUpdatePublicacaoJson.status = message.SUCCESS_UPDATED_ITEM.status

            return dadosUpdatePublicacaoJson
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }
}

const updateTagsPublicacao = async (tags, id_publicacao) => {
    let tagsArray = []

    await tagPublicacaoModel.deleteAllTagsByIdPublicacao(id_publicacao)

    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i]

        await tagPublicacaoModel.insertTagPublicacaoModel(tag.id_tag, id_publicacao)

        let tagPublicacaoAtualizada = await tagPublicacaoModel.selectLastId()

        let tagAtualizada = await tagModel.selectTagByIdModel(tagPublicacaoAtualizada[0].id_tag)

        tagsArray.push(tagAtualizada[0])
    }

    return tagsArray

}

const updateAnexosPublicacao = async (anexos, id_publicacao) => {
    let anexosArray = []

    await anexosModel.deleteAllAnexosByIdPublicacao(id_publicacao)

    for (let i = 0; i < anexos.length; i++) {
        let anexo = anexos[i]

        // console.log(anexo);

        await anexosModel.insertAnexoModel(anexo.conteudo, id_publicacao)

        let anexoAtualizado = await anexosModel.selectLastIdAnexoModel()

        anexosArray.push(anexoAtualizado[0])
    }

    return anexosArray
}

const deletePublicacao = async (id_publicacao) => {

    if (id_publicacao == '' || id_publicacao == undefined || id_publicacao == null || isNaN(id_publicacao)) {
        return message.ERROR_INVALID_ID
    } else {

        let publicacaoDeletada = await publicacaoModel.selectPublicacaoByIdModel(id_publicacao)

        let dadosPublicacaoDeletada = await publicacaoModel.deletePublicacaoModel(id_publicacao)

        if (dadosPublicacaoDeletada) {

            let dadosPublicacaoJson = {}

            dadosPublicacaoJson.publicacao_deletada = publicacaoDeletada
            dadosPublicacaoJson.message = message.SUCCESS_DELETED_ITEM.message
            dadosPublicacaoJson.status = message.SUCCESS_DELETED_ITEM.status

            return dadosPublicacaoJson
        } else {
            return message.ERROR_DELETED_ITEM
        }
    }
}

const curtirPublicacao = async (dadosBody) => {

    if (dadosBody.id_publicacao == '' || dadosBody.id_publicacao == undefined || isNaN(dadosBody.id_publicacao) ||
        dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario)
    ) {
        return message.ERROR_INVALID_ID
    } else {

        let usuarioJaCurtiu = await publicacaoModel.selectCurtidaPublicacaoModel(dadosBody)

        if (usuarioJaCurtiu.length) {
            return message.ERROR_USER_ALREADY_LIKED
        } else {
            let insertCurtidaPublicacao = await publicacaoModel.insertCurtidaPublicacaoModel(dadosBody)

            if (insertCurtidaPublicacao) {
                let dadosCurtidaJson = {}

                dadosCurtidaJson.status = message.SUCCESS_LIKED_PUBLICATION.status
                dadosCurtidaJson.message = message.SUCCESS_LIKED_PUBLICATION.message

                return dadosCurtidaJson
            } else {
                return message.ERROR_NOT_POSSIBLE_INSERT_LIKE
            }
        }
    }
}

const selectAllPublicationsOfSystem = async () => {
    let dadosPublicacaoComAnexoArray = []

    let dadosPublicacao = await publicacaoModel.selectAllPublicationsModel()

    for (let i = 0; i < dadosPublicacao.length; i++) {
        let publicacao = dadosPublicacao[i]

        let dadosAnexos = await anexosModel.selectAnexosByIdModel(publicacao.id)

        publicacao.anexos = dadosAnexos

        dadosPublicacaoComAnexoArray.push(publicacao)
    }

    if (dadosPublicacao) {
        let dadosPublicacaoJson = {}

        dadosPublicacaoJson.publicacoes = dadosPublicacaoComAnexoArray
        dadosPublicacaoJson.status = message.SUCCES_REQUEST.status
        dadosPublicacaoJson.message = message.SUCCES_REQUEST.message

        return dadosPublicacaoJson
    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}

const selectMostPopularPublications = async () => {

    // let dadosPublicacoes = await publicacaoModel.selectAllPublicationsModel()

    // let publicacoesArray = []

    // for (let i = 0; i < dadosPublicacoes.length; i++) {
    //     let publicacao = dadosPublicacoes[i]

    //     let dadosAnexos = await anexosModel.selectAnexosByIdModel(publicacao.id)

    //     publicacao.anexos = dadosAnexos

    //     let curtidas = await avaliacaoModel.selectAllAvaliationsByIdPublicacao(publicacao.id)

    //     let quantidadeCurtidas = curtidas.length

    //     if (quantidadeCurtidas == undefined) {
    //         publicacao.curtidas = 'Esta publicação não possui curtidas'
    //     } else {
    //         publicacao.curtidas = quantidadeCurtidas
    //     }

    //     publicacoesArray.push(publicacao)
    // }

    // let ultimaPosicaoArray = publicacoesArray.length

    // let primeiraPosicaoDeletada = ultimaPosicaoArray - 5

    // let cincoPrimeirasPublicacoes = publicacoesArray.slice(primeiraPosicaoDeletada, ultimaPosicaoArray)

    // cincoPrimeirasPublicacoes.sort((primeioElemento, segundoElemento) => {
    //     const curtidasA = primeioElemento.curtidas === "Esta publicação não possui curtidas" ? 0 : primeioElemento.curtidas;
    //     const curtidasB = segundoElemento.curtidas === "Esta publicação não possui curtidas" ? 0 : segundoElemento.curtidas;
    //     return curtidasB - curtidasA;
    // })

    let dadosPublicacoes = await publicacaoModel.selectPublicationWithAttachment()

    dadosPublicacoes.forEach(async publicacao => {
        let dadosAnexosJson = {}
        let anexosArray = []

        //Coloca os anexos dentro de um json
        if (publicacao.id_publicacao == publicacao.id_publicacao_anexo) {
            dadosAnexosJson.id = publicacao.id_anexo
            dadosAnexosJson.anexo = publicacao.anexo
            dadosAnexosJson.id_publicacao = publicacao.id_publicacao_anexo
            
            //Coloca os anexos dentro de um array
            anexosArray.push(dadosAnexosJson)
        }
        
        //Colocando o array dentro do Json principal
        publicacao.anexos = anexosArray
        
        //Deleta o anexo e o id_anexos que vem do banco
        delete publicacao.anexo
        delete publicacao.id_anexo
        delete publicacao.id_publicacao_anexo

        publicacao.id = publicacao.id_publicacao
        delete publicacao.id_publicacao



        //Seleciona as curtidas
        let curtidas = await avaliacaoModel.selectAllAvaliationsByIdPublicacao(publicacao.id)

        let quantidadeCurtidas = curtidas.length

        //Gerencia a quantidade de curtidas
        if (quantidadeCurtidas == undefined) {
            publicacao.curtidas = 'Esta publicação não possui curtidas'
        } else {
            publicacao.curtidas = quantidadeCurtidas
        }

    })

    dadosPublicacoes.sort((primeioElemento, segundoElemento) => {
        if (primeioElemento.id == segundoElemento.id) {
            return primeioElemento
        } else {
            return primeioElemento + segundoElemento
        }
    })

    //Pega os dois primeiros elementos e vai reorganizando o array baseado na quantidade de curtidas definida acima
    dadosPublicacoes.sort((primeioElemento, segundoElemento) => {
        const curtidasA = primeioElemento.curtidas === "Esta publicação não possui curtidas" ? 0 : primeioElemento.curtidas;
        const curtidasB = segundoElemento.curtidas === "Esta publicação não possui curtidas" ? 0 : segundoElemento.curtidas;
        return curtidasB - curtidasA;
    })

    if (dadosPublicacoes) {
        let dadosPublicacaoJson = {}

        dadosPublicacaoJson.publicacao = dadosPublicacoes
        dadosPublicacaoJson.message = message.SUCCES_REQUEST.message
        dadosPublicacaoJson.status = message.SUCCES_REQUEST.status

        return dadosPublicacaoJson
    } else {
        return message.ERROR_ITEM_NOT_FOUND
    }
}

const retirarCurtida = async (dadosBody) => {

    if (dadosBody.id_publicacao == '' || dadosBody.id_publicacao == undefined || isNaN(dadosBody.id_publicacao) ||
        dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario)
    ) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosRetirarCurtida = await avaliacaoModel.retirarCurtidaModel(dadosBody)

        if (dadosRetirarCurtida) {
            let dadosRetirarCurtidaJson = {}

            dadosRetirarCurtidaJson.message = message.SUCCESS_DELETED_ITEM.message
            dadosRetirarCurtidaJson.status = message.SUCCESS_DELETED_ITEM.status

            return dadosRetirarCurtidaJson
        } else {
            return message.ERROR_DELETED_ITEM
        }
    }
}

module.exports = {
    insertPublicacao,
    selectMostRecentPublications,
    selectPublicacaoById,
    updatePublicacao,
    deletePublicacao,
    curtirPublicacao,
    selectAllPublicationsOfSystem,
    selectMostPopularPublications,
    retirarCurtida
}