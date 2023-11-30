/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 01/11/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const selectAllAvaliationsByIdPublicacao = async (id_publicacao) => {
    let sql = `select * from tbl_avaliacao_publicacao where id_publicacao = ?`

    let response = await prisma.$queryRawUnsafe(sql, id_publicacao)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const retirarCurtidaModel = async (dadosBody) => {
    let sql = `delete from tbl_avaliacao_publicacao where id_publicacao = ? and id_usuario = ?`

    // console.log(sql);

    let response = await prisma.$executeRawUnsafe(sql, dadosBody.id_publicacao, dadosBody.id_usuario)

    if (response) {
        return true
    } else {
        return false
    }
}

const selectCurtidaByIdUsuario = async (dadosBody) => {
    let sql = `select * from tbl_avaliacao_publicacao where id_publicacao = ? and id_usuario = ?`

    let response = await prisma.$queryRawUnsafe(sql, dadosBody.id_publicacao, dadosBody.id_usuario)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

module.exports = {
    selectAllAvaliationsByIdPublicacao,
    retirarCurtidaModel,
    selectCurtidaByIdUsuario
}