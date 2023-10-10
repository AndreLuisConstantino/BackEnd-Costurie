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
    let sql = `
    insert into tbl_usuario (
        nome_de_usuario, 
        email, 
        senha) values (
            '${dadosUsuario.nome_de_usuario}', 
            '${dadosUsuario.email}', 
            '${dadosUsuario.senha}'
            );`


    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Retorna o ultimo id inserido pelo banco de dados
const selectLastIDUsuarioModel = async () => {

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

const selectUserByEmailModel = async (email) => {

    let sql = `select tbl_usuario.id, tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario where tbl_usuario.email = '${email.email}';`

    let response = await prisma.$queryRawUnsafe(sql)
    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectUserByIdModel = async (id) => {
    // console.log(id);
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

    // console.log(sql);

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const selectUserByEmailTagNameModel = async (dadosBody) => {
    let sql = `select tbl_usuario.id ,tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario 
                    where 
                    tbl_usuario.email = '${dadosBody.email}' 
                    and tbl_usuario.nome_de_usuario = '${dadosBody.nome_de_usuario}';`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectProfileByIdModel = async (id) => {
    let sql = `select  tbl_usuario.id as id_usuario,
		tbl_usuario.nome as nome,
		tbl_usuario.descricao as descricao,
        tbl_usuario.foto as foto,
        tbl_usuario.nome_de_usuario as nome_de_usuario,
        tbl_usuario.email as email,
        tbl_usuario.senha as senha, 
        tbl_usuario.id_localizacao as id_localizacao,
		tbl_localizacao.bairro as bairro,
        tbl_localizacao.cidade as cidade,
        tbl_localizacao.estado as estado,
        tbl_tag.id as id_tag,
        tbl_tag.nome as nome_tag,
        tbl_tag.imagem as imagem_tag,
        tbl_categoria.id as id_categoria,
        tbl_categoria.nome as nome_categoria
from tbl_usuario
	inner join tbl_localizacao
		on tbl_localizacao.id = tbl_usuario.id_localizacao
	inner join tbl_tag_usuario
		on tbl_tag_usuario.id_usuario = tbl_usuario.id
	inner join tbl_tag
		on tbl_tag.id = tbl_tag_usuario.id_tag
	inner join tbl_categoria
		on tbl_categoria.id= tbl_tag.id_categoria
where id_usuario = ${id}`
    // console.log(sql);

    let response = await prisma.$queryRawUnsafe(sql)
    // console.log(response);

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const updateProfileTagLocalityModel = async (dadosBody) => {
    // console.log(dadosBody);

    //Script sql para atualizar os dados no BD
    let sql = `CALL sp_update_endereco_usuario_tag(
        ${dadosBody.id_usuario},        -- Substitua pelo ID do usuário
        ${dadosBody.id_localizacao},        -- Substitua pelo ID do endereço
        '${dadosBody.bairro}',      -- Substitua pelo novo valor do bairro
        '${dadosBody.cidade}',      -- Substitua pelo novo valor da cidade
        '${dadosBody.estado}',      -- Substitua pelo novo valor do estado
        '${dadosBody.nome}',        -- Substitua pelo novo valor do nome
        '${dadosBody.descricao}',   -- Substitua pela nova descrição
        '${dadosBody.foto}',        -- Substitua pela nova URL da foto
        '${dadosBody.nome_de_usuario}' -- Substitua pelo novo nome de usuário
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

const selectAllUsersModel = async () => {
    let sql = `select * from tbl_usuario`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const deleteUserByIdModel = async (id) => {
    let sql = `delete from tbl_usuario where id = ${id}`

    let response = await prisma.$executeRawUnsafe(sql)

    if (response) {
        return true
    } else {
        return false
    }
}

const selectUserAndLocalityById = async (id) => {
    let sql = `select  tbl_usuario.id as id_usuario,
                    tbl_usuario.nome as nome,
                    tbl_usuario.descricao as descricao,
                    tbl_usuario.foto as foto,
                    tbl_usuario.nome_de_usuario as nome_de_usuario,
                    tbl_usuario.email as email,
                    tbl_usuario.senha as senha, 
                    tbl_usuario.id_localizacao as id_localizacao,
                    tbl_localizacao.bairro as bairro,
                    tbl_localizacao.cidade as cidade,
                    tbl_localizacao.estado as estado
                from tbl_usuario
                inner join tbl_localizacao
                    on tbl_localizacao.id = tbl_usuario.id_localizacao
                where tbl_usuario.id = ${id}`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
} 

module.exports = {
    insertUsuarioModel,
    selectLastIDUsuarioModel
    ,
    selectUserByLoginModel,
    selectUserByEmailModel,
    selectUserByIdModel,
    updateUserTokenAndExpiresModel,
    selectTokenAndIdModel,
    updateUserPasswordModel,
    dadosUpdatePersonalizarPerfilModel,
    selectUserByEmailTagNameModel,
    selectProfileByIdModel,
    updateProfileTagLocalityModel,
    selectAllUsersModel,
    deleteUserByIdModel,
    selectUserAndLocalityById,
}