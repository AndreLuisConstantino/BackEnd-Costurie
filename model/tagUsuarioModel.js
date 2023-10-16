/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const deleteAllTagsWithUserIdModel = async (id_usuario) => {
  let sql = `delete from tbl_tag_usuario where tbl_tag_usuario.id_usuario = ${id_usuario}`;

  let resultStatus = await prisma.$executeRawUnsafe(sql);

  console.log(resultStatus);

  if (resultStatus) {
    return true;
  } else {
    return false;
  }
};

const selectTagUsuarioLastId = async () => {
  let sql = `select * from tbl_tag_usuario order by id desc limit 1;`;

  let rsUsuario = await prisma.$queryRawUnsafe(sql);

  if (rsUsuario.length > 0) {
    return rsUsuario;
  } else {
    return false;
  }
};

const insertTagUsuario = async (tag, id_usuario) => {
  //ScriptSQL para inserir dados
  let sql = `insert into tbl_tag_usuario (id_tag, id_usuario) values (${tag}, ${id_usuario});`;

  //Executa o script sql no banco de dados
  let resultStatus = await prisma.$executeRawUnsafe(sql);

  if (resultStatus) {
    return true;
  } else {
    return false;
  }
};

const selectAllTagsWithUserIdModel = async (id_usuario) => {
  let sql = `select * from tbl_tag_usuario where tbl_tag_usuario.id_usuario = ${id_usuario}`;
  
  let rsUsuario = await prisma.$queryRawUnsafe(sql);

  // console.log(rsUsuario);
  if (rsUsuario.length > 0) {
    return rsUsuario;
  } else {
    return false;
  }
}

const selectAllUsuariosByTag = async (tag) => {
  let sql = `select * from tbl_tag_usuario where tbl_tag_usuario.id_tag = ${tag.id_tag};`;
  
  let response = await prisma.$queryRawUnsafe(sql);

  // console.log(rsUsuario);
  if (response.length > 0) {
    return response;
  } else {
    return false;
  }
}

module.exports = {
  deleteAllTagsWithUserIdModel,
  selectTagUsuarioLastId,
  insertTagUsuario,
  selectAllTagsWithUserIdModel,
  selectAllUsuariosByTag
};
