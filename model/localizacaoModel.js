/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client')

var prisma = new PrismaClient()

const selectAllStatesModel = async () => {
    let sql = `select tbl_localizacao.id, tbl_localizacao.estado from tbl_localizacao`

    let response = await prisma.$queryRawUnsafe(sql)


    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const insertLocalizacaoModel = async (dadosLocalizacao) => {
    let sql = `CALL sp_insert_localizacao_usuario(
        ${dadosLocalizacao.id_usuario},  -- Substitua pelo ID do usuário desejado
        '${dadosLocalizacao.bairro}',  -- Substitua pelo nome do bairro desejado
        '${dadosLocalizacao.cidade}',  -- Substitua pelo nome da cidade desejada
        '${dadosLocalizacao.estado}'   -- Substitua pelo nome do estado desejado
    );`


    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const selectLastId = async () => {
    let sql = `select * from tbl_localizacao order by id desc limit 1;`

    let response = await prisma.$queryRawUnsafe(sql)


    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectAllLocationsModel = async () => {
    let sql = `select
                    tbl_localizacao.id AS id_localizacao,
                    tbl_localizacao.cidade,
                    tbl_localizacao.estado,
                    tbl_localizacao.bairro,
                    tbl_usuario.id AS id_usuario,
                    tbl_usuario.nome_de_usuario
                from
                    tbl_localizacao
                inner join
                    tbl_usuario
                on
                    tbl_usuario.id_localizacao = tbl_localizacao.id`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const updateLocalizacaoModel = async (dadosBody) => {
    //Script sql para atualizar os dados no BD
    let sql = `update tbl_localizacao set estado = '${dadosBody.estado}', cidade = '${dadosBody.cidade}', bairro = '${dadosBody.bairro}' where id = ${dadosBody.id_localizacao}`

    // console.log(sql);

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const selectLocalizacaoByIdModel = async (id) => {
    let sql = `select
                    tbl_localizacao.id AS id_localizacao,
                    tbl_localizacao.cidade,
                    tbl_localizacao.estado,
                    tbl_localizacao.bairro,
                    tbl_usuario.id AS id_usuario,
                    tbl_usuario.nome_de_usuario
                from
                    tbl_localizacao
                inner join
                    tbl_usuario
                on
                    tbl_usuario.id_localizacao = tbl_localizacao.id where id_localizacao = ${id}`

    let response = await prisma.$queryRawUnsafe(sql)

    // console.log(response);

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const deleteLocalizacaoModel = async (id) => {
    let sql = `delete from tbl_localizacao where id = ${id}`

    let response = await prisma.$executeRawUnsafe(sql)

    if (response) {
        return true
    } else {
        return false
    }
}

const selectLocationById = async (id_localizacao) => {
    let sql = `select * from tbl_localizacao where id = ${id_localizacao}`

    let response = await prisma.$queryRawUnsafe(sql)


    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

module.exports = {
    selectAllStatesModel,
    insertLocalizacaoModel,
    selectLastId,
    selectAllLocationsModel,
    updateLocalizacaoModel,
    selectLocalizacaoByIdModel,
    deleteLocalizacaoModel,
    selectLocationById
}