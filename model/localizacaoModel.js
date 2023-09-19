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

module.exports = {
    selectAllStatesModel
}