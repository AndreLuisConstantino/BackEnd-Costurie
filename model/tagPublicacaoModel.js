/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const insertTagPublicacaoModel = async (id_tag, id_publicacao) => {
    //ScriptSQL para inserir dados
    let sql = `insert into tbl_tag_publicacao (id_tag, id_publicacao) values (?, ?)`;

    // console.log(sql);

    //Executa o script sql no banco de dados
    let resultStatus = await prisma.$executeRawUnsafe(sql, id_tag, id_publicacao);

    // console.log(resultStatus);

    if (resultStatus) {
        return true;
    } else {
        return false;
    }
}

const selectLastId = async () => {
    let sql = `select * from tbl_tag_publicacao order by id desc limit 1;`;

    let rsUsuario = await prisma.$queryRawUnsafe(sql);
  
    if (rsUsuario.length > 0) {
      return rsUsuario;
    } else {
      return false;
    }
}

const deleteAllTagsByIdPublicacao = async (id_publicacao) => {
    let sql = `delete from tbl_tag_publicacao where tbl_tag_publicacao.id_publicacao = ?`;

    // console.log(sql)
  
    let resultStatus = await prisma.$executeRawUnsafe(sql, id_publicacao);
  
    // console.log(resultStatus);
  
    if (resultStatus) {
      return true;
    } else {
      return false;
    }
}

const selectAllTagsByIdPublicacaoModel = async (id_publicacao) => {
  let sql = `select * from tbl_tag_publicacao where id_publicacao = ?`;

  let rsUsuario = await prisma.$queryRawUnsafe(sql, id_publicacao);

  if (rsUsuario.length > 0) {
    return rsUsuario;
  } else {
    return false;
  }
}
 
module.exports = {
    insertTagPublicacaoModel,
    selectLastId,
    deleteAllTagsByIdPublicacao,
    selectAllTagsByIdPublicacaoModel
}