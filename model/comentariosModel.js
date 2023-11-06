/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const insertComentarioModel = async (dadosBody) => {
    //Script sql para atualizar os dados no BD
    let sql = `insert into tbl_comentario (
                                            id_publicacao,
                                            id_usuario,
                                            mensagem,
                                            data_comentario,
                                            hora_comentario
                                            ) values (
                                                        ${dadosBody.id_publicacao},
                                                        ${dadosBody.id_usuario},
                                                        '${dadosBody.mensagem}',
                                                        DATE(NOW()),
                                                        TIME(NOW())
                                                        )`

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    // console.log(dadosBody);

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const selectLastIdComentarioModel = async () => {
    let sql = `select * from tbl_comentario order by id desc limit 1;`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectComentariosByIdPublicacaoModel = async (id_publicacao) => {
    let sql = `select * from tbl_comentario where id_publicacao = ${id_publicacao}`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectAllComentariosModel = async () => {
    let sql = `select * from tbl_comentario`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectComentarioByIdModel = async (id_comentario) => {
    let sql = `select * from tbl_comentario where id = ${id_comentario}`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

module.exports = {
    insertComentarioModel,
    selectLastIdComentarioModel,
    selectComentariosByIdPublicacaoModel,
    selectAllComentariosModel,
    selectComentarioByIdModel
}