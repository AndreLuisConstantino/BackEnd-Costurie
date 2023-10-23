/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const insertAnexoModel = async (conteudo, id_publicacao) => {
        //ScriptSQL para inserir dados
        let sql = `insert into tbl_anexo_publicacao (
            anexo, 
            id_publicacao
            ) values (
                '${conteudo}',
                ${id_publicacao}
            );`;

        // console.log(sql);
    
        //Executa o script sql no banco de dados
        let resultStatus = await prisma.$executeRawUnsafe(sql);
    
        // console.log(resultStatus);
    
        if (resultStatus) {
            return true;
        } else {
            return false;
        }
}

const selectLastIdAnexoModel = async () => {
    let sql = `select * from tbl_anexo_publicacao order by id desc limit 1;`;

    let rsUsuario = await prisma.$queryRawUnsafe(sql);
  
    if (rsUsuario.length > 0) {
      return rsUsuario;
    } else {
      return false;
    }
}

const deleteAllAnexosByIdPublicacao = async (id_publicacao) => {
    let sql = `delete from tbl_anexo_publicacao where tbl_anexo_publicacao.id_publicacao = ${id_publicacao}`;

    // console.log(sql)
  
    let resultStatus = await prisma.$executeRawUnsafe(sql);
  
    // console.log(resultStatus);
  
    if (resultStatus) {
      return true;
    } else {
      return false;
    }
} 

module.exports = {
    insertAnexoModel,
    selectLastIdAnexoModel,
    deleteAllAnexosByIdPublicacao
}