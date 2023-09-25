/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 25/09/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const selectAllCategorias = async () => {
        let sql = `select * from tbl_categoria`

    // console.log(sql);

    let response = await prisma.$queryRawUnsafe(sql);

    // console.log(response);

    // console.log(response);
    if (response.length > 0) {
        return response;
    } else {
        return false;
    }
}

module.exports = {
    selectAllCategorias
}