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
                                            ?,
                                            DATE(NOW()),
                                            TIME(NOW()),
                                            ?,
                                            ?
                                            );`

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql, dadosBody.titulo, dadosBody.descricao, dadosBody.id_usuario)

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
    let sql = `select * from tbl_publicacao where id = ?`

    // console.log(sql);

    let response = await prisma.$queryRawUnsafe(sql, id_publicacao)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const updatePublicacaoModel = async (dadosBody) => {
    //Script sql para atualizar os dados no BD
    let sql = `update tbl_publicacao set 
                                        tbl_publicacao.titulo = ?,
                                        tbl_publicacao.data_publicacao = DATE(NOW()), 
                                        tbl_publicacao.hora = TIME(NOW()), 
                                        tbl_publicacao.descricao = ? 
                                    where tbl_publicacao.id = ?;`

    // console.log(sql);

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql, dadosBody.titulo, dadosBody.descricao, dadosBody.id_publicacao)

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const deletePublicacaoModel = async (id_publicacao) => {
    let sql = `delete from tbl_publicacao where id = ?`

    // console.log(sql);

    let response = await prisma.$executeRawUnsafe(sql, id_publicacao)

    if (response) {
        return true
    } else {
        return false
    }
}

const selectAllPublicationsByIdUsuario = async (id_usuario) => {
    let sql = `select * from tbl_publicacao where id_usuario = ?`

    // console.log(sql);

    let response = await prisma.$queryRawUnsafe(sql, id_usuario)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const insertCurtidaPublicacaoModel = async (dadosBody) => {
    //Script sql para atualizar os dados no BD
    let sql = `insert into tbl_avaliacao_publicacao 
                                                    (
                                                    curtida, 
                                                    id_publicacao,
                                                    id_usuario
                                                    ) values (
                                                        1, 
                                                        ?,
                                                        ?
                                                        );`

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql, dadosBody.id_publicacao, dadosBody.id_usuario)

    // console.log(dadosBody);

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const selectCurtidaPublicacaoModel = async (dadosBody) => {
    let sql = `select * from tbl_avaliacao_publicacao where id_publicacao = ? and id_usuario = ?`

    // console.log(sql);

    let response = await prisma.$queryRawUnsafe(sql, dadosBody.id_publicacao, dadosBody.id_usuario)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectPublicationWithAttachment = async () => {
    let sql = `select tbl_publicacao.id as id_publicacao,
                                        tbl_publicacao.titulo,
                                        tbl_publicacao.descricao,
                                        tbl_publicacao.data_publicacao,
                                        tbl_publicacao.hora,
                                        tbl_publicacao.id_usuario,
                                        tbl_anexo_publicacao.id as id_anexo,
                                        tbl_anexo_publicacao.anexo,
                                        tbl_anexo_publicacao.id_publicacao as id_publicacao_anexo
                                        from tbl_publicacao
                                            inner join tbl_anexo_publicacao
                                            on tbl_publicacao.id = tbl_anexo_publicacao.id_publicacao;`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
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
    insertCurtidaPublicacaoModel,
    selectCurtidaPublicacaoModel,
    selectPublicationWithAttachment
}