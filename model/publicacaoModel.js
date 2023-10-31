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
                                            data_publicacao,
                                            hora,
                                            descricao,
                                            id_usuario
                                            ) values (
                                            '${dadosBody.titulo}',
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

const selectAllPublicationsModel = async () => {
    let sql = `select * from tbl_publicacao`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectPublicacaoByIdModel = async (id_publicacao) => {
    let sql = `select * from tbl_publicacao where id = ${id_publicacao}`

    // console.log(sql);

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const updatePublicacaoModel = async (dadosBody) => {
    //Script sql para atualizar os dados no BD
    let sql = `update tbl_publicacao set 
                                        tbl_publicacao.titulo = '${dadosBody.titulo}',
                                        tbl_publicacao.data_publicacao = DATE(NOW()), 
                                        tbl_publicacao.hora = TIME(NOW()), 
                                        tbl_publicacao.descricao = 'teste update descricao' 
                                    where tbl_publicacao.id = 2;`

    // console.log(sql);

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const deletePublicacaoModel = async (id_publicacao) => {
    let sql = `delete from tbl_publicacao where id = ${id_publicacao}`

    // console.log(sql);

    let response = await prisma.$executeRawUnsafe(sql)

    if (response) {
        return true
    } else {
        return false
    }
}

const selectAllPublicationsByIdUsuario = async (id_usuario) => {
    let sql = `select * from tbl_publicacao where id_usuario = ${id_usuario};`

    // console.log(sql);

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const insertCurtidaPublicacaoModel = async (id_publicacao) => {
    //Script sql para atualizar os dados no BD
    let sql = `insert into tbl_avaliacao_publicacao 
                                                    (
                                                    curtida, 
                                                    id_publicacao
                                                    ) values (
                                                        1, 
                                                        ${id_publicacao}
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

module.exports = {
    inserirPublicacaoModel,
    selectLastIdPublicacaoModel,
    selectAllPublicationsModel,
    selectPublicacaoByIdModel,
    updatePublicacaoModel,
    deletePublicacaoModel,
    selectAllPublicationsByIdUsuario,
    insertCurtidaPublicacaoModel
}