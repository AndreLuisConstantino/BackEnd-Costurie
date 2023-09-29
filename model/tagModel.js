/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const selectTagByIdModel = async (id_tag) => {
    let sql = `select tbl_tag.id as id_tag, tbl_tag.nome as nome, tbl_tag.imagem as imagem, tbl_categoria.id as id_categoria, tbl_categoria.nome as nome_categoria
    from tbl_tag
        inner join tbl_categoria
            on tbl_tag.id_categoria = tbl_categoria.id
    where tbl_tag.id = ${id_tag}`

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

const selectAllTagsByCategoriaModel = async (categoria) => {
    let sql = `select tbl_tag.id as id_tag, tbl_tag.nome as nome, tbl_tag.imagem as imagem, tbl_categoria.id as id_categoria, tbl_categoria.nome as nome_categoria
    from tbl_tag
        inner join tbl_categoria
            on tbl_tag.id_categoria = tbl_categoria.id
    where tbl_categoria.nome = '${categoria}';`

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

const selectAllTagsModel = async () => {
    let sql = `select * from tbl_tag`

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
    selectTagByIdModel,
    selectAllTagsByCategoriaModel,
    selectAllTagsModel
}