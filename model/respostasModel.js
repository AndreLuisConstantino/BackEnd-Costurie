/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const inserirRespostaModel = async (dadosBody) => {
    // console.log(dadosBody);
    //Script sql para atualizar os dados no BD
    let sql = `insert into tbl_resposta_comentario (
                                                    id_usuario,
                                                    id_comentario,
                                                    mensagem,
                                                    data_resposta,
                                                    hora_resposta
                                                    ) values (
                                                                ?,
                                                                ?,
                                                                ?,
                                                                DATE(NOW()),
                                                                TIME(NOW())
                                                                );`
    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql,dadosBody.id_usuario, dadosBody.id_comentario, dadosBody.mensagem)


    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const selectLastIdRespostaModel = async () => {
    let sql = `select * from tbl_resposta_comentario order by id desc limit 1;`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectAllRespostasByIdComentario = async (id_comentario) => {
    let sql = `select * from tbl_resposta_comentario where id_comentario = ?`

    let response = await prisma.$queryRawUnsafe(sql, id_comentario)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectAllRespostasModel = async () => {
    let sql = `select * from tbl_resposta_comentario`

    let response = await prisma.$queryRawUnsafe(sql)

    // console.log(response);

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectRespostaById = async (id_resposta) => {
    let sql = `select * from tbl_resposta_comentario where id = ?`

    let response = await prisma.$queryRawUnsafe(sql, id_resposta)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const deleteRespostaModel = async (id_resposta) => {
    let sql = `delete from tbl_resposta_comentario where id = ?`
  
    let resultStatus = await prisma.$executeRawUnsafe(sql, id_resposta);
  
    if (resultStatus) {
      return true;
    } else {
      return false;
    }
}

module.exports = {
    inserirRespostaModel,
    selectLastIdRespostaModel,
    selectAllRespostasByIdComentario,
    selectAllRespostasModel,
    selectRespostaById,
    deleteRespostaModel
}