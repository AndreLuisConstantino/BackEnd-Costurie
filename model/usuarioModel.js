/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client')

var prisma = new PrismaClient()

const insertUsuarioModel = async (dadosUsuario) => {
    let sql = `insert into tbl_usuario(nome_de_usuario, email, senha) values ('${dadosUsuario.nome_de_usuario}', '${dadosUsuario.email}', '${dadosUsuario.senha}');`


    let resultStatus = await prisma.$executeRawUnsafe(sql)

    console.log(resultStatus);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Retorna o ultimo id inserido pelo banco de dados
const selectLastIDModel = async () => {

    let sql = `select 
                    tbl_usuario.id as id_usuario, 
                    tbl_usuario.nome_de_usuario as tag_usuario, 
                    tbl_usuario.email  
                from tbl_usuario order by id desc limit 1;`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }

}

const selectUserByLoginModel = async (dadosLogin) => {
    let sql = `select tbl_usuario.id ,tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario where tbl_usuario.email = '${dadosLogin.email}' and tbl_usuario.senha = '${dadosLogin.senha}'`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectUserByEmailModel = async (dadosEmail) => {

    let sql = `select tbl_usuario.id, tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario where tbl_usuario.email = '${dadosEmail.email}';`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectUserByIdModel = async (id) => {
    let sql = `select * from tbl_usuario where id = ${id}`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const updateUserTokenAndExpiresModel = async (id, token, tempo_expiracao) => {
    //Script sql para atualizar os dados no BD
    let sql = `update tbl_usuario set token = '${token}', tempo_expiracao = '${tempo_expiracao}' where id = ${id};`

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const selectTokenAndIdModel = async (dadosBody) => {
    let sql = `select 
    tbl_usuario.id, 
    tbl_usuario.nome, 
    tbl_usuario.nome_de_usuario, 
    tbl_usuario.email, tbl_usuario.token, 
    tbl_usuario.tempo_expiracao 
    from tbl_usuario where tbl_usuario.token = '${dadosBody.token}' and tbl_usuario.id = '${dadosBody.id}'`

    let response = await prisma.$queryRawUnsafe(sql)


    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const updateUserPasswordModel = async (dadosBody) => {
    //Script sql para atualizar os dados no BD
    let sql = `update tbl_usuario set senha = '${dadosBody.senha}' where id = ${dadosBody.id};`

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const dadosUpdatePersonalizarPerfilModel = async (dadosBody) => {
    //Script sql para atualizar os dados no BD
    let sql = `update tbl_usuario set nome = '${dadosBody.nome}', descricao = '${dadosBody.descricao}', foto = '${dadosBody.foto}' where id = ${dadosBody.id};`

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

module.exports = {
    insertUsuarioModel,
    selectLastIDModel,
    selectUserByLoginModel,
    selectUserByEmailModel,
    selectUserByIdModel,
    updateUserTokenAndExpiresModel,
    selectTokenAndIdModel,
    updateUserPasswordModel,
    dadosUpdatePersonalizarPerfilModel
}