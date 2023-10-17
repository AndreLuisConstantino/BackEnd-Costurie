/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const inserirPublicacaoModel = async (dadosBody) => {
    //Script sql para atualizar os dados no BD
    let sql = `insert into tbl_publicacao (
                                            titulo,
                                            anexo,
                                            data_publicacao,
                                            hora,
                                            descricao,
                                            id_usuario
                                            ) values (
                                            '${dadosBody.titulo}',
                                            '${dadosBody.anexo}',
                                            DATE(NOW()),
                                            TIME(NOW()),
                                            '${dadosBody.descricao}',
                                            ${dadosBody.id_usuario}
                                            );`

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    // console.log(dadosBody);

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const selectLastIdPublicacaoModel = async () => {
    let sql = `select * from tbl_publicacao order by id desc limit 1;`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

module.exports = {
    inserirPublicacaoModel,
    selectLastIdPublicacaoModel
}