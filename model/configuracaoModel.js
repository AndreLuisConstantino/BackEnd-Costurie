/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const updateEmailModel = async (dadosBody) => {
        //Script sql para atualizar os dados no BD
        let sql = `update tbl_usuario set email = ? where id = ?;`

        //Executa o script no BD
        let resultStatus = await prisma.$executeRawUnsafe(sql, dadosBody.email, dadosBody.id_usuario)
    
        if (resultStatus) {
            return true
        } else {
            return false
        }
}

module.exports = {
    updateEmailModel
}